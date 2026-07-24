import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { uploadFile } from '@/lib/storage'
import { insert, queryOne, update } from '@/lib/db'
import { getFormat, getCreditCost } from '@/lib/formats'
import { convertFile, getConversionEngine } from '@/lib/conversions'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const inputFormat = formData.get('inputFormat')
    const outputFormat = formData.get('outputFormat')

    if (!file || !inputFormat || !outputFormat) {
      return NextResponse.json({ error: 'File, inputFormat, and outputFormat are required' }, { status: 400 })
    }

    const fromFmt = getFormat(inputFormat)
    const toFmt = getFormat(outputFormat)
    if (!fromFmt || !toFmt) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    const MAX_SIZE = 1 * 1024 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 1 GB limit' }, { status: 413 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { key: inputKey, size } = await uploadFile(buffer, file.name, file.type || 'application/octet-stream')

    const result = await insert(
      `INSERT INTO jobs (status, input_format, output_format, input_filename, input_file_key, input_file_size, engine)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['pending', inputFormat, outputFormat, file.name, inputKey, size, getConversionEngine(inputFormat, outputFormat)]
    )

    const jobId = result.insertId

    processConversion(jobId, inputKey, inputFormat, outputFormat).catch((err) => {
      console.error(`Conversion failed for job ${jobId}:`, err)
    })

    return NextResponse.json({ jobId })
  } catch (error) {
    console.error('Convert error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processConversion(jobId, inputKey, inputFormat, outputFormat) {
  try {
    await update('UPDATE jobs SET status = ?, started_at = NOW() WHERE id = ?', ['converting', jobId])
    await update('UPDATE jobs SET progress = 25 WHERE id = ?', [jobId])

    const { outputKey, size: outputSize } = await convertFile(inputKey, inputFormat, outputFormat)

    await update('UPDATE jobs SET progress = 90 WHERE id = ?', [jobId])

    const credits = getCreditCost(inputFormat, outputFormat)

    await update(
      `UPDATE jobs SET status = ?, output_file_key = ?, output_file_size = ?, credits_used = ?, 
       progress = 100, completed_at = NOW() WHERE id = ?`,
      ['completed', outputKey, outputSize, credits, jobId]
    )
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error)
    await update(
      'UPDATE jobs SET status = ?, error_message = ?, completed_at = NOW() WHERE id = ?',
      ['failed', error.message?.substring(0, 500) || 'Conversion failed', jobId]
    )
  }
}
