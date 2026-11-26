import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { probeMediaWithFfprobe } from '@/lib/render/ffmpegBin';
import { resolveMediaSourceToLocalPath } from '@/lib/render/workspace';
import {
  detectScenes,
  detectSilences,
  extractWaveformPeaks,
  measureLoudness,
} from '@/lib/intelligence/ffmpegAnalysis';
import { loadCachedAnalysis, saveCachedAnalysis } from '@/lib/intelligence/cache';
import { transcribeAudioLocal } from '@/lib/intelligence/transcribe';
import { MediaAnalysis } from '@/lib/timeline/types';

export const runtime = 'nodejs';

const AnalyzeRequestSchema = z.object({
  assetId: z.string().min(1),
  assetUrl: z.string().optional(),
  includeTranscript: z.boolean().optional().default(true),
  includeScenes: z.boolean().optional().default(true),
  includeSilences: z.boolean().optional().default(true),
  includeWaveform: z.boolean().optional().default(true),
  forceRefresh: z.boolean().optional().default(false),
  noiseDb: z.number().min(-60).max(-10).optional().default(-35),
  minSilenceSec: z.number().min(0.15).max(5).optional().default(0.4),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid analyze payload', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      assetId,
      assetUrl,
      includeTranscript,
      includeScenes,
      includeSilences,
      includeWaveform,
      forceRefresh,
      noiseDb,
      minSilenceSec,
    } = parsed.data;

    if (!forceRefresh) {
      const cached = await loadCachedAnalysis(assetId);
      if (
        cached &&
        (!includeTranscript || cached.speechSegments.length > 0 || !cached.hasAudio) &&
        (!includeWaveform || cached.waveformPeaks.length > 0 || !cached.hasAudio)
      ) {
        return NextResponse.json(cached);
      }
    }

    const localPath = await resolveMediaSourceToLocalPath(assetUrl, assetId);
    if (!localPath) {
      return NextResponse.json(
        { error: 'Media source could not be resolved locally' },
        { status: 404 }
      );
    }

    const probe = await probeMediaWithFfprobe(localPath);

    const [silences, scenes, loudnessLufs, waveformPeaks] = await Promise.all([
      includeSilences && probe.hasAudio
        ? detectSilences(localPath, probe.duration, noiseDb, minSilenceSec)
        : Promise.resolve([]),
      includeScenes && probe.hasVideo ? detectScenes(localPath) : Promise.resolve([]),
      probe.hasAudio ? measureLoudness(localPath) : Promise.resolve(undefined),
      includeWaveform && probe.hasAudio ? extractWaveformPeaks(localPath, 64) : Promise.resolve([]),
    ]);

    let words: MediaAnalysis['words'] = [];
    let speechSegments: MediaAnalysis['speechSegments'] = [];
    let transcriptEngine: string | undefined;

    if (includeTranscript && probe.hasAudio) {
      const transcript = await transcribeAudioLocal(localPath, probe.duration);
      words = transcript.words;
      speechSegments = transcript.speechSegments;
      transcriptEngine = transcript.engine;
    }

    const analysis: MediaAnalysis = {
      assetId,
      analyzedAt: new Date().toISOString(),
      duration: probe.duration,
      hasVideo: probe.hasVideo,
      hasAudio: probe.hasAudio,
      loudnessLufs,
      silences,
      scenes,
      speechSegments,
      words,
      waveformPeaks,
      transcriptEngine,
    };

    await saveCachedAnalysis(analysis);
    return NextResponse.json(analysis);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Media analysis failed' },
      { status: 500 }
    );
  }
}
