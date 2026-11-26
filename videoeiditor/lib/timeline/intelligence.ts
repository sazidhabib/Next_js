import { SilenceInterval, SpeechSegment, SpeechWord, TimelineClip } from './types';
import { getClipPlaybackRate, MIN_CLIP_DURATION, roundTime } from './commands';

export interface TimeRange {
  start: number;
  end: number;
}

/**
 * Given total source range [sourceStart, sourceEnd] and detected silences, returns audible speech ranges
 * with padding preserved around speech boundaries so cuts do not clip consonants.
 */
export function computeAudibleRangesFromSilences(
  sourceStart: number,
  sourceEnd: number,
  silences: SilenceInterval[],
  minSilenceSec = 0.5,
  paddingSec = 0.12
): TimeRange[] {
  const validSilences = silences
    .filter((s) => s.duration >= minSilenceSec)
    .map((s) => ({
      start: Math.max(sourceStart, s.start + paddingSec),
      end: Math.min(sourceEnd, s.end - paddingSec),
    }))
    .filter((s) => s.end - s.start >= 0.15)
    .sort((a, b) => a.start - b.start);

  if (validSilences.length === 0) {
    return [{ start: sourceStart, end: sourceEnd }];
  }

  const keep: TimeRange[] = [];
  let cursor = sourceStart;

  for (const silence of validSilences) {
    if (silence.start > cursor + MIN_CLIP_DURATION) {
      keep.push({
        start: roundTime(cursor, 3),
        end: roundTime(silence.start, 3),
      });
    }
    cursor = Math.max(cursor, silence.end);
  }

  if (sourceEnd > cursor + MIN_CLIP_DURATION) {
    keep.push({
      start: roundTime(cursor, 3),
      end: roundTime(sourceEnd, 3),
    });
  }

  return keep;
}

/**
 * Groups word-level or raw segments into concise readable caption chunks (maxWordsPerCaption / maxDurationSec).
 */
export function groupWordsIntoCaptionSegments(
  words: SpeechWord[],
  maxWordsPerCaption = 6,
  maxDurationSec = 3.2
): SpeechSegment[] {
  if (words.length === 0) return [];

  const segments: SpeechSegment[] = [];
  let bucket: SpeechWord[] = [];

  const flush = () => {
    if (bucket.length === 0) return;
    const text = bucket
      .map((w) => w.word)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) {
      segments.push({
        start: roundTime(bucket[0].start, 3),
        end: roundTime(Math.max(bucket[bucket.length - 1].end, bucket[0].start + 0.35), 3),
        text,
      });
    }
    bucket = [];
  };

  for (const word of words) {
    if (bucket.length === 0) {
      bucket.push(word);
      continue;
    }

    const firstStart = bucket[0].start;
    const prevEnd = bucket[bucket.length - 1].end;
    const gap = word.start - prevEnd;
    const span = word.end - firstStart;
    const endsSentence = /[.!?]$/.test(bucket[bucket.length - 1].word);

    if (
      bucket.length >= maxWordsPerCaption ||
      span > maxDurationSec ||
      gap > 0.65 ||
      endsSentence
    ) {
      flush();
    }
    bucket.push(word);
  }

  flush();
  return segments;
}

/**
 * Projects source-media caption segments onto timeline coordinates for a specific clip.
 */
export function projectSegmentsToClipTimeline(
  clip: TimelineClip,
  segments: SpeechSegment[]
): Array<Omit<TimelineClip, 'id'>> {
  const rate = getClipPlaybackRate(clip);
  const srcStart = clip.sourceStart ?? 0;
  const srcEnd = srcStart + clip.duration * rate;

  const captionClips: Array<Omit<TimelineClip, 'id'>> = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.end <= srcStart || seg.start >= srcEnd) continue;

    const clampedStart = Math.max(srcStart, seg.start);
    const clampedEnd = Math.min(srcEnd, seg.end);
    const tlStart = roundTime(clip.startTime + (clampedStart - srcStart) / rate, 2);
    const tlDuration = roundTime(Math.max(0.35, (clampedEnd - clampedStart) / rate), 2);

    captionClips.push({
      name: `Caption ${i + 1}`,
      type: 'text',
      startTime: tlStart,
      duration: tlDuration,
      sourceStart: 0,
      playbackRate: 1,
      text: seg.text,
      opacity: 100,
      scale: 100,
      positionX: 0,
      positionY: 85,
      rotation: 0,
      color:
        'bg-black/75 border border-white/20 text-white px-3 py-1 rounded text-center font-bold tracking-tight',
    });
  }

  return captionClips;
}
