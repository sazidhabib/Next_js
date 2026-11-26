import { useSyncExternalStore } from 'react';
import {
  AspectRatio,
  AudioMasteringConfig,
  EditorState,
  ExportConfig,
  MediaAnalysis,
  MediaAsset,
  Project,
  ProjectTimelineData,
  StylePreset,
  TimelineClip,
  Track,
} from '../lib/timeline/types';
import {
  computeTimelineDuration,
  findClipLocation,
  getClipPlaybackRate,
  rippleDeleteClipInMap,
  roundTime,
  splitClipInMap,
} from '../lib/timeline/commands';
import {
  computeAudibleRangesFromSilences,
  groupWordsIntoCaptionSegments,
  projectSegmentsToClipTimeline,
} from '../lib/timeline/intelligence';
import type { AiEditAction } from '../lib/ai/tools';
import { deleteMediaBlob, loadMediaBlob, loadMediaBlobUrl, saveMediaBlob } from '../lib/media/persistence';

export type {
  EditorState,
  ExportConfig,
  MediaAnalysis,
  MediaAsset,
  Project,
  ProjectTimelineData,
  TimelineClip,
  Track,
};

interface TimelineSnapshot {
  tracks: Track[];
  clips: Record<string, TimelineClip[]>;
  selectedClipId: string | null;
}

const MAX_HISTORY = 50;

const initialProjects: Project[] = [
  {
    id: 'p1',
    name: 'Summer Vibe Edit',
    duration: '00:28',
    size: '41.2 MB',
    modifiedAt: '2h ago',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOVIOoOljT4cEIBTBhIcO3kEIGEPL1N_ZHXB0AYEh0chbcmIa1yfLVWRCdNkBwRNeQ-OSYt9M--2s1JB2m98BCgEA8hf_1yxpvHbY2WrrT4nh4lNM-K5I9JItGkpZgIj_m0oI4jFnLFSjinnf8fX-_X4i6IXDpnCm_L6qkHCpMJ2ze4p8rcvytz5UKuM17R9FGu2FgYplFAq7_jhDd4B4ZqkfN1kS_0BBfAcTMxSFZCgwAjCygkbLBhMemKmi0W2unvDYwa0Vz_Syf',
  },
  {
    id: 'p2',
    name: 'Client Feedback Rev 2',
    duration: '00:00',
    size: '0 MB',
    modifiedAt: '5h ago',
    status: 'In Review',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyAgZin02ugijhGZxSQNZya-9aHnOmuQFv81uCFcm59aP2SqqJpbNj-dssQ-sVKG7JfSsZUvUCWrsAvq_0D5oqxjP2-LOg6H4iqGHREMVvTbH0M-Lo-VGqwabD-YRjbMgS0GWE9f08BjXUFpYcD0jEnusu0CFPkqroHOuLcI3XJuWGn_tdkqpbe7Nb7BrLOBTNZ7hozKz_dcV6dVzsHEZocitsAg8qL9V62uk5TnxJhEYmdphQld1fDMgJWu5E_AMwblqhm1ltLUwS',
  },
  {
    id: 'p3',
    name: 'Music Video Raw Cuts',
    duration: '00:00',
    size: '0 MB',
    modifiedAt: 'Yesterday',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDO2zn9cREUgk3NMzw-51xH8CnLnUpLbuRnNZvQYIjujnuqxTiyaX6OWLOaPsyqn9rDDlMHqvIjooyxS8NutVnDM_TiIyuH7KeMdtTArjA-mGtui8yBLtpAvP4tbyCVJddDca5n93OpDb4HAhUIIEFdPUTl1Rd3qfgJsypwv2YBuG-z86JyJbw1AHt6SiRQcu6r05fE8aOkU5toWc8BNsl-D7S2dSa940obRwUDJ2PVrD9bSNwidemY6tdZn8VVbDD2sxgIstA9evC8',
  },
  {
    id: 'p4',
    name: 'Mountain B-Roll Prep',
    duration: '00:00',
    size: '0 MB',
    modifiedAt: '3 days ago',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAVlm8MXm_wyNiRPJ4W5Nu8AhGkU4xxCThPEA9qCDP3Xt21bdDAyYz7Z_igyxkpxbpDINNBvXsui80Pqly4ie8OLBWWionQ22ezg9DOsJ8SQKhHVU0HpXG2B0gc_OW3wEjBSup3kEcBejo1NnAxnQfAi_2UYiE-hm-OIsdi4BiX8tVB135lHW1jjLYdEOAMQOo7BuAk4oS-6cDi0lLNhI2YntijGpeWi3PfXEKjugU4iqvqhjz2lKBUC9CAqtI_eWSewSXsP8zjcT2',
  },
];

const initialMediaAssets: MediaAsset[] = [
  {
    id: 'm1',
    name: 'Urban_Night_01.mp4',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43956-large.mp4',
    duration: 15,
    size: '28.4 MB',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB06H5N0CvZyuOUjYbm7dbfHjbvZnhNhZMDoNgB2vWi6f-b2aiOHss75sgZgtnbva6IC7MRN-h4-UYoM-BflURw5IWZNDCGw2I56avKb50Qmp7SG0l9y2mkWVfG0raIq84aIGqnsQLGxHeviwC0GGhgOc0hHt4_OKzH__ZvEH2NMFKTq9d0yCSUnGnHev4T1pHADwKyZaPQsOKm9KW7ppMAHX6yF_crv6bOXer4NIBPeWDojNSUstzhzNOZRslKVJJruxXZ5Le2Hhim',
  },
  {
    id: 'm2',
    name: 'Splash_Macro.mov',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-water-splash-on-black-background-34351-large.mp4',
    duration: 8,
    size: '14.2 MB',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVs0tJ7Kg2ysSR9K83pwqmH8Tggg7PqfL5-mu4H2gqg26ivfFqGxLR6z16zhSNu3wMaG_vIW32SlZSGs9yhZMsN9fcfSxOzx1EyvsOsHUSiKekOnphTrqdCjTZNpxvOeuUJmqvIDmGSePEmuZ-gaImkvQXX6HIlrHk9ahR4Hufj9HeflCUplWBz3wMSvD36LcoMOXMYocQT5dd1jHFdSD1Ph8Rh0RgY4Dh7dTf5tGK1-T3g76pgadjxtsnVn1mODIHXldHOzQhdnLm',
  },
  {
    id: 'm3',
    name: 'Forest_Aerial.mp4',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-fog-42205-large.mp4',
    duration: 24,
    size: '48.1 MB',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAargbmRJLaKeP1BX7DnT4an4xfZHBID2ei1kmsKBp997VzJZ57pxUDvXaUPdBsqIOOXXopHGs2sMB2E1H7EJC9k_Ech5UGuIJgrwJVuETzo6e4zWa6eQOMkb0qXlBb21gAZchRZg28CNhP5lQgL0E0jYrQYTBRUEKnVH3P_xWpkxpVl__fGZsWwIq53XWI3WPteYTKvRAguTa-B5AbJ13L-e0QNKOZtLfr2QzYGtxFK68IRosTPHw3803aSJeHaASXvZ0RVJ3juWov',
  },
  {
    id: 'm4',
    name: 'Gallery_Walk.mp4',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-in-an-art-gallery-40407-large.mp4',
    duration: 12,
    size: '18.7 MB',
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAso8_7A9sXu5ij1dMT9Flnno1hQy_x6wVzB1bWgoyP5tep4DGvBiOtT88RqscG8ViLtdnfphn6VTzopI8NvOUJZ8zf9KztN0zYZVGZ9IeM6N2r6-GvJqfk3j7z5s8IaJsPnyyGLmov9k6EPL4Qz7zvKk2fkhNR7SU7RGjw9j9AYeM2WW5lY_yH8IGjhe4s1a5WCNWsYB_A4p5EZsvhAq6xGyUiYcE-sLWMKbF0oT4JojE5eT4Cvx0lHdvpMMKLN4EX-rXKc1H_CA21',
  },
];

