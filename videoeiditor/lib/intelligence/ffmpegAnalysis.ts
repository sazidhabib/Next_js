import { spawn } from 'node:child_process';
import { getFfmpegBinary } from '../render/ffmpegBin';
import { SceneCut, SilenceInterval } from '../timeline/types';

function runFfmpegCapture(args: string[]): Promise<{ stdout: string; stderr: string }> {
  const { binPath } = getFfmpegBinary();
  return new Promise((resolve, reject) => {
    const proc = spawn(binPath, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0 || stderr.length > 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`FFmpeg analysis exited with code ${code}`));
      }
    });
  });
}

export async function detectSilences(
  filePath: string,
  totalDuration: number,
  noiseDb = -35,
  minDurationSec = 0.4
): Promise<SilenceInterval[]> {
  const { stderr } = await runFfmpegCapture([
    '-hide_banner',
    '-nostats',
    '-i',
    filePath,
    '-vn',
    '-af',
    `silencedetect=noise=${noiseDb}dB:d=${minDurationSec}`,
    '-f',
    'null',
    '-',
  ]);

  const intervals: SilenceInterval[] = [];
  let currentStart: number | null = null;

  for (const line of stderr.split(/\r?\n/)) {
    const startMatch = line.match(/silence_start:\s*([0-9.+-]+)/);
    if (startMatch) {
      const val = parseFloat(startMatch[1]);
      if (Number.isFinite(val)) {
        currentStart = Math.max(0, val);
      }
      continue;
    }

    const endMatch = line.match(/silence_end:\s*([0-9.+-]+)(?:\s*\|\s*silence_duration:\s*([0-9.+-]+))?/);
    if (endMatch) {
      const end = parseFloat(endMatch[1]);
      const parsedDur = endMatch[2] ? parseFloat(endMatch[2]) : undefined;
      if (Number.isFinite(end)) {
        const start = currentStart !== null ? currentStart : Math.max(0, end - (parsedDur ?? 0));
        const duration = parsedDur ?? Math.max(0, end - start);
        if (duration >= minDurationSec * 0.9) {
          intervals.push({
            start: parseFloat(start.toFixed(3)),
            end: parseFloat(end.toFixed(3)),
            duration: parseFloat(duration.toFixed(3)),
          });
        }
      }
      currentStart = null;
    }
  }

  if (currentStart !== null && totalDuration > currentStart + minDurationSec * 0.9) {
    intervals.push({
      start: parseFloat(currentStart.toFixed(3)),
      end: parseFloat(totalDuration.toFixed(3)),
      duration: parseFloat((totalDuration - currentStart).toFixed(3)),
    });
  }

  return intervals;
}

export async function detectScenes(filePath: string, threshold = 12): Promise<SceneCut[]> {
  const { stderr } = await runFfmpegCapture([
    '-hide_banner',
    '-nostats',
    '-i',
    filePath,
    '-an',
    '-vf',
    `scdet=threshold=${threshold},metadata=mode=print`,
    '-f',
    'null',
    '-',
  ]);

  const cuts: SceneCut[] = [];
  let pendingScore: number | null = null;

  for (const line of stderr.split(/\r?\n/)) {
    const scoreMatch = line.match(/lavfi\.scd\.score=([0-9.]+)/);
    if (scoreMatch) {
      pendingScore = parseFloat(scoreMatch[1]);
      continue;
    }

    const timeMatch = line.match(/lavfi\.scd\.time=([0-9.]+)/);
    if (timeMatch) {
      const time = parseFloat(timeMatch[1]);
      if (Number.isFinite(time) && time > 0.1) {
        cuts.push({
          time: parseFloat(time.toFixed(3)),
          score: pendingScore !== null ? parseFloat(pendingScore.toFixed(2)) : threshold,
        });
      }
      pendingScore = null;
    }
  }

  return cuts;
}

export async function measureLoudness(filePath: string): Promise<number | undefined> {
  const { stderr } = await runFfmpegCapture([
    '-hide_banner',
    '-nostats',
    '-i',
    filePath,
    '-vn',
    '-af',
    'ebur128=framelog=quiet',
    '-f',
    'null',
    '-',
  ]);

  // Match Summary Integrated loudness: "I:         -18.4 LUFS"
  const matches = Array.from(stderr.matchAll(/\bI:\s*(-?[0-9]+(?:\.[0-9]+)?)\s*LUFS/g));
  if (matches.length === 0) return undefined;
  const last = matches[matches.length - 1];
  const val = parseFloat(last[1]);
  return Number.isFinite(val) ? parseFloat(val.toFixed(1)) : undefined;
}

export async function extractWaveformPeaks(filePath: string, bins = 64): Promise<number[]> {
  const { binPath } = getFfmpegBinary();
  const pcmBuffer = await new Promise<Buffer>((resolve, reject) => {
    const proc = spawn(
      binPath,
      ['-hide_banner', '-loglevel', 'error', '-i', filePath, '-vn', '-f', 'f32le', '-ac', '1', '-ar', '4000', 'pipe:1'],
      { windowsHide: true }
    );
    const chunks: Buffer[] = [];
    proc.stdout.on('data', (c: Buffer) => chunks.push(c));
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve(Buffer.concat(chunks));
      else reject(new Error(`Waveform extraction failed with code ${code}`));
    });
  });

  const sampleCount = Math.floor(pcmBuffer.byteLength / 4);
  if (sampleCount === 0) return [];

  const samples = new Float32Array(pcmBuffer.buffer, pcmBuffer.byteOffset, sampleCount);
  const binSize = Math.max(1, Math.floor(sampleCount / bins));
  const peaks: number[] = [];
  let maxPeak = 0.0001;

  for (let i = 0; i < bins; i++) {
    const start = i * binSize;
    const end = i === bins - 1 ? sampleCount : Math.min(sampleCount, start + binSize);
    let peak = 0;
    for (let j = start; j < end; j++) {
      const abs = Math.abs(samples[j]);
      if (abs > peak) peak = abs;
    }
    peaks.push(peak);
    if (peak > maxPeak) maxPeak = peak;
  }

  return peaks.map((p) => parseFloat(Math.min(1, p / maxPeak).toFixed(2)));
}
