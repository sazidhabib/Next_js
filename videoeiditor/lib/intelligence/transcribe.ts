import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getFfmpegBinary } from '../render/ffmpegBin';
import { SpeechSegment, SpeechWord } from '../timeline/types';
import { groupWordsIntoCaptionSegments } from '../timeline/intelligence';

const HF_CACHE_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), '.cineflow_data', 'hf_cache');

type AsrChunk = { text?: string; timestamp?: [number | null, number | null] };
type AsrOutput = { text?: string; chunks?: AsrChunk[] };
type AsrPipeline = (
  audio: Float32Array,
  options?: Record<string, unknown>
) => Promise<AsrOutput>;

const globalForAsr = globalThis as unknown as {
  __cineflowAsrPromise?: Promise<AsrPipeline>;
};

export async function extractPcm16kMono(filePath: string): Promise<Float32Array> {
  const { binPath } = getFfmpegBinary();
  const pcmBuffer = await new Promise<Buffer>((resolve, reject) => {
    const proc = spawn(
      binPath,
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-i',
        filePath,
        '-vn',
        '-f',
        'f32le',
        '-ac',
        '1',
        '-ar',
        '16000',
        'pipe:1',
      ],
      { windowsHide: true }
    );
    const chunks: Buffer[] = [];
    let errText = '';
    proc.stdout.on('data', (c: Buffer) => chunks.push(c));
    proc.stderr.on('data', (c: Buffer) => {
      errText += c.toString('utf8');
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`PCM decode failed (${code}): ${errText}`));
    });
  });

  const sampleCount = Math.floor(pcmBuffer.byteLength / 4);
  if (sampleCount === 0) {
    return new Float32Array(0);
  }
  return new Float32Array(pcmBuffer.buffer, pcmBuffer.byteOffset, sampleCount);
}

async function getWhisperPipeline(): Promise<AsrPipeline> {
  if (!globalForAsr.__cineflowAsrPromise) {
    globalForAsr.__cineflowAsrPromise = (async () => {
      await fs.mkdir(HF_CACHE_DIR, { recursive: true });
      const transformers = await import('@huggingface/transformers');
      transformers.env.cacheDir = HF_CACHE_DIR;
      const modelId = process.env.WHISPER_MODEL || 'Xenova/whisper-tiny.en';
      const asr = await transformers.pipeline('automatic-speech-recognition', modelId);
      return asr as unknown as AsrPipeline;
    })();
  }
  return globalForAsr.__cineflowAsrPromise;
}

export async function transcribeAudioLocal(
  filePath: string,
  durationFallback: number
): Promise<{
  words: SpeechWord[];
  speechSegments: SpeechSegment[];
  engine: string;
}> {
  const pcm = await extractPcm16kMono(filePath);
  if (pcm.length === 0) {
    return { words: [], speechSegments: [], engine: 'whisper-local (no audio)' };
  }

  const transcriber = await getWhisperPipeline();
  let output: AsrOutput;

  try {
    output = await transcriber(pcm, {
      return_timestamps: 'word',
      chunk_length_s: 30,
      stride_length_s: 5,
    });
  } catch {
    output = await transcriber(pcm, {
      return_timestamps: true,
      chunk_length_s: 30,
      stride_length_s: 5,
    });
  }

  const words: SpeechWord[] = [];
  const rawSegments: SpeechSegment[] = [];

  for (const chunk of output.chunks || []) {
    const text = (chunk.text || '').trim();
    if (!text) continue;
    const start = Math.max(0, chunk.timestamp?.[0] ?? 0);
    const end = Math.max(start + 0.12, chunk.timestamp?.[1] ?? start + 0.35);

    if (!text.includes(' ')) {
      words.push({
        word: text,
        start: parseFloat(start.toFixed(3)),
        end: parseFloat(end.toFixed(3)),
      });
    } else {
      rawSegments.push({
        start: parseFloat(start.toFixed(3)),
        end: parseFloat(end.toFixed(3)),
        text,
      });
      // Distribute segment timing across words cleanly
      const parts = text.split(/\s+/).filter(Boolean);
      const step = (end - start) / Math.max(1, parts.length);
      parts.forEach((w, idx) => {
        words.push({
          word: w,
          start: parseFloat((start + idx * step).toFixed(3)),
          end: parseFloat((start + (idx + 1) * step).toFixed(3)),
        });
      });
    }
  }

  let speechSegments =
    words.length > 0 ? groupWordsIntoCaptionSegments(words, 6, 3.2) : rawSegments;

  if (speechSegments.length === 0 && output.text?.trim()) {
    speechSegments = [
      {
        start: 0,
        end: Math.max(1, parseFloat(durationFallback.toFixed(2))),
        text: output.text.trim(),
      },
    ];
  }

  return {
    words,
    speechSegments,
    engine: process.env.WHISPER_MODEL || 'Xenova/whisper-tiny.en',
  };
}
