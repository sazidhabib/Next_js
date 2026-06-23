import { useSyncExternalStore } from 'react';

export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  duration: number; // in seconds
  size: string;
  thumbnail: string;
}

export interface TimelineClip {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  startTime: number; // in seconds
  duration: number; // in seconds
  volume?: number; // 0 - 100
  opacity?: number; // 0 - 100
  scale?: number; // 10 - 200
  positionX?: number; // offset px
  positionY?: number; // offset px
  rotation?: number; // degrees
  blendMode?: string;
  appliedEffects?: string[];
  color?: string;
  assetUrl?: string;
  text?: string;
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio';
}

export interface Project {
  id: string;
  name: string;
  duration: string;
  size: string;
  modifiedAt: string;
  status?: string;
  thumbnail: string;
}

export interface EditorState {
  activeProjectId: string | null;
  projects: Project[];
  mediaAssets: MediaAsset[];
  playheadTime: number; // seconds
  isPlaying: boolean;
  zoom: number; // 10 - 100
  selectedClipId: string | null;
  tracks: Track[];
  clips: Record<string, TimelineClip[]>;
  projectTracks: Record<
    string,
    {
      tracks: Track[];
      clips: Record<string, TimelineClip[]>;
    }
  >;
  exportingState: 'idle' | 'exporting' | 'completed';
  exportProgress: number;
  exportConfig: {
    fileName: string;
    format: string;
    resolution: string;
    fps: string;
    quality: number;
  };
}

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
  { id: 'v3', name: 'V3 (TEXT)', type: 'video' },
  { id: 'v2', name: 'V2 (VFX)', type: 'video' },
  { id: 'v1', name: 'V1 (VID)', type: 'video' },
  { id: 'a1', name: 'A1 (VOX)', type: 'audio' },
  { id: 'a2', name: 'A2 (BGM)', type: 'audio' },
];

