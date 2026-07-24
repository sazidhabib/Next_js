import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const job = await queryOne(
      'SELECT id, status, progress, input_format, output_format, input_filename, input_file_size, output_file_size, credits_used, error_message, created_at, completed_at FROM jobs WHERE id = ?',
      [id]
    )

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Job status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
