import fs from 'node:fs';
import { AspectRatio, ExportConfig, TimelineClip, Track } from '../timeline/types';
import { MediaProbeInfo } from './ffmpegBin';

export interface ResolvedClipInput {
  localPath: string;
  probe: MediaProbeInfo;
}

export interface CompileRenderParams {
  tracks: Track[];
  clips: Record<string, TimelineClip[]>;
  exportConfig: ExportConfig;
  resolvedMediaByClipId: Record<string, ResolvedClipInput>;
  outputPath: string;
  fontPath?: string | null;
}

export interface CompiledFfmpegCommand {
  args: string[];
  outputExt: string;
  totalDurationSec: number;
  width: number;
  height: number;
  fpsNumeric: number;
}

export function parseResolution(
  resolutionStr: string,
  aspectRatio: AspectRatio = '16:9'
): { width: number; height: number } {
  let baseLong = 1920;
  let baseShort = 1080;

  const match = resolutionStr.match(/(\d{3,4})\s*x\s*(\d{3,4})/i);
  if (match) {
    const a = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    baseLong = Math.max(a, b);
    baseShort = Math.min(a, b);
  } else if (resolutionStr.includes('4K')) {
    baseLong = 3840;
    baseShort = 2160;
  } else if (resolutionStr.includes('720p')) {
    baseLong = 1280;
    baseShort = 720;
  }

  const even = (n: number) => (n % 2 === 0 ? n : n - 1);

  if (aspectRatio === '9:16') {
    return { width: even(baseShort), height: even(baseLong) };
  }
  if (aspectRatio === '1:1') {
    return { width: even(baseShort), height: even(baseShort) };
  }
  if (aspectRatio === '4:5') {
    return { width: even(baseShort), height: even(Math.round((baseShort * 5) / 4)) };
  }
  return { width: even(baseLong), height: even(baseShort) };
}

export function parseFps(fpsStr: string): { fpsExpr: string; fpsNumeric: number } {
  if (fpsStr.includes('23.976')) return { fpsExpr: '24000/1001', fpsNumeric: 23.976 };
  if (fpsStr.includes('24')) return { fpsExpr: '24', fpsNumeric: 24 };
  if (fpsStr.includes('60')) return { fpsExpr: '60', fpsNumeric: 60 };
  return { fpsExpr: '30', fpsNumeric: 30 };
}

export function getFormatSettings(formatStr: string): {
  ext: string;
  codecArgs: (quality: number) => string[];
  hasAudio: boolean;
} {
  if (formatStr.includes('ProRes')) {
    return {
      ext: 'mov',
      hasAudio: true,
      codecArgs: () => [
        '-c:v',
        'prores_ks',
        '-profile:v',
        '2',
        '-pix_fmt',
        'yuv422p10le',
        '-c:a',
        'pcm_s16le',
      ],
    };
  }
  if (formatStr.includes('WebM')) {
    return {
      ext: 'webm',
      hasAudio: true,
      codecArgs: (quality) => {
        const crf = Math.max(15, Math.min(45, Math.round(45 - (quality / 100) * 30)));
        return ['-c:v', 'libvpx-vp9', '-crf', String(crf), '-b:v', '0', '-c:a', 'libopus', '-b:a', '160k'];
      },
    };
  }
  if (formatStr.includes('GIF')) {
    return {
      ext: 'gif',
      hasAudio: false,
      codecArgs: () => ['-loop', '0'],
    };
  }
  return {
    ext: 'mp4',
    hasAudio: true,
    codecArgs: (quality) => {
      const crf = Math.max(14, Math.min(32, Math.round(32 - (quality / 100) * 18)));
      return [
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        String(crf),
        '-pix_fmt',
        'yuv420p',
        '-c:a',
        'aac',
        '-b:a',
        '192k',
        '-movflags',
        '+faststart',
      ];
    },
  };
}

export function computeExportContentDuration(
  tracks: Track[],
  clips: Record<string, TimelineClip[]>
): number {
  let maxEnd = 0;
  for (const track of tracks) {
    if (track.muted) continue;
    for (const clip of clips[track.id] || []) {
      const end = clip.startTime + clip.duration;
      if (end > maxEnd) maxEnd = end;
    }
  }
  return Math.max(1, parseFloat(maxEnd.toFixed(3)));
}

