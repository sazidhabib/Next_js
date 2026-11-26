import { ChildProcess, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { ExportConfig, TimelineClip, Track } from '@/lib/timeline/types';
import { getFfmpegBinary, probeMediaWithFfprobe } from './ffmpegBin';
import { compileTimelineToFfmpegArgs, ResolvedClipInput } from './ffmpegCompiler';
import { ensureRenderDirs, getRenderOutputPath, resolveMediaSourceToLocalPath } from './workspace';

export type RenderJobStatus = 'queued' | 'preparing' | 'rendering' | 'completed' | 'failed' | 'cancelled';

export interface RenderJobState {
  jobId: string;
  status: RenderJobStatus;
  progress: number; // 0 - 100
  stage: string;
  outputFileName: string;
  outputPath?: string;
  fileSizeBytes?: number;
  error?: string;
  createdAt: number;
}

interface InternalRenderJob extends RenderJobState {
  process?: ChildProcess;
  cancelled?: boolean;
}

const globalForJobs = globalThis as unknown as {
  __cineflowRenderJobs?: Map<string, InternalRenderJob>;
};

const jobsMap: Map<string, InternalRenderJob> =
  globalForJobs.__cineflowRenderJobs ?? new Map<string, InternalRenderJob>();
globalForJobs.__cineflowRenderJobs = jobsMap;

export interface StartRenderPayload {
  tracks: Track[];
  clips: Record<string, TimelineClip[]>;
  exportConfig: ExportConfig;
}

export function getRenderJob(jobId: string): RenderJobState | null {
  const job = jobsMap.get(jobId);
  if (!job) return null;
  const { process: _proc, ...publicState } = job;
  void _proc;
  return publicState;
}

export function cancelRenderJob(jobId: string): boolean {
  const job = jobsMap.get(jobId);
  if (!job) return false;
  job.cancelled = true;
  job.status = 'cancelled';
  job.stage = 'Cancelled by user';
  if (job.process && !job.process.killed) {
    job.process.kill('SIGTERM');
  }
  return true;
}

export function createRenderJob(payload: StartRenderPayload): RenderJobState {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const job: InternalRenderJob = {
    jobId,
    status: 'queued',
    progress: 0,
    stage: 'Queued',
    outputFileName: payload.exportConfig.fileName || 'CineFlow_Export',
    createdAt: Date.now(),
  };

  jobsMap.set(jobId, job);
  void runRenderJob(job, payload);

  return getRenderJob(jobId)!;
}

async function runRenderJob(job: InternalRenderJob, payload: StartRenderPayload) {
  try {
    await ensureRenderDirs();
    job.status = 'preparing';
    job.stage = 'Resolving & probing media inputs...';
    job.progress = 4;

    const resolvedMediaByClipId: Record<string, ResolvedClipInput> = {};
    const clipUrlCache = new Map<string, ResolvedClipInput>();

    const allClips = Object.values(payload.clips).flat();
    for (const clip of allClips) {
      if (job.cancelled) return;
      if (clip.type === 'text') continue;
      if (!clip.assetUrl && !clip.mediaAssetId) continue;

      const cacheKey = `${clip.mediaAssetId || ''}::${clip.assetUrl || ''}`;
      const existing = clipUrlCache.get(cacheKey);
      if (existing) {
        resolvedMediaByClipId[clip.id] = existing;
        continue;
      }

      const localPath = await resolveMediaSourceToLocalPath(clip.assetUrl, clip.mediaAssetId);
      if (!localPath) continue;

      const probe = await probeMediaWithFfprobe(localPath);
      const entry: ResolvedClipInput = { localPath, probe };
      clipUrlCache.set(cacheKey, entry);
      resolvedMediaByClipId[clip.id] = entry;
    }

    if (job.cancelled) return;

    const tempOut = getRenderOutputPath(job.jobId, payload.exportConfig.fileName, 'tmp');
    const compiled = compileTimelineToFfmpegArgs({
      tracks: payload.tracks,
      clips: payload.clips,
      exportConfig: payload.exportConfig,
      resolvedMediaByClipId,
      outputPath: tempOut,
    });

    const finalOutputPath = getRenderOutputPath(
      job.jobId,
      payload.exportConfig.fileName,
      compiled.outputExt
    );
    const args = compiled.args.map((arg) => (arg === tempOut ? finalOutputPath : arg));

    const safeBaseName =
      (payload.exportConfig.fileName || 'CineFlow_Export').replace(/\.[^.]+$/, '') || 'export';
    job.outputFileName = `${safeBaseName}.${compiled.outputExt}`;
    job.outputPath = finalOutputPath;
    job.status = 'rendering';
    job.stage = 'Encoding with local FFmpeg...';
    job.progress = 8;

    const { binPath } = getFfmpegBinary();
    const totalUs = Math.max(1_000_000, compiled.totalDurationSec * 1_000_000);

    await new Promise<void>((resolve, reject) => {
      const proc = spawn(binPath, args, { windowsHide: true });
      job.process = proc;

      let stderrTail = '';
      let stdoutBuffer = '';

      proc.stdout.on('data', (chunk: Buffer) => {
        stdoutBuffer += chunk.toString('utf8');
        const lines = stdoutBuffer.split(/\r?\n/);
        stdoutBuffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('out_time_us=')) {
            const us = Number(line.slice('out_time_us='.length).trim());
            if (Number.isFinite(us) && us >= 0) {
              const pct = Math.min(98, Math.max(8, Math.round(8 + (us / totalUs) * 90)));
              job.progress = pct;
              job.stage = `Encoding frames (${pct}%)`;
            }
          } else if (line === 'progress=end') {
            job.progress = 99;
          }
        }
      });

      proc.stderr.on('data', (chunk: Buffer) => {
        stderrTail = (stderrTail + chunk.toString('utf8')).slice(-2500);
      });

      proc.on('error', (err) => {
        reject(err);
      });

      proc.on('close', (code) => {
        job.process = undefined;
        if (job.cancelled) {
          reject(new Error('Cancelled'));
          return;
        }
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}: ${stderrTail.trim()}`));
        }
      });
    });

    const stat = await fs.stat(finalOutputPath);
    job.fileSizeBytes = stat.size;
    job.progress = 100;
    job.status = 'completed';
    job.stage = 'Render completed';
  } catch (err) {
    if (job.cancelled) return;
    job.status = 'failed';
    job.stage = 'Render failed';
    job.error = err instanceof Error ? err.message : 'Unknown FFmpeg render error';
  }
}
