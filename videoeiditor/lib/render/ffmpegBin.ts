import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface MediaProbeInfo {
  duration: number;
  hasVideo: boolean;
  hasAudio: boolean;
  width?: number;
  height?: number;
}

function resolveExecutable(
  envVar: string,
  staticPkgName: 'ffmpeg-static' | 'ffprobe-static',
  fallbackCmd: string
): { binPath: string; source: 'env' | 'static' | 'system' } {
  const fromEnv = process.env[envVar];
  if (fromEnv && fs.existsSync(fromEnv)) {
    return { binPath: fromEnv, source: 'env' };
  }

  const exeSuffix = process.platform === 'win32' ? '.exe' : '';
  if (staticPkgName === 'ffmpeg-static') {
    const direct = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      'node_modules',
      'ffmpeg-static',
      `ffmpeg${exeSuffix}`
    );
    if (fs.existsSync(direct)) {
      return { binPath: direct, source: 'static' };
    }
  } else {
    const direct = path.join(
      /*turbopackIgnore: true*/ process.cwd(),
      'node_modules',
      'ffprobe-static',
      'bin',
      process.platform,
      process.arch,
      `ffprobe${exeSuffix}`
    );
    if (fs.existsSync(direct)) {
      return { binPath: direct, source: 'static' };
    }
  }

  return { binPath: fallbackCmd, source: 'system' };
}

export function getFfmpegBinary() {
  return resolveExecutable('FFMPEG_PATH', 'ffmpeg-static', 'ffmpeg');
}

export function getFfprobeBinary() {
  return resolveExecutable('FFPROBE_PATH', 'ffprobe-static', 'ffprobe');
}

export async function checkFfmpegHealth(): Promise<{
  available: boolean;
  ffmpegPath: string;
  ffmpegSource: string;
  ffprobePath: string;
  ffprobeSource: string;
  version?: string;
  error?: string;
}> {
  const ffmpeg = getFfmpegBinary();
  const ffprobe = getFfprobeBinary();

  try {
    const { stdout } = await execFileAsync(ffmpeg.binPath, ['-version'], { timeout: 5000 });
    const firstLine = stdout.split(/\r?\n/)[0]?.trim();
    return {
      available: true,
      ffmpegPath: ffmpeg.binPath,
      ffmpegSource: ffmpeg.source,
      ffprobePath: ffprobe.binPath,
      ffprobeSource: ffprobe.source,
      version: firstLine,
    };
  } catch (err) {
    return {
      available: false,
      ffmpegPath: ffmpeg.binPath,
      ffmpegSource: ffmpeg.source,
      ffprobePath: ffprobe.binPath,
      ffprobeSource: ffprobe.source,
      error: err instanceof Error ? err.message : 'FFmpeg executable not found',
    };
  }
}

export async function probeMediaWithFfprobe(filePath: string): Promise<MediaProbeInfo> {
  const { binPath } = getFfprobeBinary();
  try {
    const { stdout } = await execFileAsync(
      binPath,
      ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', filePath],
      { timeout: 15000 }
    );

    const parsed = JSON.parse(stdout) as {
      format?: { duration?: string };
      streams?: Array<{ codec_type?: string; width?: number; height?: number; duration?: string }>;
    };

    const streams = parsed.streams || [];
    const videoStream = streams.find((s) => s.codec_type === 'video');
    const audioStream = streams.find((s) => s.codec_type === 'audio');
    const rawDur = Number(parsed.format?.duration || videoStream?.duration || audioStream?.duration || 0);

    return {
      duration: Number.isFinite(rawDur) && rawDur > 0 ? rawDur : 10,
      hasVideo: Boolean(videoStream),
      hasAudio: Boolean(audioStream),
      width: videoStream?.width,
      height: videoStream?.height,
    };
  } catch {
    return {
      duration: 10,
      hasVideo: true,
      hasAudio: false,
    };
  }
}
