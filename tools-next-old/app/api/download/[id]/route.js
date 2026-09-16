import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { getDownloadUrl } from '@/lib/storage'
import { getFormat } from '@/lib/formats'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const job = await queryOne(
      'SELECT id, status, output_file_key, output_format, input_filename FROM jobs WHERE id = ?',
      [id]
    )

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.status !== 'completed' || !job.output_file_key) {
      return NextResponse.json({ error: 'File not ready' }, { status: 404 })
    }

    const toFmt = getFormat(job.output_format)
    const baseName = job.input_filename.replace(/\.[^.]+$/, '')
    const downloadFilename = `${baseName}${toFmt?.ext || '.' + job.output_format}`

    const url = await getDownloadUrl(job.output_file_key, downloadFilename)

    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
