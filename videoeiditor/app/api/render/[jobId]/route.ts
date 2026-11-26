import { NextRequest, NextResponse } from 'next/server';
import { cancelRenderJob, getRenderJob } from '@/lib/render/renderManager';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await ctx.params;
  const job = getRenderJob(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Render job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await ctx.params;
  const cancelled = cancelRenderJob(jobId);

  if (!cancelled) {
    return NextResponse.json({ error: 'Render job not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, jobId, status: 'cancelled' });
}
