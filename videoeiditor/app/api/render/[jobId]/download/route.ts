import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { getRenderJob } from '@/lib/render/renderManager';

export const runtime = 'nodejs';

function getMimeType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'video/mp4';
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await ctx.params;
  const job = getRenderJob(jobId);

  if (!job || job.status !== 'completed' || !job.outputPath) {
    return NextResponse.json({ error: 'Rendered output is not ready' }, { status: 404 });
  }

  try {
    const stat = await fsPromises.stat(job.outputPath);
    const nodeStream = fs.createReadStream(job.outputPath);

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => {
          controller.enqueue(typeof chunk === 'string' ? Buffer.from(chunk) : new Uint8Array(chunk));
        });
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        nodeStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': getMimeType(job.outputFileName),
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="${job.outputFileName.replace(/"/g, '')}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Output file missing on server' }, { status: 404 });
  }
}
