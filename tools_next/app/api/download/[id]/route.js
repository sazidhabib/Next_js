import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { getDownloadUrl, getFileBuffer } from '@/lib/storage'
import { getFormat } from '@/lib/formats'
import { getMimeType } from '@/lib/conversions'

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

    // If external S3 cloud storage is configured, redirect to signed URL
    if (process.env.STORAGE_ENDPOINT) {
      const url = await getDownloadUrl(job.output_file_key, downloadFilename)
      return NextResponse.redirect(url)
    }

    // For local storage, read and stream the file directly with attachment disposition
    const fileBuffer = await getFileBuffer(job.output_file_key)
    const mimeType = getMimeType(job.output_format)

    // UTF-8 encoded filename for Content-Disposition header
    const encodedFilename = encodeURIComponent(downloadFilename)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${downloadFilename.replace(/"/g, '')}"; filename*=UTF-8''${encodedFilename}`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