const initialTracks: Track[] = [
  { id: 'v3', name: 'V3 (TEXT)', type: 'video', muted: false, locked: false },
  { id: 'v2', name: 'V2 (VFX)', type: 'video', muted: false, locked: false },
  { id: 'v1', name: 'V1 (VID)', type: 'video', muted: false, locked: false },
  { id: 'a1', name: 'A1 (VOX)', type: 'audio', muted: false, locked: false },
  { id: 'a2', name: 'A2 (BGM)', type: 'audio', muted: false, locked: false },
];

const initialClips: Record<string, TimelineClip[]> = {
  v3: [
    {
      id: 'c_t1',
      name: 'Cyberpunk Neon',
      type: 'text',
      startTime: 3,
      duration: 6,
      sourceStart: 0,
      playbackRate: 1,
      text: 'NEON DISTRICT',
      scale: 120,
      opacity: 90,
      positionX: 0,
      positionY: -50,
      rotation: 0,
      color:
        'bg-primary-container/20 border border-primary/30 text-primary px-3 py-1 rounded font-bold tracking-widest',
    },
  ],
  v2: [
    {
      id: 'c_ov1',
      name: 'Overlay_LightLeak',
      type: 'overlay',
      startTime: 12,
      duration: 9.6,
      sourceStart: 0,
      playbackRate: 1,
      opacity: 40,
      appliedEffects: ['Chromatic Aberration'],
      color: 'bg-primary-container/40 border border-primary/50 text-on-primary-container',
    },
  ],
  v1: [
    {
      id: 'c_v1',
      mediaAssetId: 'm1',
      name: 'Urban_Night_01',
      type: 'video',
      startTime: 0,
      duration: 12,
      sourceStart: 0,
      sourceDuration: 15,
      playbackRate: 1,
      scale: 100,
      opacity: 100,
      positionX: 0,
      positionY: 0,
      rotation: 0,
      volume: 80,
      assetUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43956-large.mp4',
    },
    {
      id: 'c_v2',
      mediaAssetId: 'm2',
      name: 'Splash_Macro.mov',
      type: 'video',
      startTime: 12,
      duration: 16,
      sourceStart: 0,
      sourceDuration: 8,
      playbackRate: 1,
      scale: 100,
      opacity: 100,
      positionX: 0,
      positionY: 0,
      rotation: 0,
      volume: 90,
      assetUrl:
        'https://assets.mixkit.co/videos/preview/mixkit-water-splash-on-black-background-34351-large.mp4',
    },
  ],
  a1: [
    {
      id: 'c_a1',
      name: 'Background_Atmosphere.wav',
      type: 'audio',
      startTime: 0,
      duration: 12,
      sourceStart: 0,
      playbackRate: 1,
      volume: 50,
      color: 'bg-secondary-container/30 border border-secondary/40 text-secondary',
      assetUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
    },
    {
      id: 'c_a2',
      name: 'Splash_Sound_Design.wav',
      type: 'audio',
      startTime: 12,
      duration: 16,
      sourceStart: 0,
      playbackRate: 1,
      volume: 75,
      color: 'bg-secondary-container/30 border border-secondary/40 text-secondary',
      assetUrl: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-84.wav',
    },
  ],
  a2: [
    {
      id: 'c_a3',
      name: 'Cinematic_Soundtrack_v1.mp3',
      type: 'audio',
      startTime: 2.5,
      duration: 25.5,
      sourceStart: 0,
      playbackRate: 1,
      volume: 30,
      color: 'bg-secondary-container/10 border border-secondary/20 text-secondary',
      assetUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    },
  ],
};

const defaultState: EditorState = {
  activeProjectId: 'p1',
  projects: initialProjects,
  mediaAssets: initialMediaAssets,
  playheadTime: 4.2,
  isPlaying: false,
  zoom: 50,
  snapEnabled: true,
  selectedClipId: null,
  tracks: initialTracks,
  clips: initialClips,
  projectTracks: {
    p1: { tracks: initialTracks, clips: initialClips },
    p2: { tracks: initialTracks, clips: { v3: [], v2: [], v1: [], a1: [], a2: [] } },
    p3: { tracks: initialTracks, clips: { v3: [], v2: [], v1: [], a1: [], a2: [] } },
    p4: { tracks: initialTracks, clips: { v3: [], v2: [], v1: [], a1: [], a2: [] } },
  },
  exportingState: 'idle',
  exportProgress: 0,
  exportStage: 'Ready to render',
  exportJobId: null,
  exportError: null,
  exportFileSizeBytes: null,
  exportOutputFileName: null,
  exportConfig: {
    fileName: 'Project_Alpha_V1_Final',
    format: 'MP4 (H.264)',
    resolution: '1080p (1920 x 1080)',
    fps: '23.976 fps',
    quality: 85,
    aspectRatio: '16:9',
    audioMastering: {
      normalizeLufs: true,
      targetLufs: -14,
      autoDuckBgm: true,
    },
  },
  customStylePresets: [],
  canUndo: false,
  canRedo: false,
};

let globalState: EditorState = { ...defaultState };
let undoStack: TimelineSnapshot[] = [];
let redoStack: TimelineSnapshot[] = [];
let exportPollTimer: ReturnType<typeof setInterval> | null = null;

const isClient = typeof window !== 'undefined';
const listeners = new Set<() => void>();

const cloneSnapshot = (state: EditorState): TimelineSnapshot => ({
  tracks: state.tracks.map((t) => ({ ...t })),
  clips: Object.fromEntries(
    Object.entries(state.clips).map(([trackId, list]) => [
      trackId,
      list.map((c) => ({
        ...c,
        appliedEffects: c.appliedEffects ? [...c.appliedEffects] : undefined,
      })),
    ])
  ),
  selectedClipId: state.selectedClipId,
});

const pushHistory = () => {
  undoStack = [...undoStack.slice(-(MAX_HISTORY - 1)), cloneSnapshot(globalState)];
  redoStack = [];
};