export function findDefaultFontPath(): string | null {
  const candidates =
    process.platform === 'win32'
      ? [
          'C:/Windows/Fonts/segoeui.ttf',
          'C:/Windows/Fonts/arial.ttf',
          'C:/Windows/Fonts/seguisb.ttf',
        ]
      : process.platform === 'darwin'
      ? ['/System/Library/Fonts/Supplemental/Arial.ttf', '/System/Library/Fonts/Helvetica.ttc']
      : [
          '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
          '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function escapeDrawtext(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/%/g, '\\%')
    .replace(/\r?\n/g, ' ');
}

function escapeFontPath(fontPath: string): string {
  return fontPath.replace(/\\/g, '/').replace(/:/g, '\\:');
}

function buildAtempoChain(rate: number): string {
  const clamped = Math.max(0.25, Math.min(4, rate));
  if (Math.abs(clamped - 1) < 0.001) return '';
  const filters: string[] = [];
  let remaining = clamped;
  while (remaining > 2.0) {
    filters.push('atempo=2.0');
    remaining /= 2.0;
  }
  while (remaining < 0.5) {
    filters.push('atempo=0.5');
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(4)}`);
  return filters.join(',') + ',';
}

function buildEffectFilters(appliedEffects?: string[]): string[] {
  if (!appliedEffects || appliedEffects.length === 0) return [];
  const filters: string[] = [];
  if (appliedEffects.includes('Chromatic Aberration')) {
    filters.push('rgbashift=rh=-4:bh=4');
  }
  if (appliedEffects.includes('Emerald Forest')) {
    filters.push('hue=h=-25:s=0.75,eq=contrast=1.15:brightness=-0.04');
  }
  if (appliedEffects.includes('Vintage 35mm')) {
    filters.push(
      'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131,eq=contrast=1.18:saturation=0.85'
    );
  }
  if (appliedEffects.includes('VHS Overdrive')) {
    filters.push('eq=saturation=1.4:contrast=1.25:brightness=0.05');
  }
  return filters;
}

export function compileTimelineToFfmpegArgs(params: CompileRenderParams): CompiledFfmpegCommand {
  const { tracks, clips, exportConfig, resolvedMediaByClipId, outputPath } = params;
  const aspectRatio: AspectRatio = exportConfig.aspectRatio || '16:9';
  const { width, height } = parseResolution(exportConfig.resolution, aspectRatio);
  const { fpsExpr, fpsNumeric } = parseFps(exportConfig.fps);
  const format = getFormatSettings(exportConfig.format);
  const totalDurationSec = computeExportContentDuration(tracks, clips);
  const fontPath = params.fontPath !== undefined ? params.fontPath : findDefaultFontPath();
  const mastering = exportConfig.audioMastering;

  const inputArgs: string[] = [];
  const filterSteps: string[] = [];

  // Base black canvas
  filterSteps.push(`color=c=black:s=${width}x${height}:r=${fpsExpr}:d=${totalDurationSec}[vbase0]`);
  let currentVideoLabel = 'vbase0';
  let stepCounter = 0;

  const videoTracksBottomToTop = tracks.filter((t) => t.type === 'video' && !t.muted).reverse();
  const voiceAudioLabels: string[] = [];
  const bgmAudioLabels: string[] = [];

  let inputIndex = 0;
  const isVerticalOrSquare = aspectRatio !== '16:9';

  for (const track of videoTracksBottomToTop) {
    const trackClips = [...(clips[track.id] || [])].sort((a, b) => a.startTime - b.startTime);

    for (const clip of trackClips) {
      const start = Math.max(0, clip.startTime);
      const end = Math.max(start + 0.1, start + clip.duration);
      const rate = clip.playbackRate && clip.playbackRate > 0 ? clip.playbackRate : 1;
      const sourceStart = Math.max(0, clip.sourceStart ?? 0);
      const opacity = Math.max(0, Math.min(1, (clip.opacity ?? 100) / 100));
      const scaleRatio = Math.max(0.1, Math.min(2.5, (clip.scale ?? 100) / 100));

      if (clip.type === 'text' && clip.text) {
        const nextLabel = `vstep_${++stepCounter}`;
        const baseFont = Math.min(width, height) / 1080;
        const fontSize = Math.max(18, Math.round(baseFont * 46 * scaleRatio));
        const posX = Math.round((clip.positionX || 0) * (width / 960));
        const posY = Math.round((clip.positionY || 0) * (height / 540));
        const fontPart = fontPath ? `fontfile='${escapeFontPath(fontPath)}':` : '';
        const textEscaped = escapeDrawtext(
          clip.captionStyle === 'hormozi' ? clip.text.toUpperCase() : clip.text
        );

        const captionStyleArgs =
          clip.captionStyle === 'hormozi'
            ? `fontcolor=#ffb95f@${opacity.toFixed(2)}:borderw=4:bordercolor=black:box=1:boxcolor=black@0.70:boxborderw=14`
            : clip.captionStyle === 'neon'
            ? `fontcolor=#adc6ff@${opacity.toFixed(2)}:borderw=2:bordercolor=#002e6a:box=1:boxcolor=#00285d@0.65:boxborderw=14`
            : `fontcolor=white@${opacity.toFixed(2)}:borderw=2:bordercolor=black:box=1:boxcolor=black@0.55:boxborderw=14`;

        filterSteps.push(
          `[${currentVideoLabel}]drawtext=${fontPart}text='${textEscaped}':fontsize=${fontSize}:${captionStyleArgs}:x=(w-text_w)/2+(${posX}):y=(h-text_h)/2+(${posY}):enable='between(t,${start.toFixed(
            3
          )},${end.toFixed(3)})'[${nextLabel}]`
        );
        currentVideoLabel = nextLabel;
        continue;
      }

      const resolved = resolvedMediaByClipId[clip.id];
      if (!resolved) continue;
      const safeSourceStart = Math.min(
        sourceStart,
        Math.max(0, (resolved.probe.duration || 10) - 0.1)
      );

      if (clip.type === 'video') {
        const myIdx = inputIndex++;
        inputArgs.push('-i', resolved.localPath);

        const clipNode = `vc_${stepCounter++}`;
        const nextLabel = `vstep_${stepCounter}`;
        const targetW = Math.max(2, Math.trunc((width * scaleRatio) / 2) * 2);
        const targetH = Math.max(2, Math.trunc((height * scaleRatio) / 2) * 2);
        const posX = Math.round((clip.positionX || 0) * (width / 960));
        const posY = Math.round((clip.positionY || 0) * (height / 540));

        const vFilters: string[] = [
          `trim=start=${safeSourceStart.toFixed(3)}:duration=${(clip.duration * rate).toFixed(3)}`,
          `setpts=(PTS-STARTPTS)/${rate.toFixed(4)}`,
          `fps=${fpsExpr}`,
          isVerticalOrSquare
            ? `scale=w=${targetW}:h=${targetH}:force_original_aspect_ratio=increase,crop=${targetW}:${targetH}`
            : `scale=w=${targetW}:h=${targetH}:force_original_aspect_ratio=decrease`,
          ...buildEffectFilters(clip.appliedEffects),
        ];

        if (clip.transitionIn && clip.transitionIn !== 'none') {
          const transDur = Math.min(clip.duration * 0.45, clip.transitionDuration ?? 0.35);
          if (transDur > 0.05) {
            vFilters.push(`format=yuva420p,fade=t=in:st=0:d=${transDur.toFixed(2)}:alpha=1`);
          }
        }

        if (opacity < 0.999) {
          vFilters.push(`format=rgba,colorchannelmixer=aa=${opacity.toFixed(2)}`);
        } else if (!clip.transitionIn || clip.transitionIn === 'none') {
          vFilters.push('format=yuva420p');
        }

        // Shift PTS to timeline start AFTER clip-local fade-in
        vFilters.push(`setpts=PTS+${start.toFixed(3)}/TB`);

        filterSteps.push(`[${myIdx}:v]${vFilters.join(',')}[${clipNode}]`);
        filterSteps.push(
          `[${currentVideoLabel}][${clipNode}]overlay=x=(W-w)/2+(${posX}):y=(H-h)/2+(${posY}):eof_action=pass:enable='between(t,${start.toFixed(
            3
          )},${end.toFixed(3)})'[${nextLabel}]`
        );
        currentVideoLabel = nextLabel;

        if (format.hasAudio && resolved.probe.hasAudio && (clip.volume ?? 100) > 0) {
          const vol = ((clip.volume ?? 100) / 100).toFixed(2);
          const delayMs = Math.round(start * 1000);
          const atempo = buildAtempoChain(rate);
          const aLabel = `aud_v_${voiceAudioLabels.length + bgmAudioLabels.length}`;
          filterSteps.push(
            `[${myIdx}:a]atrim=start=${safeSourceStart.toFixed(3)}:duration=${(
              clip.duration * rate
            ).toFixed(3)},asetpts=PTS-STARTPTS,${atempo}aformat=sample_rates=48000:channel_layouts=stereo,volume=${vol},adelay=${delayMs}|${delayMs}[${aLabel}]`
          );
          voiceAudioLabels.push(`[${aLabel}]`);
        }
      } else if (clip.type === 'overlay') {
        const myIdx = inputIndex++;
        inputArgs.push('-loop', '1', '-i', resolved.localPath);

        const clipNode = `ov_${stepCounter++}`;
        const nextLabel = `vstep_${stepCounter}`;
        const targetW = Math.max(2, Math.trunc((width * scaleRatio) / 2) * 2);
        const targetH = Math.max(2, Math.trunc((height * scaleRatio) / 2) * 2);
        const posX = Math.round((clip.positionX || 0) * (width / 960));
        const posY = Math.round((clip.positionY || 0) * (height / 540));

        filterSteps.push(
          `[${myIdx}:v]trim=duration=${clip.duration.toFixed(3)},setpts=PTS-STARTPTS+${start.toFixed(
            3
          )}/TB,fps=${fpsExpr},scale=w=${targetW}:h=${targetH}:force_original_aspect_ratio=decrease,format=rgba,colorchannelmixer=aa=${opacity.toFixed(
            2
          )}[${clipNode}]`
        );
        filterSteps.push(
          `[${currentVideoLabel}][${clipNode}]overlay=x=(W-w)/2+(${posX}):y=(H-h)/2+(${posY}):eof_action=pass:enable='between(t,${start.toFixed(
            3
          )},${end.toFixed(3)})'[${nextLabel}]`
        );
        currentVideoLabel = nextLabel;
      }
    }
  }

  // Add unmuted audio tracks (split into Voice/Dialogue vs BGM for sidechain ducking)
  if (format.hasAudio) {
    const audioTracks = tracks.filter((t) => t.type === 'audio' && !t.muted);
    for (const track of audioTracks) {
      const isBgmTrack =
        track.id.toLowerCase() === 'a2' ||
        track.name.toLowerCase().includes('bgm') ||
        track.name.toLowerCase().includes('music');

      const trackClips = [...(clips[track.id] || [])].sort((a, b) => a.startTime - b.startTime);
      for (const clip of trackClips) {
        const resolved = resolvedMediaByClipId[clip.id];
        if (!resolved || !resolved.probe.hasAudio) continue;
        const volNum = (clip.volume ?? 100) / 100;
        if (volNum <= 0) continue;

        const myIdx = inputIndex++;
        inputArgs.push('-i', resolved.localPath);

        const start = Math.max(0, clip.startTime);
        const rate = clip.playbackRate && clip.playbackRate > 0 ? clip.playbackRate : 1;
        const sourceStart = Math.max(0, clip.sourceStart ?? 0);
        const safeAudioStart = Math.min(
          sourceStart,
          Math.max(0, (resolved.probe.duration || 10) - 0.1)
        );
        const delayMs = Math.round(start * 1000);
        const atempo = buildAtempoChain(rate);
        const aLabel = `aud_a_${voiceAudioLabels.length + bgmAudioLabels.length}`;

        filterSteps.push(
          `[${myIdx}:a]atrim=start=${safeAudioStart.toFixed(3)}:duration=${(
            clip.duration * rate
          ).toFixed(3)},asetpts=PTS-STARTPTS,${atempo}aformat=sample_rates=48000:channel_layouts=stereo,volume=${volNum.toFixed(
            2
          )},adelay=${delayMs}|${delayMs}[${aLabel}]`
        );

        if (isBgmTrack) {
          bgmAudioLabels.push(`[${aLabel}]`);
        } else {
          voiceAudioLabels.push(`[${aLabel}]`);
        }
      }
    }

    const totalAudioCount = voiceAudioLabels.length + bgmAudioLabels.length;
    let mixedLabel = '';

    if (totalAudioCount === 0) {
      filterSteps.push(`anullsrc=r=48000:cl=stereo,atrim=duration=${totalDurationSec}[aout]`);
    } else if (
      mastering?.autoDuckBgm &&
      voiceAudioLabels.length > 0 &&
      bgmAudioLabels.length > 0
    ) {
      // Combine voice streams -> [avox_raw], BGM streams -> [abgm_raw]
      if (voiceAudioLabels.length === 1) {
        filterSteps.push(
          `${voiceAudioLabels[0]}apad=whole_dur=${totalDurationSec},atrim=duration=${totalDurationSec}[avox_bus]`
        );
      } else {
        filterSteps.push(
          `${voiceAudioLabels.join('')}amix=inputs=${voiceAudioLabels.length}:duration=longest:dropout_transition=0:normalize=0,apad=whole_dur=${totalDurationSec},atrim=duration=${totalDurationSec}[avox_bus]`
        );
      }

      if (bgmAudioLabels.length === 1) {
        filterSteps.push(
          `${bgmAudioLabels[0]}apad=whole_dur=${totalDurationSec},atrim=duration=${totalDurationSec}[abgm_bus]`
        );
      } else {
        filterSteps.push(
          `${bgmAudioLabels.join('')}amix=inputs=${bgmAudioLabels.length}:duration=longest:dropout_transition=0:normalize=0,apad=whole_dur=${totalDurationSec},atrim=duration=${totalDurationSec}[abgm_bus]`
        );
      }

      filterSteps.push('[avox_bus]asplit=2[avox_main][avox_sc]');
      filterSteps.push(
        '[abgm_bus][avox_sc]sidechaincompress=threshold=0.02:ratio=6:attack=80:release=400:makeup=1[abgm_ducked]'
      );
      filterSteps.push(
        '[avox_main][abgm_ducked]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0[amixed]'
      );
      mixedLabel = 'amixed';
    } else {
      const allAudio = [...voiceAudioLabels, ...bgmAudioLabels];
      filterSteps.push(
        `${allAudio.join('')}amix=inputs=${allAudio.length}:duration=longest:dropout_transition=0:normalize=0,apad=whole_dur=${totalDurationSec},atrim=duration=${totalDurationSec}[amixed]`
      );
      mixedLabel = 'amixed';
    }

    if (mixedLabel) {
      const targetLufs = mastering?.targetLufs ?? -14;
      if (mastering?.normalizeLufs) {
        filterSteps.push(
          `[${mixedLabel}]loudnorm=I=${targetLufs}:TP=-1.5:LRA=11,alimiter=limit=0.95[aout]`
        );
      } else {
        filterSteps.push(`[${mixedLabel}]alimiter=limit=0.95[aout]`);
      }
    }
  }

  let finalVideoLabel = currentVideoLabel;
  if (format.ext === 'gif') {
    filterSteps.push(
      `[${currentVideoLabel}]fps=${Math.min(15, fpsNumeric)},scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse[vout]`
    );
    finalVideoLabel = 'vout';
  } else {
    filterSteps.push(`[${currentVideoLabel}]format=yuv420p[vout]`);
    finalVideoLabel = 'vout';
  }

  const args = [
    '-y',
    ...inputArgs,
    '-filter_complex',
    filterSteps.join(';'),
    '-map',
    `[${finalVideoLabel}]`,
    ...(format.hasAudio ? ['-map', '[aout]'] : []),
    '-t',
    String(totalDurationSec),
    ...format.codecArgs(exportConfig.quality),
    '-progress',
    'pipe:1',
    '-nostats',
    outputPath,
  ];

  return {
    args,
    outputExt: format.ext,
    totalDurationSec,
    width,
    height,
    fpsNumeric,
  };
}
