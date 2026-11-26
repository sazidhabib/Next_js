import { TimelineClip, Track } from './types';

export const MIN_CLIP_DURATION = 0.2;
export const MIN_TIMELINE_RUNWAY = 30;

export function roundTime(value: number, precision = 2): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

export function getClipPlaybackRate(clip: TimelineClip): number {
  return clip.playbackRate && clip.playbackRate > 0 ? clip.playbackRate : 1;
}

/**
 * Computes the total timeline duration across all tracks with padding for editing runway.
 */
export function computeTimelineDuration(
  clipsMap: Record<string, TimelineClip[]>,
  minRunway = MIN_TIMELINE_RUNWAY
): number {
  let maxEnd = 0;
  for (const trackClips of Object.values(clipsMap)) {
    for (const clip of trackClips) {
      const end = clip.startTime + clip.duration;
      if (end > maxEnd) maxEnd = end;
    }
  }
  return Math.max(minRunway, Math.ceil(maxEnd + 5));
}

/**
 * Collects snap-worthy timestamps (0, playhead, and all other clip start/end edges).
 */
export function collectSnapTargets(
  clipsMap: Record<string, TimelineClip[]>,
  playheadTime: number,
  excludeClipId?: string | null
): number[] {
  const targets = new Set<number>([0, roundTime(playheadTime)]);
  for (const trackClips of Object.values(clipsMap)) {
    for (const clip of trackClips) {
      if (clip.id === excludeClipId) continue;
      targets.add(roundTime(clip.startTime));
      targets.add(roundTime(clip.startTime + clip.duration));
    }
  }
  return Array.from(targets);
}

/**
 * Snaps a candidate timestamp to the nearest target within toleranceSeconds.
 */
export function snapTime(
  candidateTime: number,
  targets: number[],
  toleranceSeconds: number
): number {
  let best = candidateTime;
  let bestDist = toleranceSeconds;
  for (const target of targets) {
    const dist = Math.abs(candidateTime - target);
    if (dist <= bestDist) {
      bestDist = dist;
      best = target;
    }
  }
  return Math.max(0, roundTime(best));
}

/**
 * Finds the track ID and clip matching clipId.
 */
export function findClipLocation(
  clipsMap: Record<string, TimelineClip[]>,
  clipId: string
): { trackId: string; index: number; clip: TimelineClip } | null {
  for (const [trackId, list] of Object.entries(clipsMap)) {
    const index = list.findIndex((c) => c.id === clipId);
    if (index !== -1) {
      return { trackId, index, clip: list[index] };
    }
  }
  return null;
}

/**
 * Computes updated startTime, duration, and sourceStart when trimming the left or right edge.
 * Prevents trimming past source media boundaries when sourceDuration is known.
 */
export function computeTrimmedClipPatch(
  initialClip: TimelineClip,
  direction: 'left' | 'right',
  deltaTime: number
): Partial<TimelineClip> {
  const rate = getClipPlaybackRate(initialClip);
  const initialSourceStart = initialClip.sourceStart ?? 0;
  const maxSourceDuration = initialClip.sourceDuration;

  if (direction === 'right') {
    let newDuration = Math.max(MIN_CLIP_DURATION, initialClip.duration + deltaTime);
    if (maxSourceDuration !== undefined && maxSourceDuration > 0) {
      const maxTimelineDuration = (maxSourceDuration - initialSourceStart) / rate;
      if (maxTimelineDuration >= MIN_CLIP_DURATION) {
        newDuration = Math.min(newDuration, maxTimelineDuration);
      }
    }
    return {
      duration: roundTime(newDuration),
    };
  }

  // Left-edge trim: shift startTime & sourceStart forward/backward while keeping endTime fixed
  const initialEnd = initialClip.startTime + initialClip.duration;
  let targetStart = initialClip.startTime + deltaTime;

  // Cannot start before t = 0
  targetStart = Math.max(0, targetStart);

  // Cannot shrink clip below MIN_CLIP_DURATION
  targetStart = Math.min(targetStart, initialEnd - MIN_CLIP_DURATION);

  // Cannot extend left before sourceStart = 0
  const maxExtendLeftTimeline = initialSourceStart / rate;
  const minAllowedStart = initialClip.startTime - maxExtendLeftTimeline;
  targetStart = Math.max(targetStart, minAllowedStart);

  const appliedDelta = targetStart - initialClip.startTime;
  const newDuration = initialClip.duration - appliedDelta;
  const newSourceStart = Math.max(0, initialSourceStart + appliedDelta * rate);

  return {
    startTime: roundTime(targetStart),
    duration: roundTime(newDuration),
    sourceStart: roundTime(newSourceStart, 3),
  };
}

/**
 * Splits a clip cleanly at splitTime into two contiguous clips with accurate sourceStart offsets.
 * Returns updated clipsMap or null if splitTime is not strictly inside the clip.
 */
export function splitClipInMap(
  clipsMap: Record<string, TimelineClip[]>,
  tracks: Track[],
  clipId: string,
  splitTime: number,
  createId: () => string
): { clips: Record<string, TimelineClip[]>; secondClipId: string } | null {
  const loc = findClipLocation(clipsMap, clipId);
  if (!loc) return null;

  const track = tracks.find((t) => t.id === loc.trackId);
  if (track?.locked) return null;

  const { clip, trackId, index } = loc;
  const clipEnd = clip.startTime + clip.duration;

  if (splitTime <= clip.startTime + MIN_CLIP_DURATION || splitTime >= clipEnd - MIN_CLIP_DURATION) {
    return null;
  }

  const firstDuration = roundTime(splitTime - clip.startTime);
  const secondDuration = roundTime(clipEnd - splitTime);
  const rate = getClipPlaybackRate(clip);
  const firstSourceStart = clip.sourceStart ?? 0;
  const secondSourceStart = roundTime(firstSourceStart + firstDuration * rate, 3);

  const firstClip: TimelineClip = {
    ...clip,
    duration: firstDuration,
    sourceStart: firstSourceStart,
  };

  const secondClipId = createId();
  const secondClip: TimelineClip = {
    ...clip,
    id: secondClipId,
    startTime: roundTime(splitTime),
    duration: secondDuration,
    sourceStart: secondSourceStart,
  };

  const nextTrackClips = [...(clipsMap[trackId] || [])];
  nextTrackClips.splice(index, 1, firstClip, secondClip);

  return {
    clips: {
      ...clipsMap,
      [trackId]: nextTrackClips,
    },
    secondClipId,
  };
}

/**
 * Removes a clip and shifts subsequent clips on the same track left by the removed clip's duration.
 */
export function rippleDeleteClipInMap(
  clipsMap: Record<string, TimelineClip[]>,
  tracks: Track[],
  clipId: string
): Record<string, TimelineClip[]> | null {
  const loc = findClipLocation(clipsMap, clipId);
  if (!loc) return null;

  const track = tracks.find((t) => t.id === loc.trackId);
  if (track?.locked) return null;

  const { clip, trackId } = loc;
  const clipEnd = clip.startTime + clip.duration;

  const updatedTrackClips = (clipsMap[trackId] || [])
    .filter((c) => c.id !== clipId)
    .map((c) =>
      c.startTime >= clipEnd - 0.001
        ? { ...c, startTime: Math.max(0, roundTime(c.startTime - clip.duration)) }
        : c
    );

  return {
    ...clipsMap,
    [trackId]: updatedTrackClips,
  };
}