const syncHistoryFlags = () => {
  globalState = {
    ...globalState,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const saveToLocalStorage = () => {
  if (!isClient) return;
  try {
    // Strip transient undo/redo flags when persisting
    const serializable = {
      ...globalState,
      isPlaying: false,
      exportingState: 'idle' as const,
      exportProgress: 0,
      canUndo: false,
      canRedo: false,
    };
    localStorage.setItem('cineflow_editor_state', JSON.stringify(serializable));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

const syncActiveProjectTracks = (tracks: Track[], clips: Record<string, TimelineClip[]>) => {
  if (!globalState.activeProjectId) return;
  globalState.projectTracks = {
    ...globalState.projectTracks,
    [globalState.activeProjectId]: { tracks, clips },
  };
  updateProjectDurationAndSize(globalState.activeProjectId);
};

const updateProjectDurationAndSize = (projectId: string) => {
  const pData = globalState.projectTracks[projectId];
  if (!pData) return;
  const clipsMap = pData.clips;

  let maxTime = 0;
  Object.values(clipsMap).forEach((clipList) => {
    clipList.forEach((clip) => {
      const endTime = clip.startTime + clip.duration;
      if (endTime > maxTime) {
        maxTime = endTime;
      }
    });
  });

  const mins = Math.floor(maxTime / 60);
  const secs = Math.floor(maxTime % 60);
  const durationStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  let totalVideoDuration = 0;
  let totalAudioDuration = 0;

  pData.tracks.forEach((track) => {
    const clipsList = clipsMap[track.id] || [];
    if (track.type === 'video') {
      clipsList.forEach((c) => (totalVideoDuration += c.duration));
    } else {
      clipsList.forEach((c) => (totalAudioDuration += c.duration));
    }
  });

  const sizeMb = (totalVideoDuration * 1.8 + totalAudioDuration * 0.2).toFixed(1);
  const sizeStr = parseFloat(sizeMb) > 0 ? `${sizeMb} MB` : '0 MB';

  globalState.projects = globalState.projects.map((proj) => {
    if (proj.id === projectId) {
      return {
        ...proj,
        duration: durationStr,
        size: sizeStr,
        modifiedAt: 'Just now',
      };
    }
    return proj;
  });
};

const createUniqueId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const rehydrateLocalMediaBlobs = async () => {
  if (!isClient) return;
  const localAssets = globalState.mediaAssets.filter((a) => a.isLocalFile);
  if (localAssets.length === 0) return;

  const freshUrls = new Map<string, string>();
  await Promise.all(
    localAssets.map(async (asset) => {
      const blobUrl = await loadMediaBlobUrl(asset.id);
      if (blobUrl) {
        freshUrls.set(asset.id, blobUrl);
      }
    })
  );

  if (freshUrls.size === 0) return;

  const updatedAssets = globalState.mediaAssets.map((asset) => {
    const fresh = freshUrls.get(asset.id);
    if (!fresh) return asset;
    return {
      ...asset,
      url: fresh,
      thumbnail: asset.type === 'image' ? fresh : asset.thumbnail,
    };
  });

  const refreshClipUrls = (clipsMap: Record<string, TimelineClip[]>) =>
    Object.fromEntries(
      Object.entries(clipsMap).map(([trackId, list]) => [
        trackId,
        list.map((clip) => {
          if (clip.mediaAssetId && freshUrls.has(clip.mediaAssetId)) {
            return { ...clip, assetUrl: freshUrls.get(clip.mediaAssetId) };
          }
          return clip;
        }),
      ])
    );

  const updatedClips = refreshClipUrls(globalState.clips);
  const updatedProjectTracks = Object.fromEntries(
    Object.entries(globalState.projectTracks).map(([pid, pData]) => [
      pid,
      { ...pData, clips: refreshClipUrls(pData.clips) },
    ])
  );

  globalState = {
    ...globalState,
    mediaAssets: updatedAssets,
    clips: updatedClips,
    projectTracks: updatedProjectTracks,
  };
  emitChange();
};

const resolveTargetTrackId = (trackIdOrType: string, fallbackType: 'video' | 'audio'): string => {
  const lowerId = trackIdOrType.toLowerCase();
  const foundTrack = globalState.tracks.find(
    (t) => t.id.toLowerCase() === lowerId || t.name.toLowerCase() === lowerId
  );
  if (foundTrack) return foundTrack.id;

  const matchingTrack = globalState.tracks.find((t) => t.type === fallbackType);
  if (matchingTrack) return matchingTrack.id;

  const newTrackId = `track_${fallbackType}_${Date.now()}`;
  const newTrackName = fallbackType === 'video' ? 'V1' : 'A1';
  const newTrack: Track = { id: newTrackId, name: newTrackName, type: fallbackType };
  globalState.tracks = [...globalState.tracks, newTrack];
  globalState.clips = { ...globalState.clips, [newTrackId]: [] };
  return newTrackId;
};

export const editorStore = {
  getState: () => globalState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  hydrate: () => {
    if (!isClient) return;
    try {
      const saved = localStorage.getItem('cineflow_editor_state');
      if (saved) {
        const parsed = JSON.parse(saved);

        const hasValidTracks = parsed && Array.isArray(parsed.tracks);
        const hasValidProjectTracks =
          parsed &&
          parsed.projectTracks &&
          Object.values(parsed.projectTracks).every((p: unknown) => {
            const proj = p as ProjectTimelineData | null;
            return Boolean(proj && Array.isArray(proj.tracks));
          });

        if (!hasValidTracks || !hasValidProjectTracks) {
          console.warn('Stale or incompatible layout detected in storage, resetting local state.');
          localStorage.removeItem('cineflow_editor_state');
          return;
        }

        globalState = {
          ...defaultState,
          ...parsed,
          isPlaying: false,
          exportingState: 'idle',
          exportProgress: 0,
          canUndo: false,
          canRedo: false,
        };
        undoStack = [];
        redoStack = [];
        emitChange();
        void rehydrateLocalMediaBlobs();
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  },

  pushHistoryCheckpoint: () => {
    pushHistory();
    syncHistoryFlags();
    emitChange();
  },

  undo: () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    undoStack = undoStack.slice(0, -1);
    redoStack = [...redoStack.slice(-(MAX_HISTORY - 1)), cloneSnapshot(globalState)];

    globalState = {
      ...globalState,
      tracks: prev.tracks,
      clips: prev.clips,
      selectedClipId: prev.selectedClipId,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
    };
    syncActiveProjectTracks(prev.tracks, prev.clips);
    emitChange();
    saveToLocalStorage();
  },

  redo: () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    redoStack = redoStack.slice(0, -1);
    undoStack = [...undoStack.slice(-(MAX_HISTORY - 1)), cloneSnapshot(globalState)];

    globalState = {
      ...globalState,
      tracks: next.tracks,
      clips: next.clips,
      selectedClipId: next.selectedClipId,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
    };
    syncActiveProjectTracks(next.tracks, next.clips);
    emitChange();
    saveToLocalStorage();
  },

  setPlayheadTime: (time: number) => {
    const maxTime = computeTimelineDuration(globalState.clips);
    const clamped = Math.max(0, Math.min(maxTime, roundTime(time, 2)));
    globalState = { ...globalState, playheadTime: clamped };
    emitChange();
  },

  setPlaying: (isPlaying: boolean) => {
    globalState = { ...globalState, isPlaying };
    emitChange();
  },

  setZoom: (zoom: number) => {
    globalState = { ...globalState, zoom: Math.max(10, Math.min(100, zoom)) };
    emitChange();
    saveToLocalStorage();
  },

  toggleSnap: () => {
    globalState = { ...globalState, snapEnabled: !globalState.snapEnabled };
    emitChange();
    saveToLocalStorage();
  },

  setSelectedClipId: (id: string | null) => {
    globalState = { ...globalState, selectedClipId: id };
    emitChange();
  },

  addMediaAsset: (asset: Omit<MediaAsset, 'id'>, fileBlob?: Blob) => {
    const id = createUniqueId('m');
    const newAsset: MediaAsset = {
      ...asset,
      id,
      isLocalFile: Boolean(fileBlob) || asset.isLocalFile,
    };
    if (fileBlob) {
      void saveMediaBlob(id, fileBlob);
    }
    globalState = {
      ...globalState,
      mediaAssets: [...globalState.mediaAssets, newAsset],
    };
    emitChange();
    saveToLocalStorage();
    return id;
  },

  setMediaAssetAnalysis: (assetId: string, analysis: MediaAnalysis) => {
    globalState = {
      ...globalState,
      mediaAssets: globalState.mediaAssets.map((a) =>
        a.id === assetId ? { ...a, analysis, duration: analysis.duration || a.duration } : a
      ),
    };
    emitChange();
    saveToLocalStorage();
  },

  analyzeMediaAsset: async (
    assetId: string,
    options: {
      assetUrl?: string;
      assetName?: string;
      includeTranscript?: boolean;
      includeScenes?: boolean;
      includeSilences?: boolean;
      includeWaveform?: boolean;
      forceRefresh?: boolean;
    } = {}
  ): Promise<MediaAnalysis> => {
    const asset = globalState.mediaAssets.find((a) => a.id === assetId);
    const resolvedUrl = options.assetUrl ?? asset?.url;

    if (asset?.isLocalFile || resolvedUrl?.startsWith('blob:')) {
      let blob = await loadMediaBlob(assetId);
      if (!blob && resolvedUrl?.startsWith('blob:')) {
        const res = await fetch(resolvedUrl);
        if (res.ok) blob = await res.blob();
      }
      if (blob) {
        const form = new FormData();
        form.append('assetId', assetId);
        form.append('file', blob, asset?.name || options.assetName || 'media_file');
        const upRes = await fetch('/api/media/upload', { method: 'POST', body: form });
        if (!upRes.ok) {
          throw new Error('Failed to upload local media for analysis');
        }
      }
    }

    const res = await fetch('/api/media/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assetId,
        assetUrl: resolvedUrl?.startsWith('blob:') ? undefined : resolvedUrl,
        includeTranscript: options.includeTranscript ?? true,
        includeScenes: options.includeScenes ?? true,
        includeSilences: options.includeSilences ?? true,
        includeWaveform: options.includeWaveform ?? true,
        forceRefresh: options.forceRefresh ?? false,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Media analysis failed');
    }

    const analysis = data as MediaAnalysis;
    if (asset) {
      editorStore.setMediaAssetAnalysis(assetId, analysis);
    }
    return analysis;
  },

  removeSilencesFromClip: async (
    clipId: string,
    minSilenceSec = 0.5,
    paddingSec = 0.12
  ): Promise<{ removedCount: number; savedSeconds: number }> => {
    const loc = findClipLocation(globalState.clips, clipId);
    if (!loc) throw new Error('Clip not found');
    const track = globalState.tracks.find((t) => t.id === loc.trackId);
    if (track?.locked) throw new Error('Track is locked');

    const { clip } = loc;
    const assetId = clip.mediaAssetId || clip.id;
    const analysis = await editorStore.analyzeMediaAsset(assetId, {
      assetUrl: clip.assetUrl,
      assetName: clip.name,
      includeTranscript: false,
      includeScenes: false,
      includeSilences: true,
      includeWaveform: true,
    });

    const rate = getClipPlaybackRate(clip);
    const srcStart = clip.sourceStart ?? 0;
    const srcEnd = srcStart + clip.duration * rate;
    const keepRanges = computeAudibleRangesFromSilences(
      srcStart,
      srcEnd,
      analysis.silences,
      minSilenceSec,
      paddingSec
    );

    const newTotalDuration = keepRanges.reduce((acc, r) => acc + (r.end - r.start) / rate, 0);
    const savedSeconds = roundTime(Math.max(0, clip.duration - newTotalDuration), 2);

    if (keepRanges.length === 0 || savedSeconds < 0.2) {
      return { removedCount: 0, savedSeconds: 0 };
    }

    pushHistory();
    let cursorTime = clip.startTime;
    const replacementClips: TimelineClip[] = keepRanges.map((range, idx) => {
      const dur = roundTime((range.end - range.start) / rate, 2);
      const piece: TimelineClip = {
        ...clip,
        id: idx === 0 ? clip.id : createUniqueId('c'),
        startTime: roundTime(cursorTime, 2),
        duration: dur,
        sourceStart: roundTime(range.start, 3),
      };
      cursorTime += dur;
      return piece;
    });

    const origEnd = clip.startTime + clip.duration;
    const existingTrackClips = globalState.clips[loc.trackId] || [];
    const nextTrackClips: TimelineClip[] = [];

    for (const c of existingTrackClips) {
      if (c.id === clip.id) {
        nextTrackClips.push(...replacementClips);
      } else if (c.startTime >= origEnd - 0.001) {
        nextTrackClips.push({
          ...c,
          startTime: Math.max(0, roundTime(c.startTime - savedSeconds, 2)),
        });
      } else {
        nextTrackClips.push(c);
      }
    }

    const updatedClips = {
      ...globalState.clips,
      [loc.trackId]: nextTrackClips,
    };

    globalState = { ...globalState, clips: updatedClips };
    syncHistoryFlags();
    syncActiveProjectTracks(globalState.tracks, updatedClips);
    emitChange();
    saveToLocalStorage();

    return {
      removedCount: Math.max(1, keepRanges.length - 1),
      savedSeconds,
    };
  },

  generateCaptionsFromTimeline: async (
    targetClipId?: string | null,
    stylePreset: 'hormozi' | 'minimal' | 'neon' = 'minimal'
  ): Promise<{ addedCount: number; firstStartTime: number | null; engine?: string }> => {
    const candidateClips: TimelineClip[] = [];

    if (targetClipId) {
      const loc = findClipLocation(globalState.clips, targetClipId);
      if (loc && (loc.clip.type === 'video' || loc.clip.type === 'audio') && loc.clip.assetUrl) {
        candidateClips.push(loc.clip);
      }
    } else {
      // Prefer A1 (VOX) / audio tracks first, then V1 (VID)
      const orderedTracks = [
        ...globalState.tracks.filter((t) => t.type === 'audio' && !t.muted),
        ...globalState.tracks.filter((t) => t.type === 'video' && !t.muted),
      ];
      for (const track of orderedTracks) {
        for (const clip of globalState.clips[track.id] || []) {
          if ((clip.type === 'audio' || clip.type === 'video') && clip.assetUrl) {
            candidateClips.push(clip);
          }
        }
        if (candidateClips.length > 0 && track.id === 'a1') break;
      }
    }

    if (candidateClips.length === 0) {
      throw new Error('No audio or video clips with media found on unlocked/unmuted tracks.');
    }

    const styleClassMap: Record<'hormozi' | 'minimal' | 'neon', string> = {
      hormozi:
        'bg-black/85 border-2 border-[#ffb95f] text-[#ffb95f] px-3 py-1 rounded-md text-center font-extrabold uppercase tracking-wide',
      minimal:
        'bg-black/75 border border-white/20 text-white px-3 py-1 rounded text-center font-bold tracking-tight',
      neon:
        'bg-primary-container/30 border border-primary/50 text-primary px-3 py-1 rounded font-bold tracking-widest text-center',
    };

    const allCaptionDrafts: Array<Omit<TimelineClip, 'id'>> = [];
    let lastEngine: string | undefined;

    for (const clip of candidateClips) {
      const assetId = clip.mediaAssetId || clip.id;
      const analysis = await editorStore.analyzeMediaAsset(assetId, {
        assetUrl: clip.assetUrl,
        assetName: clip.name,
        includeTranscript: true,
        includeScenes: false,
        includeSilences: false,
        includeWaveform: true,
      });

      lastEngine = analysis.transcriptEngine;
      const segments =
        analysis.words.length > 0
          ? groupWordsIntoCaptionSegments(analysis.words, stylePreset === 'hormozi' ? 4 : 6, 3.0)
          : analysis.speechSegments;

      if (segments.length > 0) {
        allCaptionDrafts.push(
          ...projectSegmentsToClipTimeline(clip, segments).map((draft) => ({
            ...draft,
            captionStyle: stylePreset,
            color: styleClassMap[stylePreset],
          }))
        );
      }
    }

    if (allCaptionDrafts.length === 0) {
      return { addedCount: 0, firstStartTime: null, engine: lastEngine };
    }

    editorStore.addCustomClips('v3', allCaptionDrafts);
    const firstStartTime = allCaptionDrafts[0].startTime;
    editorStore.setPlayheadTime(firstStartTime);
    return {
      addedCount: allCaptionDrafts.length,
      firstStartTime,
      engine: lastEngine,
    };
  },

  splitClipAtScenes: async (
    targetClipId?: string | null,
    maxSceneSplits = 12
  ): Promise<{ splitCount: number }> => {
    let clipToSplit: TimelineClip | null = null;
    if (targetClipId) {
      clipToSplit = findClipLocation(globalState.clips, targetClipId)?.clip ?? null;
    } else {
      const v1Track = globalState.tracks.find((t) => t.id === 'v1') || globalState.tracks.find((t) => t.type === 'video');
      if (v1Track) {
        clipToSplit = (globalState.clips[v1Track.id] || []).find((c) => c.type === 'video' && c.assetUrl) ?? null;
      }
    }

    if (!clipToSplit || !clipToSplit.assetUrl) {
      return { splitCount: 0 };
    }

    const assetId = clipToSplit.mediaAssetId || clipToSplit.id;
    const analysis = await editorStore.analyzeMediaAsset(assetId, {
      assetUrl: clipToSplit.assetUrl,
      assetName: clipToSplit.name,
      includeTranscript: false,
      includeScenes: true,
      includeSilences: false,
      includeWaveform: false,
    });

    const rate = getClipPlaybackRate(clipToSplit);
    const srcStart = clipToSplit.sourceStart ?? 0;
    const srcEnd = srcStart + clipToSplit.duration * rate;

    const timelineCutTimes = analysis.scenes
      .filter((s) => s.time > srcStart + 0.3 && s.time < srcEnd - 0.3)
      .slice(0, maxSceneSplits)
      .map((s) => roundTime(clipToSplit!.startTime + (s.time - srcStart) / rate, 2));

    let currentId: string | null = clipToSplit.id;
    let splitCount = 0;

    for (const cutTime of timelineCutTimes) {
      if (!currentId) break;
      const nextId = editorStore.splitClip(currentId, cutTime);
      if (nextId) {
        splitCount += 1;
        currentId = nextId;
      }
    }

    return { splitCount };
  },

  executeAiPlan: async (
    actions: AiEditAction[]
  ): Promise<{ appliedCount: number; logs: string[] }> => {
    if (actions.length === 0) return { appliedCount: 0, logs: [] };

    const undoSnapshotBeforeBatch = cloneSnapshot(globalState);
    const baseUndoLen = undoStack.length;
    const logs: string[] = [];
    let appliedCount = 0;

    const resolveTargetClips = (targetTrackId?: string, clipIds?: string[]): TimelineClip[] => {
      if (clipIds && clipIds.length > 0) {
        return clipIds
          .map((id) => findClipLocation(globalState.clips, id)?.clip)
          .filter((c): c is TimelineClip => Boolean(c));
      }
      const trackId = targetTrackId || 'v1';
      return globalState.clips[trackId] || [];
    };

    try {
      for (const action of actions) {
        switch (action.type) {
          case 'remove_silences': {
            const targetId =
              action.clipId ||
              globalState.selectedClipId ||
              (globalState.clips['a1']?.[0]?.assetUrl ? globalState.clips['a1'][0].id : undefined) ||
              (globalState.clips['v1']?.[0]?.assetUrl ? globalState.clips['v1'][0].id : undefined);

            if (!targetId) {
              logs.push('Skipped remove_silences: no audio/video clip found.');
              break;
            }
            const res = await editorStore.removeSilencesFromClip(
              targetId,
              action.minSilenceSec ?? 0.5,
              action.paddingSec ?? 0.12
            );
            appliedCount += 1;
            logs.push(
              res.savedSeconds > 0
                ? `Cut silences on ${targetId} (saved ${res.savedSeconds.toFixed(1)}s).`
                : `Checked silences on ${targetId} (no long pauses >= ${action.minSilenceSec ?? 0.5}s).`
            );
            break;
          }

          case 'split_at_scenes': {
            const res = await editorStore.splitClipAtScenes(
              action.clipId || globalState.selectedClipId,
              action.maxSceneSplits ?? 12
            );
            appliedCount += 1;
            logs.push(`Split at ${res.splitCount} detected scene cut(s).`);
            break;
          }

          case 'generate_captions': {
            const res = await editorStore.generateCaptionsFromTimeline(
              action.clipId || globalState.selectedClipId,
              action.stylePreset ?? 'hormozi'
            );
            appliedCount += 1;
            logs.push(
              res.addedCount > 0
                ? `Generated ${res.addedCount} ${action.stylePreset ?? 'hormozi'} caption(s).`
                : 'Ran Whisper transcription (no spoken words detected).'
            );
            break;
          }

          case 'apply_punch_in_zoom': {
            const clips = resolveTargetClips(action.targetTrack, action.clipIds);
            const scalePct = action.scalePercent ?? 114;
            let modified = 0;
            clips.forEach((c, idx) => {
              if (c.type === 'video' || c.type === 'overlay') {
                editorStore.updateClip(c.id, { scale: idx % 2 === 1 ? scalePct : 100 });
                modified += 1;
              }
            });
            if (modified > 0) appliedCount += 1;
            logs.push(`Applied alternating punch-in zoom (${scalePct}%) across ${modified} clip(s).`);
            break;
          }

          case 'split_clip': {
            const targetId =
              action.clipId ||
              globalState.selectedClipId ||
              Object.values(globalState.clips)
                .flat()
                .find(
                  (c) => action.time > c.startTime + 0.2 && action.time < c.startTime + c.duration - 0.2
                )?.id;
            if (targetId && editorStore.splitClip(targetId, action.time)) {
              appliedCount += 1;
              logs.push(`Split clip at ${action.time.toFixed(2)}s.`);
            } else {
              logs.push(`Skipped split at ${action.time.toFixed(2)}s (no valid clip boundary).`);
            }
            break;
          }

          case 'trim_clip': {
            const patch: Partial<TimelineClip> = {};
            if (action.startTime !== undefined) patch.startTime = action.startTime;
            if (action.duration !== undefined) patch.duration = action.duration;
            if (action.sourceStart !== undefined) patch.sourceStart = action.sourceStart;
            editorStore.updateClip(action.clipId, patch);
            appliedCount += 1;
            logs.push(`Trimmed clip ${action.clipId}.`);
            break;
          }

          case 'set_clip_speed': {
            const targets = action.clipId
              ? resolveTargetClips(undefined, [action.clipId])
              : globalState.selectedClipId
              ? resolveTargetClips(undefined, [globalState.selectedClipId])
              : resolveTargetClips(action.targetTrack || 'v1');
            targets.forEach((c) => {
              if (c.type === 'video' || c.type === 'audio') {
                const prevRate = getClipPlaybackRate(c);
                const nextDur = roundTime(Math.max(0.2, (c.duration * prevRate) / action.playbackRate), 2);
                editorStore.updateClip(c.id, {
                  playbackRate: action.playbackRate,
                  duration: nextDur,
                });
              }
            });
            appliedCount += 1;
            logs.push(`Set speed to ${action.playbackRate}x on ${targets.length} clip(s).`);
            break;
          }

          case 'apply_effect': {
            const targets = resolveTargetClips(action.targetTrack, action.clipIds);
            let count = 0;
            targets.forEach((c) => {
              if (c.type === 'video' || c.type === 'overlay') {
                const existing = c.appliedEffects || [];
                if (!existing.includes(action.effect)) {
                  editorStore.updateClip(c.id, { appliedEffects: [...existing, action.effect] });
                }
                count += 1;
              }
            });
            if (count > 0) appliedCount += 1;
            logs.push(`Applied "${action.effect}" to ${count} clip(s).`);
            break;
          }

          case 'add_text_overlay': {
            const styleClass =
              action.stylePreset === 'hormozi'
                ? 'bg-black/85 border-2 border-[#ffb95f] text-[#ffb95f] px-3 py-1 rounded-md text-center font-extrabold uppercase tracking-wide'
                : action.stylePreset === 'minimal'
                ? 'bg-black/75 border border-white/20 text-white px-3 py-1 rounded text-center font-bold'
                : 'bg-primary-container/20 border border-primary/40 text-primary px-3 py-1 rounded font-bold tracking-widest';
            editorStore.addCustomClip('v3', {
              name: action.text.slice(0, 20),
              type: 'text',
              startTime: action.startTime,
              duration: action.duration,
              text: action.text,
              opacity: 100,
              scale: action.scale ?? 115,
              positionX: 0,
              positionY: action.positionY ?? 0,
              rotation: 0,
              captionStyle: action.stylePreset ?? 'neon',
              color: styleClass,
            });
            appliedCount += 1;
            logs.push(`Added title "${action.text}" at ${action.startTime.toFixed(1)}s.`);
            break;
          }

          case 'set_aspect_ratio': {
            editorStore.updateExportConfig({ aspectRatio: action.aspectRatio as AspectRatio });
            appliedCount += 1;
            logs.push(`Set canvas aspect ratio to ${action.aspectRatio}.`);
            break;
          }

          case 'set_audio_mastering': {
            const nextMastering: AudioMasteringConfig = {
              normalizeLufs: action.normalizeLufs ?? true,
              targetLufs: action.targetLufs ?? -14,
              autoDuckBgm: action.autoDuckBgm ?? true,
            };
            editorStore.updateExportConfig({ audioMastering: nextMastering });
            appliedCount += 1;
            logs.push(
              `Audio mastering: ${nextMastering.targetLufs} LUFS${
                nextMastering.autoDuckBgm ? ' + sidechain BGM ducking' : ''
              }.`
            );
            break;
          }

          case 'set_clip_transition': {
            const targets = resolveTargetClips(action.targetTrack, action.clipIds);
            let count = 0;
            targets.forEach((c) => {
              if (c.type === 'video' || c.type === 'overlay' || c.type === 'text') {
                editorStore.updateClip(c.id, {
                  transitionIn: action.transitionIn,
                  transitionDuration: action.transitionDuration ?? 0.35,
                });
                count += 1;
              }
            });
            if (count > 0) appliedCount += 1;
            logs.push(`Applied "${action.transitionIn}" transition to ${count} clip(s).`);
            break;
          }

          case 'duck_audio': {
            const voiceTrack = action.voiceTrack || 'a1';
            const bgmTrack = action.bgmTrack || 'a2';
            const voiceClips = globalState.clips[voiceTrack] || [];
            const bgmClips = globalState.clips[bgmTrack] || [];
            voiceClips.forEach((c) =>
              editorStore.updateClip(c.id, { volume: action.voiceVolume ?? 95 })
            );
            bgmClips.forEach((c) =>
              editorStore.updateClip(c.id, { volume: action.bgmVolume ?? 22 })
            );
            appliedCount += 1;
            logs.push(
              `Balanced audio: ${voiceTrack.toUpperCase()} -> ${action.voiceVolume ?? 95}%, ${bgmTrack.toUpperCase()} -> ${action.bgmVolume ?? 22}%.`
            );
            break;
          }

          case 'insert_broll': {
            const asset = globalState.mediaAssets.find((a) => a.id === action.mediaAssetId);
            if (!asset) {
              logs.push(`Skipped B-roll: asset ${action.mediaAssetId} not found.`);
              break;
            }
            const clipId = editorStore.addClipToTrack(
              action.trackId || 'v2',
              asset,
              action.startTime
            );
            if (clipId && (action.duration || action.opacity !== undefined)) {
              editorStore.updateClip(clipId, {
                ...(action.duration ? { duration: action.duration } : {}),
                ...(action.opacity !== undefined ? { opacity: action.opacity } : {}),
              });
            }
            appliedCount += 1;
            logs.push(`Inserted B-roll "${asset.name}" at ${action.startTime.toFixed(1)}s.`);
            break;
          }

          case 'delete_clip': {
            if (action.ripple !== false) {
              editorStore.rippleDeleteClip(action.clipId);
            } else {
              editorStore.deleteClip(action.clipId);
            }
            appliedCount += 1;
            logs.push(`Deleted clip ${action.clipId}.`);
            break;
          }
        }
      }
    } finally {
      // Collapse multi-step AI mutations into ONE clean Undo checkpoint
      if (appliedCount > 0) {
        undoStack = [...undoStack.slice(0, baseUndoLen), undoSnapshotBeforeBatch];
        redoStack = [];
        syncHistoryFlags();
        emitChange();
        saveToLocalStorage();
      }
    }

    return { appliedCount, logs };
  },

  saveCustomStylePreset: (preset: StylePreset) => {
    const existing = globalState.customStylePresets || [];
    globalState = {
      ...globalState,
      customStylePresets: [preset, ...existing.filter((p) => p.id !== preset.id)],
    };
    emitChange();
    saveToLocalStorage();
  },

  deleteMediaAsset: (id: string) => {
    const target = globalState.mediaAssets.find((a) => a.id === id);
    if (target?.isLocalFile) {
      if (target.url.startsWith('blob:')) {
        URL.revokeObjectURL(target.url);
      }
      void deleteMediaBlob(id);
    }
    globalState = {
      ...globalState,
      mediaAssets: globalState.mediaAssets.filter((a) => a.id !== id),
    };
    emitChange();
    saveToLocalStorage();
  },

  addTrack: (type: 'video' | 'audio') => {
    pushHistory();
    const videoCount = globalState.tracks.filter((t) => t.type === 'video').length;
    const audioCount = globalState.tracks.filter((t) => t.type === 'audio').length;

    const trackId = `track_${type}_${Date.now()}`;
    const name = type === 'video' ? `V${videoCount + 1}` : `A${audioCount + 1}`;
    const newTrack: Track = { id: trackId, name, type, muted: false, locked: false };

    let newTracks = [...globalState.tracks];
    if (type === 'video') {
      const firstAudioIdx = newTracks.findIndex((t) => t.type === 'audio');
      if (firstAudioIdx !== -1) {
        newTracks.splice(firstAudioIdx, 0, newTrack);
      } else {
        newTracks = [newTrack, ...newTracks];
      }
    } else {
      newTracks = [...newTracks, newTrack];
    }

    const updatedClips = {
      ...globalState.clips,
      [trackId]: [],
    };

    globalState = {
      ...globalState,
      tracks: newTracks,
      clips: updatedClips,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(newTracks, updatedClips);
    emitChange();
    saveToLocalStorage();
  },

  deleteTrack: (trackId: string) => {
    const trackToDelete = globalState.tracks.find((t) => t.id === trackId);
    if (!trackToDelete) return;

    pushHistory();
    const newTracks = globalState.tracks.filter((t) => t.id !== trackId);
    const newClips = { ...globalState.clips };
    delete newClips[trackId];

    globalState = {
      ...globalState,
      tracks: newTracks,
      clips: newClips,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(newTracks, newClips);
    emitChange();
    saveToLocalStorage();
  },

  toggleTrackMute: (trackId: string) => {
    pushHistory();
    const newTracks = globalState.tracks.map((t) =>
      t.id === trackId ? { ...t, muted: !t.muted } : t
    );
    globalState = { ...globalState, tracks: newTracks };
    syncHistoryFlags();
    syncActiveProjectTracks(newTracks, globalState.clips);
    emitChange();
    saveToLocalStorage();
  },

  toggleTrackLock: (trackId: string) => {
    pushHistory();
    const newTracks = globalState.tracks.map((t) =>
      t.id === trackId ? { ...t, locked: !t.locked } : t
    );
    globalState = { ...globalState, tracks: newTracks };
    syncHistoryFlags();
    syncActiveProjectTracks(newTracks, globalState.clips);
    emitChange();
    saveToLocalStorage();
  },

  addCustomClip: (trackIdOrType: string, clipData: Omit<TimelineClip, 'id'>) => {
    pushHistory();
    const fallbackType = clipData.type === 'audio' ? 'audio' : 'video';
    const targetTrackId = resolveTargetTrackId(trackIdOrType, fallbackType);

    const targetTrack = globalState.tracks.find((t) => t.id === targetTrackId);
    if (targetTrack?.locked) {
      undoStack = undoStack.slice(0, -1);
      return '';
    }

    const newClip: TimelineClip = {
      sourceStart: 0,
      playbackRate: 1,
      ...clipData,
      id: createUniqueId('c'),
    };

    const updatedClips = {
      ...globalState.clips,
      [targetTrackId]: [...(globalState.clips[targetTrackId] || []), newClip],
    };

    globalState = {
      ...globalState,
      clips: updatedClips,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(globalState.tracks, updatedClips);
    emitChange();
    saveToLocalStorage();
    return newClip.id;
  },

  addCustomClips: (trackIdOrType: string, clipsList: Omit<TimelineClip, 'id'>[]) => {
    if (clipsList.length === 0) return;
    pushHistory();
    const isAudio = clipsList.some((c) => c.type === 'audio');
    const targetTrackId = resolveTargetTrackId(trackIdOrType, isAudio ? 'audio' : 'video');

    const targetTrack = globalState.tracks.find((t) => t.id === targetTrackId);
    if (targetTrack?.locked) {
      undoStack = undoStack.slice(0, -1);
      return;
    }

    const newClips: TimelineClip[] = clipsList.map((clipData, index) => ({
      sourceStart: 0,
      playbackRate: 1,
      ...clipData,
      id: `c_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
    }));

    const updatedClips = {
      ...globalState.clips,
      [targetTrackId]: [...(globalState.clips[targetTrackId] || []), ...newClips],
    };

    globalState = {
      ...globalState,
      clips: updatedClips,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(globalState.tracks, updatedClips);
    emitChange();
    saveToLocalStorage();
  },

  addClipToTrack: (trackIdOrType: string, asset: MediaAsset, startTime: number) => {
    return editorStore.addCustomClip(trackIdOrType, {
      mediaAssetId: asset.id,
      name: asset.name,
      type: asset.type === 'video' ? 'video' : asset.type === 'audio' ? 'audio' : 'overlay',
      startTime: Math.max(0, roundTime(startTime)),
      duration: asset.duration,
      sourceStart: 0,
      sourceDuration: asset.type === 'image' ? undefined : asset.duration,
      playbackRate: 1,
      volume: asset.type === 'audio' || asset.type === 'video' ? 100 : undefined,
      opacity: asset.type === 'video' || asset.type === 'image' ? 100 : undefined,
      scale: asset.type === 'video' || asset.type === 'image' ? 100 : undefined,
      positionX: asset.type === 'video' || asset.type === 'image' ? 0 : undefined,
      positionY: asset.type === 'video' || asset.type === 'image' ? 0 : undefined,
      rotation: asset.type === 'video' || asset.type === 'image' ? 0 : undefined,
      assetUrl: asset.url,
      color:
        asset.type === 'audio'
          ? 'bg-secondary-container/30 border border-secondary/40 text-secondary'
          : asset.type === 'video'
          ? 'border-outline bg-surface-container-highest text-on-surface'
          : 'bg-primary-container/40 border border-primary/50 text-on-primary-container',
    });
  },

  addTextClip: (startTime: number) => {
    return editorStore.addCustomClip('v3', {
      name: 'Custom Text',
      type: 'text',
      startTime: Math.max(0, roundTime(startTime)),
      duration: 5,
      sourceStart: 0,
      playbackRate: 1,
      text: 'Double click to edit',
      opacity: 100,
      scale: 100,
      positionX: 0,
      positionY: 0,
      rotation: 0,
      color:
        'bg-primary-container/20 border border-primary/30 text-primary px-3 py-1 rounded font-bold tracking-widest',
    });
  },

  updateClip: (
    clipId: string,
    updates: Partial<TimelineClip>,
    options: { recordHistory?: boolean } = {}
  ) => {
    const loc = findClipLocation(globalState.clips, clipId);
    if (!loc) return;

    const track = globalState.tracks.find((t) => t.id === loc.trackId);
    if (track?.locked) return;

    const { recordHistory = true } = options;
    if (recordHistory) {
      pushHistory();
    }

    const updatedClips = { ...globalState.clips };
    updatedClips[loc.trackId] = [...updatedClips[loc.trackId]];
    updatedClips[loc.trackId][loc.index] = {
      ...updatedClips[loc.trackId][loc.index],
      ...updates,
    };

    globalState = { ...globalState, clips: updatedClips };
    if (recordHistory) {
      syncHistoryFlags();
    }
    syncActiveProjectTracks(globalState.tracks, updatedClips);
    emitChange();
    saveToLocalStorage();
  },

  splitClip: (clipId: string, splitTime: number): string | null => {
    const result = splitClipInMap(globalState.clips, globalState.tracks, clipId, splitTime, () =>
      createUniqueId('c')
    );
    if (!result) return null;

    pushHistory();
    globalState = {
      ...globalState,
      clips: result.clips,
      selectedClipId: result.secondClipId,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(globalState.tracks, result.clips);
    emitChange();
    saveToLocalStorage();
    return result.secondClipId;
  },

  splitAtPlayhead: (): string | null => {
    const targetTime = globalState.playheadTime;
    if (globalState.selectedClipId) {
      const splitResult = editorStore.splitClip(globalState.selectedClipId, targetTime);
      if (splitResult) return splitResult;
    }

    // Fallback: split first unlocked clip under playhead
    for (const track of globalState.tracks) {
      if (track.locked) continue;
      const trackClips = globalState.clips[track.id] || [];
      const underPlayhead = trackClips.find(
        (c) => targetTime > c.startTime + 0.2 && targetTime < c.startTime + c.duration - 0.2
      );
      if (underPlayhead) {
        return editorStore.splitClip(underPlayhead.id, targetTime);
      }
    }
    return null;
  },

  deleteClip: (clipId: string) => {
    const loc = findClipLocation(globalState.clips, clipId);
    if (!loc) return;
    const track = globalState.tracks.find((t) => t.id === loc.trackId);
    if (track?.locked) return;

    pushHistory();
    const updatedClips = {
      ...globalState.clips,
      [loc.trackId]: globalState.clips[loc.trackId].filter((c) => c.id !== clipId),
    };

    globalState = {
      ...globalState,
      clips: updatedClips,
      selectedClipId: globalState.selectedClipId === clipId ? null : globalState.selectedClipId,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(globalState.tracks, updatedClips);
    emitChange();
    saveToLocalStorage();
  },

  rippleDeleteClip: (clipId: string) => {
    const updatedClips = rippleDeleteClipInMap(globalState.clips, globalState.tracks, clipId);
    if (!updatedClips) return;

    pushHistory();
    globalState = {
      ...globalState,
      clips: updatedClips,
      selectedClipId: globalState.selectedClipId === clipId ? null : globalState.selectedClipId,
    };
    syncHistoryFlags();
    syncActiveProjectTracks(globalState.tracks, updatedClips);
    emitChange();
    saveToLocalStorage();
  },

  updateExportConfig: (updates: Partial<EditorState['exportConfig']>) => {
    globalState = {
      ...globalState,
      exportConfig: {
        ...globalState.exportConfig,
        ...updates,
      },
    };
    emitChange();
    saveToLocalStorage();
  },

  startExport: async (onComplete?: () => void) => {
    if (globalState.exportingState === 'exporting') return;

    if (exportPollTimer) {
      clearInterval(exportPollTimer);
      exportPollTimer = null;
    }

    globalState = {
      ...globalState,
      exportingState: 'exporting',
      exportProgress: 2,
      exportStage: 'Preparing local media for server FFmpeg...',
      exportJobId: null,
      exportError: null,
      exportFileSizeBytes: null,
      exportOutputFileName: null,
    };
    emitChange();

    try {
      // Upload any local IndexedDB/blob assets referenced on active tracks
      const uploadedIds = new Set<string>();
      const clipsList = Object.values(globalState.clips).flat();

      for (const clip of clipsList) {
        if (!clip.mediaAssetId || uploadedIds.has(clip.mediaAssetId)) continue;
        const asset = globalState.mediaAssets.find((a) => a.id === clip.mediaAssetId);
        const isLocal = Boolean(asset?.isLocalFile || clip.assetUrl?.startsWith('blob:'));
        if (!isLocal) continue;

        let blob = await loadMediaBlob(clip.mediaAssetId);
        if (!blob && clip.assetUrl?.startsWith('blob:')) {
          const res = await fetch(clip.assetUrl);
          if (res.ok) blob = await res.blob();
        }
        if (blob) {
          const form = new FormData();
          form.append('assetId', clip.mediaAssetId);
          form.append('file', blob, asset?.name || clip.name);
          const upRes = await fetch('/api/media/upload', { method: 'POST', body: form });
          if (!upRes.ok) {
            throw new Error(`Failed to upload local asset "${asset?.name || clip.name}"`);
          }
          uploadedIds.add(clip.mediaAssetId);
        }
      }

      const startRes = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracks: globalState.tracks,
          clips: globalState.clips,
          exportConfig: globalState.exportConfig,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to start FFmpeg render job');
      }

      const jobId = startData.jobId as string;
      globalState = {
        ...globalState,
        exportJobId: jobId,
        exportProgress: startData.progress ?? 4,
        exportStage: startData.stage || 'Render job queued...',
      };
      emitChange();

      exportPollTimer = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/render/${encodeURIComponent(jobId)}`);
          if (!statusRes.ok) return;
          const job = await statusRes.json();

          if (job.status === 'completed') {
            if (exportPollTimer) {
              clearInterval(exportPollTimer);
              exportPollTimer = null;
            }
            globalState = {
              ...globalState,
              exportingState: 'completed',
              exportProgress: 100,
              exportStage: job.stage || 'Render completed',
              exportFileSizeBytes: job.fileSizeBytes ?? null,
              exportOutputFileName: job.outputFileName ?? null,
            };
            emitChange();
            if (onComplete) onComplete();
          } else if (job.status === 'failed' || job.status === 'cancelled') {
            if (exportPollTimer) {
              clearInterval(exportPollTimer);
              exportPollTimer = null;
            }
            globalState = {
              ...globalState,
              exportingState: job.status === 'failed' ? 'failed' : 'idle',
              exportProgress: 0,
              exportStage: job.stage || 'Render failed',
              exportError: job.error || (job.status === 'cancelled' ? null : 'FFmpeg render failed'),
            };
            emitChange();
          } else {
            globalState = {
              ...globalState,
              exportProgress: job.progress ?? globalState.exportProgress,
              exportStage: job.stage || 'Rendering...',
            };
            emitChange();
          }
        } catch {
          // Keep polling on transient dev hiccup
        }
      }, 450);
    } catch (err) {
      globalState = {
        ...globalState,
        exportingState: 'failed',
        exportProgress: 0,
        exportStage: 'Export failed',
        exportError: err instanceof Error ? err.message : 'Unable to start export',
      };
      emitChange();
    }
  },

  resetExport: () => {
    if (exportPollTimer) {
      clearInterval(exportPollTimer);
      exportPollTimer = null;
    }
    if (globalState.exportingState === 'exporting' && globalState.exportJobId) {
      void fetch(`/api/render/${encodeURIComponent(globalState.exportJobId)}`, {
        method: 'DELETE',
      }).catch(() => {});
    }
    globalState = {
      ...globalState,
      exportingState: 'idle',
      exportProgress: 0,
      exportStage: 'Ready to render',
      exportJobId: null,
      exportError: null,
      exportFileSizeBytes: null,
      exportOutputFileName: null,
    };
    emitChange();
  },

  loadProject: (projectId: string) => {
    const project = globalState.projects.find((p) => p.id === projectId);
    if (!project) return;

    const pData = globalState.projectTracks[projectId] || {
      tracks: initialTracks,
      clips: {},
    };

    const loadedClips = { ...pData.clips };
    pData.tracks.forEach((track) => {
      if (!loadedClips[track.id]) {
        loadedClips[track.id] = [];
      }
    });

    undoStack = [];
    redoStack = [];
    globalState = {
      ...globalState,
      activeProjectId: projectId,
      tracks: pData.tracks,
      clips: loadedClips,
      playheadTime: 0,
      selectedClipId: null,
      isPlaying: false,
      canUndo: false,
      canRedo: false,
    };
    emitChange();
    saveToLocalStorage();
  },

  createNewProject: (name: string) => {
    const newProjId = createUniqueId('p');
    const newProj: Project = {
      id: newProjId,
      name: name || 'Untitled Project',
      duration: '00:00',
      size: '0 MB',
      modifiedAt: 'Just now',
      thumbnail:
        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    };

    const emptyClips: Record<string, TimelineClip[]> = {};
    initialTracks.forEach((t) => {
      emptyClips[t.id] = [];
    });

    undoStack = [];
    redoStack = [];
    globalState = {
      ...globalState,
      activeProjectId: newProjId,
      projects: [newProj, ...globalState.projects],
      projectTracks: {
        ...globalState.projectTracks,
        [newProjId]: {
          tracks: initialTracks.map((t) => ({ ...t })),
          clips: emptyClips,
        },
      },
      tracks: initialTracks.map((t) => ({ ...t })),
      clips: emptyClips,
      playheadTime: 0,
      selectedClipId: null,
      isPlaying: false,
      canUndo: false,
      canRedo: false,
    };
    emitChange();
    saveToLocalStorage();
  },

  deleteProject: (projectId: string) => {
    const newProjects = globalState.projects.filter((p) => p.id !== projectId);
    const newProjectTracks = { ...globalState.projectTracks };
    delete newProjectTracks[projectId];

    let nextActiveId = globalState.activeProjectId;
    let nextTracks = globalState.tracks;
    let nextClips = globalState.clips;

    if (globalState.activeProjectId === projectId) {
      nextActiveId = newProjects.length > 0 ? newProjects[0].id : null;
      const loaded = nextActiveId ? newProjectTracks[nextActiveId] : null;
      nextTracks = loaded ? loaded.tracks : initialTracks;
      nextClips = loaded ? loaded.clips : {};
    }

    undoStack = [];
    redoStack = [];
    globalState = {
      ...globalState,
      projects: newProjects,
      projectTracks: newProjectTracks,
      activeProjectId: nextActiveId,
      tracks: nextTracks,
      clips: nextClips,
      selectedClipId: null,
      playheadTime: 0,
      isPlaying: false,
      canUndo: false,
      canRedo: false,
    };
    emitChange();
    saveToLocalStorage();
  },

  renameProject: (projectId: string, newName: string) => {
    globalState = {
      ...globalState,
      projects: globalState.projects.map((p) =>
        p.id === projectId ? { ...p, name: newName || 'Untitled Project', modifiedAt: 'Just now' } : p
      ),
    };
    emitChange();
    saveToLocalStorage();
  },
};

export function useEditorStore<V>(selector: (state: EditorState) => V): V {
  return useSyncExternalStore(
    editorStore.subscribe,
    () => selector(editorStore.getState()),
    () => selector(editorStore.getState())
  );
}

export function getClipFromState(state: EditorState, clipId: string | null): TimelineClip | null {
  if (!clipId) return null;
  const clipsMap = state.clips;
  for (const trackClips of Object.values(clipsMap)) {
    const found = trackClips.find((c) => c.id === clipId);
    if (found) return found;
  }
  return null;
}

export function getClipById(clipId: string | null): TimelineClip | null {
  return getClipFromState(editorStore.getState(), clipId);
}

// Hydrate state automatically inside browser environment
if (isClient) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => editorStore.hydrate());
  } else {
    setTimeout(() => editorStore.hydrate(), 0);
  }
}
