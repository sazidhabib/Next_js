import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAiEditPlan, getActiveDirectorEngine } from '@/lib/ai/director';
import { TimelinePromptContext } from '@/lib/ai/tools';

export const runtime = 'nodejs';

const CommandRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  context: z.object({
    playheadTime: z.number(),
    selectedClipId: z.string().nullable(),
    tracks: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['video', 'audio']),
        muted: z.boolean().optional(),
        locked: z.boolean().optional(),
      })
    ),
    clips: z.record(
      z.string(),
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          type: z.enum(['video', 'audio', 'text', 'overlay']),
          startTime: z.number(),
          duration: z.number(),
          sourceStart: z.number().optional(),
          playbackRate: z.number().optional(),
          volume: z.number().optional(),
          scale: z.number().optional(),
          appliedEffects: z.array(z.string()).optional(),
          text: z.string().optional(),
          mediaAssetId: z.string().optional(),
        })
      )
    ),
    mediaAssets: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['video', 'audio', 'image']),
        duration: z.number(),
        silencesCount: z.number().optional(),
        scenesCount: z.number().optional(),
        wordsCount: z.number().optional(),
        transcriptPreview: z.string().optional(),
      })
    ),
  }),
});

export async function GET() {
  return NextResponse.json(getActiveDirectorEngine());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CommandRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid AI command payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await generateAiEditPlan(
      parsed.data.prompt,
      parsed.data.context as TimelinePromptContext
    );

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI Director planning failed' },
      { status: 500 }
    );
  }
}
