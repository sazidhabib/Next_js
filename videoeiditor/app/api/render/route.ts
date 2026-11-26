import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkFfmpegHealth } from '@/lib/render/ffmpegBin';
import { createRenderJob } from '@/lib/render/renderManager';

export const runtime = 'nodejs';

const TimelineClipSchema = z.object({
  id: z.string(),
  mediaAssetId: z.string().optional(),
  name: z.string(),
  type: z.enum(['video', 'audio', 'text', 'overlay']),
  startTime: z.number().min(0),
  duration: z.number().positive(),
  sourceStart: z.number().min(0).optional(),
  sourceDuration: z.number().positive().optional(),
  playbackRate: z.number().min(0.25).max(4).optional(),
  volume: z.number().min(0).max(100).optional(),
  opacity: z.number().min(0).max(100).optional(),
  scale: z.number().min(10).max(250).optional(),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  rotation: z.number().optional(),
  blendMode: z.string().optional(),
  appliedEffects: z.array(z.string()).optional(),
  transitionIn: z.enum(['none', 'fade', 'dissolve']).optional(),
  transitionDuration: z.number().min(0).max(5).optional(),
  captionStyle: z.enum(['hormozi', 'minimal', 'neon']).optional(),
  color: z.string().optional(),
  assetUrl: z.string().optional(),
  text: z.string().optional(),
});

const TrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['video', 'audio']),
  muted: z.boolean().optional(),
  locked: z.boolean().optional(),
});

const RenderRequestSchema = z.object({
  tracks: z.array(TrackSchema),
  clips: z.record(z.string(), z.array(TimelineClipSchema)),
  exportConfig: z.object({
    fileName: z.string().min(1),
    format: z.string().min(1),
    resolution: z.string().min(1),
    fps: z.string().min(1),
    quality: z.number().min(1).max(100),
    aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:5']).optional(),
    audioMastering: z
      .object({
        normalizeLufs: z.boolean(),
        targetLufs: z.number().min(-24).max(-6),
        autoDuckBgm: z.boolean(),
      })
      .optional(),
  }),
});

export async function GET() {
  const health = await checkFfmpegHealth();
  return NextResponse.json(health, { status: health.available ? 200 : 503 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RenderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid render payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const health = await checkFfmpegHealth();
    if (!health.available) {
      return NextResponse.json(
        { error: health.error || 'Local FFmpeg binary not available' },
        { status: 503 }
      );
    }

    const job = createRenderJob(parsed.data);
    return NextResponse.json(job, { status: 202 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to queue render job' },
      { status: 500 }
    );
  }
}