const initialClips: Record<string, TimelineClip[]> = {
  v3: [
    {
      id: 'c_t1',
      name: 'Cyberpunk Neon',
      type: 'text' as const,
      startTime: 3,
      duration: 6,
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
      type: 'overlay' as const,
      startTime: 12,
      duration: 9.6,
      opacity: 40,
      appliedEffects: ['Chromatic Aberration'],
      color: 'bg-primary-container/40 border border-primary/50 text-on-primary-container',
    },
  ],
  v1: [
    {
      id: 'c_v1',
      name: 'Urban_Night_01',
      type: 'video' as const,
      startTime: 0,
      duration: 12,
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
      name: 'Splash_Macro.mov',
      type: 'video' as const,
      startTime: 12,
      duration: 16,
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
      type: 'audio' as const,
      startTime: 0,
      duration: 12,
      volume: 50,
      color: 'bg-secondary-container/30 border border-secondary/40 text-secondary',
      assetUrl: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav',
    },
    {
      id: 'c_a2',
      name: 'Splash_Sound_Design.wav',
      type: 'audio' as const,
      startTime: 12,
      duration: 16,
      volume: 75,
      color: 'bg-secondary-container/30 border border-secondary/40 text-secondary',
      assetUrl: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-84.wav',
    },
  ],
  a2: [
    {
      id: 'c_a3',
      name: 'Cinematic_Soundtrack_v1.mp3',
      type: 'audio' as const,
      startTime: 2.5,
      duration: 25.5,
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
  exportConfig: {
    fileName: 'Project_Alpha_V1_Final',
    format: 'MP4 (H.264)',
    resolution: '1080p (1920 x 1080)',
    fps: '23.976 fps',
    quality: 85,
  },
};

let globalState = { ...defaultState };

const isClient = typeof window !== 'undefined';
const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const saveToLocalStorage = () => {
  if (isClient) {
    try {
      localStorage.setItem('cineflow_editor_state', JSON.stringify(globalState));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
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

        // Validate array format for tracks to support schema migrations smoothly
        const hasValidTracks = parsed && Array.isArray(parsed.tracks);
        const hasValidProjectTracks = parsed && parsed.projectTracks && Object.values(parsed.projectTracks).every(
          (p: any) => p && Array.isArray(p.tracks)
        );

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
        };
        emitChange();
      }
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  },

  setPlayheadTime: (time: number) => {
    const clamped = Math.max(0, Math.min(60, parseFloat(time.toFixed(2))));
    globalState = { ...globalState, playheadTime: clamped };
    emitChange();
  },

  setPlaying: (isPlaying: boolean) => {
    globalState = { ...globalState, isPlaying };
    emitChange();
  },

  setZoom: (zoom: number) => {
    globalState = { ...globalState, zoom };
    emitChange();
    saveToLocalStorage();
  },

  setSelectedClipId: (id: string | null) => {
    globalState = { ...globalState, selectedClipId: id };
    emitChange();
  },

  addMediaAsset: (asset: Omit<MediaAsset, 'id'>) => {
    const newAsset: MediaAsset = {
      ...asset,
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    globalState = {
      ...globalState,
      mediaAssets: [...globalState.mediaAssets, newAsset],
    };
    emitChange();
    saveToLocalStorage();
  },

  deleteMediaAsset: (id: string) => {
    globalState = {
      ...globalState,
      mediaAssets: globalState.mediaAssets.filter((a) => a.id !== id),
    };
    emitChange();
    saveToLocalStorage();
  },

  addTrack: (type: 'video' | 'audio') => {
    const videoCount = globalState.tracks.filter((t) => t.type === 'video').length;
    const audioCount = globalState.tracks.filter((t) => t.type === 'audio').length;

    const trackId = `track_${type}_${Date.now()}`;
    const name = type === 'video' ? `V${videoCount + 1}` : `A${audioCount + 1}`;

    const newTrack = { id: trackId, name, type };

    let newTracks = [...globalState.tracks];
    if (type === 'video') {
      // Find where video tracks end to keep them together at the top, or just prepended
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

    if (globalState.activeProjectId) {
      globalState.projectTracks[globalState.activeProjectId] = {
        tracks: newTracks,
        clips: updatedClips,
      };
    }
    emitChange();
    saveToLocalStorage();
  },

  deleteTrack: (trackId: string) => {
    const trackToDelete = globalState.tracks.find((t) => t.id === trackId);
    if (!trackToDelete) return;

    const newTracks = globalState.tracks.filter((t) => t.id !== trackId);
    const newClips = { ...globalState.clips };
    delete newClips[trackId];

    globalState = {
      ...globalState,
      tracks: newTracks,
      clips: newClips,
    };

    if (globalState.activeProjectId) {
      globalState.projectTracks[globalState.activeProjectId] = {
        tracks: newTracks,
        clips: newClips,
      };
      updateProjectDurationAndSize(globalState.activeProjectId);
    }
    emitChange();
    saveToLocalStorage();
  },

  addCustomClip: (trackIdOrType: string, clipData: Omit<TimelineClip, 'id'>) => {
    let targetTrackId = trackIdOrType;
    const lowerId = trackIdOrType.toLowerCase();

    // Check if the track exists by exact ID or lowercase ID or name
    const foundTrack = globalState.tracks.find(
      (t) => t.id.toLowerCase() === lowerId || t.name.toLowerCase() === lowerId
    );

    if (foundTrack) {
      targetTrackId = foundTrack.id;
    } else {
      // Fallback: find first track matching the type or create one
      const targetType = clipData.type === 'audio' ? 'audio' : 'video';
      const matchingTrack = globalState.tracks.find((t) => t.type === targetType);
      if (matchingTrack) {
        targetTrackId = matchingTrack.id;
      } else {
        const newTrackId = `track_${targetType}_${Date.now()}`;
        const newTrackName = targetType === 'video' ? 'V1' : 'A1';
        const newTrack: Track = { id: newTrackId, name: newTrackName, type: targetType };
        globalState.tracks = [...globalState.tracks, newTrack];
        globalState.clips[newTrackId] = [];
        targetTrackId = newTrackId;
      }
    }

    const newClip: TimelineClip = {
      ...clipData,
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    } as TimelineClip;

    const updatedClips = {
      ...globalState.clips,
      [targetTrackId]: [...(globalState.clips[targetTrackId] || []), newClip],
    };

    globalState = {
      ...globalState,
      clips: updatedClips,
    };

    if (globalState.activeProjectId) {
      globalState.projectTracks[globalState.activeProjectId].clips = updatedClips;
      updateProjectDurationAndSize(globalState.activeProjectId);
    }

    emitChange();
    saveToLocalStorage();
    return newClip.id;
  },

  addCustomClips: (trackIdOrType: string, clipsList: Omit<TimelineClip, 'id'>[]) => {
    let targetTrackId = trackIdOrType;
    const lowerId = trackIdOrType.toLowerCase();

    // Check if the track exists
    const foundTrack = globalState.tracks.find(
      (t) => t.id.toLowerCase() === lowerId || t.name.toLowerCase() === lowerId
    );

    if (foundTrack) {
      targetTrackId = foundTrack.id;
    } else {
      // Fallback: find first track matching the type or create one
      const isAudio = clipsList.some(c => c.type === 'audio');
      const targetType = isAudio ? 'audio' : 'video';
      const matchingTrack = globalState.tracks.find((t) => t.type === targetType);
      if (matchingTrack) {
        targetTrackId = matchingTrack.id;
      } else {
        const newTrackId = `track_${targetType}_${Date.now()}`;
        const newTrackName = targetType === 'video' ? 'V1' : 'A1';
        const newTrack: Track = { id: newTrackId, name: newTrackName, type: targetType };
        globalState.tracks = [...globalState.tracks, newTrack];
        globalState.clips[newTrackId] = [];
        targetTrackId = newTrackId;
      }
    }

    const newClips = clipsList.map((clipData, index) => ({
      ...clipData,
      id: `c_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 9)}`,
    })) as TimelineClip[];

    const updatedClips = {
      ...globalState.clips,
      [targetTrackId]: [...(globalState.clips[targetTrackId] || []), ...newClips],
    };

    globalState = {
      ...globalState,
      clips: updatedClips,
    };

    if (globalState.activeProjectId) {
      globalState.projectTracks[globalState.activeProjectId].clips = updatedClips;
      updateProjectDurationAndSize(globalState.activeProjectId);
    }

    emitChange();
    saveToLocalStorage();
  },

  addClipToTrack: (trackIdOrType: string, asset: MediaAsset, startTime: number) => {
    editorStore.addCustomClip(trackIdOrType, {
      name: asset.name,
      type: asset.type === 'video' ? 'video' : asset.type === 'audio' ? 'audio' : 'overlay',
      startTime,
      duration: asset.duration,
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
    editorStore.addCustomClip('v3', {
      name: 'Custom Text',
      type: 'text',
      startTime,
      duration: 5,
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

  updateClip: (clipId: string, updates: Partial<TimelineClip>) => {
    const updatedClips = { ...globalState.clips };
    let found = false;

    for (const trackId of Object.keys(updatedClips)) {
      const index = updatedClips[trackId].findIndex((c) => c.id === clipId);
      if (index !== -1) {
        updatedClips[trackId] = [...updatedClips[trackId]];
        updatedClips[trackId][index] = {
          ...updatedClips[trackId][index],
          ...updates,
        };
        found = true;
        break;
      }
    }

    if (found) {
      globalState = { ...globalState, clips: updatedClips };

      if (globalState.activeProjectId) {
        globalState.projectTracks[globalState.activeProjectId].clips = updatedClips;
        updateProjectDurationAndSize(globalState.activeProjectId);
      }

      emitChange();
      saveToLocalStorage();
    }
  },

  deleteClip: (clipId: string) => {
    const updatedClips = { ...globalState.clips };
    let found = false;

    for (const trackId of Object.keys(updatedClips)) {
      const originalLen = updatedClips[trackId].length;
      updatedClips[trackId] = updatedClips[trackId].filter((c) => c.id !== clipId);
      if (updatedClips[trackId].length !== originalLen) {
        found = true;
      }
    }

    if (found) {
      globalState = {
        ...globalState,
        clips: updatedClips,
        selectedClipId: globalState.selectedClipId === clipId ? null : globalState.selectedClipId,
      };

      if (globalState.activeProjectId) {
        globalState.projectTracks[globalState.activeProjectId].clips = updatedClips;
        updateProjectDurationAndSize(globalState.activeProjectId);
      }

      emitChange();
      saveToLocalStorage();
    }
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

  startExport: (onComplete?: () => void) => {
    if (globalState.exportingState === 'exporting') return;

    globalState = {
      ...globalState,
      exportingState: 'exporting',
      exportProgress: 0,
    };
    emitChange();

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        globalState = {
          ...globalState,
          exportingState: 'completed',
          exportProgress: 100,
        };
        emitChange();
        if (onComplete) onComplete();
      } else {
        globalState = {
          ...globalState,
          exportProgress: progress,
        };
        emitChange();
      }
    }, 80);
  },

  resetExport: () => {
    globalState = {
      ...globalState,
      exportingState: 'idle',
      exportProgress: 0,
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

    // Ensure all track IDs exist in the loaded clips map
    const loadedClips = { ...pData.clips };
    pData.tracks.forEach((track) => {
      if (!loadedClips[track.id]) {
        loadedClips[track.id] = [];
      }
    });

    globalState = {
      ...globalState,
      activeProjectId: projectId,
      tracks: pData.tracks,
      clips: loadedClips,
      playheadTime: 0,
      selectedClipId: null,
      isPlaying: false,
    };
    emitChange();
    saveToLocalStorage();
  },

  createNewProject: (name: string) => {
    const newProjId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
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

    globalState = {
      ...globalState,
      activeProjectId: newProjId,
      projects: [newProj, ...globalState.projects],
      projectTracks: {
        ...globalState.projectTracks,
        [newProjId]: {
          tracks: initialTracks,
          clips: emptyClips,
        },
      },
      tracks: initialTracks,
      clips: emptyClips,
      playheadTime: 0,
      selectedClipId: null,
      isPlaying: false,
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
