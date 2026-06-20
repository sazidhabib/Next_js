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
  projects: Project[];
  mediaAssets: MediaAsset[];
  playheadTime: number; // seconds
  isPlaying: boolean;
  zoom: number; // 10 - 100
  selectedClipId: string | null;
  tracks: {
    V3: TimelineClip[]; // Text / Overlays
    V2: TimelineClip[]; // VFX / Transitions
    V1: TimelineClip[]; // Main Video
    A1: TimelineClip[]; // Dialogue / Audio 1
    A2: TimelineClip[]; // Sound / Music 2
  };
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
    duration: '04:22',
    size: '12.4 GB',
    modifiedAt: '2h ago',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOVIOoOljT4cEIBTBhIcO3kEIGEPL1N_ZHXB0AYEh0chbcmIa1yfLVWRCdNkBwRNeQ-OSYt9M--2s1JB2m98BCgEA8hf_1yxpvHbY2WrrT4nh4lNM-K5I9JItGkpZgIj_m0oI4jFnLFSjinnf8fX-_X4i6IXDpnCm_L6qkHCpMJ2ze4p8rcvytz5UKuM17R9FGu2FgYplFAq7_jhDd4B4ZqkfN1kS_0BBfAcTMxSFZCgwAjCygkbLBhMemKmi0W2unvDYwa0Vz_Syf',
  },
  {
    id: 'p2',
    name: 'Client Feedback Rev 2',
    duration: '03:45',
    size: '4.8 GB',
    modifiedAt: '5h ago',
    status: 'In Review',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyAgZin02ugijhGZxSQNZya-9aHnOmuQFv81uCFcm59aP2SqqJpbNj-dssQ-sVKG7JfSsZUvUCWrsAvq_0D5oqxjP2-LOg6H4iqGHREMVvTbH0M-Lo-VGqwabD-YRjbMgS0GWE9f08BjXUFpYcD0jEnusu0CFPkqroHOuLcI3XJuWGn_tdkqpbe7Nb7BrLOBTNZ7hozKz_dcV6dVzsHEZocitsAg8qL9V62uk5TnxJhEYmdphQld1fDMgJWu5E_AMwblqhm1ltLUwS',
  },
  {
    id: 'p3',
    name: 'Music Video Raw Cuts',
    duration: '02:15',
    size: '18.2 GB',
    modifiedAt: 'Yesterday',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO2zn9cREUgk3NMzw-51xH8CnLnUpLbuRnNZvQYIjujnuqxTiyaX6OWLOaPsyqn9rDDlMHqvIjooyxS8NutVnDM_TiIyuH7KeMdtTArjA-mGtui8yBLtpAvP4tbyCVJddDca5n93OpDb4HAhUIIEFdPUTl1Rd3qfgJsypwv2YBuG-z86JyJbw1AHt6SiRQcu6r05fE8aOkU5toWc8BNsl-D7S2dSa940obRwUDJ2PVrD9bSNwidemY6tdZn8VVbDD2sxgIstA9evC8',
  },
  {
    id: 'p4',
    name: 'Mountain B-Roll Prep',
    duration: '01:05',
    size: '1.2 GB',
    modifiedAt: '3 days ago',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAVlm8MXm_wyNiRPJ4W5Nu8AhGkU4xxCThPEA9qCDP3Xt21bdDAyYz7Z_igyxkpxbpDINNBvXsui80Pqly4ie8OLBWWionQ22ezg9DOsJ8SQKhHVU0HpXG2B0gc_OW3wEjBSup3kEcBejo1NnAxnQfAi_2UYiE-hm-OIsdi4BiX8tVB135lHW1jjLYdEOAMQOo7BuAk4oS-6cDi0lLNhI2YntijGpeWi3PfXEKjugU4iqvqhjz2lKBUC9CAqtI_eWSewSXsP8zjcT2',
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
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB06H5N0CvZyuOUjYbm7dbfHjbvZnhNhZMDoNgB2vWi6f-b2aiOHss75sgZgtnbva6IC7MRN-h4-UYoM-BflURw5IWZNDCGw2I56avKb50Qmp7SG0l9y2mkWVfG0raIq84aIGqnsQLGxHeviwC0GGhgOc0hHt4_OKzH__ZvEH2NMFKTq9d0yCSUnGnHev4T1pHADwKyZaPQsOKm9KW7ppMAHX6yF_crv6bOXer4NIBPeWDojNSUstzhzNOZRslKVJJruxXZ5Le2Hhim',
  },
  {
    id: 'm2',
    name: 'Splash_Macro.mov',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-water-splash-on-black-background-34351-large.mp4',
    duration: 8,
    size: '14.2 MB',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVs0tJ7Kg2ysSR9K83pwqmH8Tggg7PqfL5-mu4H2gqg26ivfFqGxLR6z16zhSNu3wMaG_vIW32SlZSGs9yhZMsN9fcfSxOzx1EyvsOsHUSiKekOnphTrqdCjTZNpxvOeuUJmqvIDmGSePEmuZ-gaImkvQXX6HIlrHk9ahR4Hufj9HeflCUplWBz3wMSvD36LcoMOXMYocQT5dd1jHFdSD1Ph8Rh0RgY4Dh7dTf5tGK1-T3g76pgadjxtsnVn1mODIHXldHOzQhdnLm',
  },
  {
    id: 'm3',
    name: 'Forest_Aerial.mp4',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-thick-forest-fog-42205-large.mp4',
    duration: 24,
    size: '48.1 MB',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAargbmRJLaKeP1BX7DnT4an4xfZHBID2ei1kmsKBp997VzJZ57pxUDvXaUPdBsqIOOXXopHGs2sMB2E1H7EJC9k_Ech5UGuIJgrwJVuETzo6e4zWa6eQOMkb0qXlBb21gAZchRZg28CNhP5lQgL0E0jYrQYTBRUEKnVH3P_xWpkxpVl__fGZsWwIq53XWI3WPteYTKvRAguTa-B5AbJ13L-e0QNKOZtLfr2QzYGtxFK68IRosTPHw3803aSJeHaASXvZ0RVJ3juWov',
  },
  {
    id: 'm4',
    name: 'Gallery_Walk.mp4',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-in-an-art-gallery-40407-large.mp4',
    duration: 12,
    size: '18.7 MB',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAso8_7A9sXu5ij1dMT9Flnno1hQy_x6wVzB1bWgoyP5tep4DGvBiOtT88RqscG8ViLtdnfphn6VTzopI8NvOUJZ8zf9KztN0zYZVGZ9IeM6N2r6-GvJqfk3j7z5s8IaJsPnyyGLmov9k6EPL4Qz7zvKk2fkhNR7SU7RGjw9j9AYeM2WW5lY_yH8IGjhe4s1a5WCNWsYB_A4p5EZsvhAq6xGyUiYcE-sLWMKbF0oT4JojE5eT4Cvx0lHdvpMMKLN4EX-rXKc1H_CA21',
  },
];

const initialClips = {
  V3: [
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
      color: 'bg-primary-container/20 border border-primary/30 text-primary',
    },
  ],
  V2: [
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
  V1: [
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
      assetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-43956-large.mp4',
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
      assetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-water-splash-on-black-background-34351-large.mp4',
    },
  ],
  A1: [
    {
      id: 'c_a1',
      name: 'Background_Atmosphere.wav',
      type: 'audio' as const,
      startTime: 0,
      duration: 12,
      volume: 50,
      color: 'bg-secondary-container/30 border border-secondary/40 text-secondary',
    },
    {
      id: 'c_a2',
      name: 'Splash_Sound_Design.wav',
      type: 'audio' as const,
      startTime: 12,
      duration: 16,
      volume: 75,
      color: 'bg-secondary-container/30 border border-secondary/40 text-secondary',
    },
  ],
  A2: [
    {
      id: 'c_a3',
      name: 'Cinematic_Soundtrack_v1.mp3',
      type: 'audio' as const,
      startTime: 2.5,
      duration: 25.5,
      volume: 30,
      color: 'bg-secondary-container/10 border border-secondary/20 text-secondary',
    },
  ],
};

let globalState: EditorState = {
  projects: initialProjects,
  mediaAssets: initialMediaAssets,
  playheadTime: 4.2,
  isPlaying: false,
  zoom: 50,
  selectedClipId: null,
  tracks: initialClips,
  exportingState: 'idle',
  exportProgress: 0,
  exportConfig: {
    fileName: 'Project_Alpha_V1_Final',
    format: 'MOV (ProRes 422)',
    resolution: '4K (3840 x 2160)',
    fps: '23.976 fps',
    quality: 85,
  },
};

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const editorStore = {
  getState: () => globalState,
  
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setPlayheadTime: (time: number) => {
    // clamp to reasonable range (e.g. 0 to 60s)
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
  },

  deleteMediaAsset: (id: string) => {
    globalState = {
      ...globalState,
      mediaAssets: globalState.mediaAssets.filter((a) => a.id !== id),
    };
    emitChange();
  },

  addClipToTrack: (trackName: keyof EditorState['tracks'], asset: MediaAsset, startTime: number) => {
    const newClip: TimelineClip = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: asset.name,
      type: asset.type === 'video' ? 'video' : (asset.type === 'audio' ? 'audio' : 'overlay'),
      startTime,
      duration: asset.duration,
      volume: asset.type === 'audio' || asset.type === 'video' ? 100 : undefined,
      opacity: asset.type === 'video' || asset.type === 'image' ? 100 : undefined,
      scale: asset.type === 'video' || asset.type === 'image' ? 100 : undefined,
      positionX: asset.type === 'video' || asset.type === 'image' ? 0 : undefined,
      positionY: asset.type === 'video' || asset.type === 'image' ? 0 : undefined,
      rotation: asset.type === 'video' || asset.type === 'image' ? 0 : undefined,
      assetUrl: asset.url,
      color: asset.type === 'audio' ? 'bg-secondary-container/30 border border-secondary/40 text-secondary' : 'bg-surface-container-highest border border-outline rounded text-on-surface',
    };

    globalState = {
      ...globalState,
      tracks: {
        ...globalState.tracks,
        [trackName]: [...globalState.tracks[trackName], newClip],
      },
    };
    emitChange();
  },

  addTextClip: (startTime: number) => {
    const textClip: TimelineClip = {
      id: `c_txt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
      color: 'bg-primary-container/20 border border-primary/30 text-primary',
    };
    globalState = {
      ...globalState,
      tracks: {
        ...globalState.tracks,
        V3: [...globalState.tracks.V3, textClip],
      },
    };
    emitChange();
  },

  updateClip: (clipId: string, updates: Partial<TimelineClip>) => {
    const updatedTracks = { ...globalState.tracks };
    let found = false;

    for (const key of Object.keys(updatedTracks) as Array<keyof EditorState['tracks']>) {
      const index = updatedTracks[key].findIndex((c) => c.id === clipId);
      if (index !== -1) {
        updatedTracks[key] = [...updatedTracks[key]];
        updatedTracks[key][index] = {
          ...updatedTracks[key][index],
          ...updates,
        };
        found = true;
        break;
      }
    }

    if (found) {
      globalState = { ...globalState, tracks: updatedTracks };
      emitChange();
    }
  },

  deleteClip: (clipId: string) => {
    const updatedTracks = { ...globalState.tracks };
    let found = false;

    for (const key of Object.keys(updatedTracks) as Array<keyof EditorState['tracks']>) {
      const originalLen = updatedTracks[key].length;
      updatedTracks[key] = updatedTracks[key].filter((c) => c.id !== clipId);
      if (updatedTracks[key].length !== originalLen) {
        found = true;
      }
    }

    if (found) {
      globalState = {
        ...globalState,
        tracks: updatedTracks,
        selectedClipId: globalState.selectedClipId === clipId ? null : globalState.selectedClipId,
      };
      emitChange();
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
    
    // Simulate loading a specific project configuration (reset playhead, load clips)
    globalState = {
      ...globalState,
      playheadTime: 0,
      selectedClipId: null,
      isPlaying: false,
    };
    emitChange();
  },

  createNewProject: (name: string) => {
    const newProj: Project = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: name || 'Untitled Project',
      duration: '00:00',
      size: '0 KB',
      modifiedAt: 'Just now',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACuCliCA4HeNc-Wti44zV5_1Ht2o73rpO3kiJXysCldKjtcsAEFr0FijEd0C-mqmnvcwhblSImSTsHmbiEFGyfFUUV67FzT7QC4-Y0skS5l5YhMLYWz3LAIHpK-ZkVW9bqQu4mOHT-6kMx61efgvAEJLGduQAxWGuBnPR1dB3y2zyCSEDY-Zy9GFDHFgplnNLEdZiXdaTP8wmHDpqVvJhQoKNSYSKL6aDuDO167il_dYEK4tW0QenwP86BBlqg7nuL4gNtqbWsIQB0',
    };

    globalState = {
      ...globalState,
      projects: [newProj, ...globalState.projects],
      tracks: {
        V3: [],
        V2: [],
        V1: [],
        A1: [],
        A2: [],
      },
      playheadTime: 0,
      selectedClipId: null,
    };
    emitChange();
  },
};

export function useEditorStore<V>(selector: (state: EditorState) => V): V {
  return useSyncExternalStore(
    editorStore.subscribe,
    () => selector(editorStore.getState()),
    () => selector(editorStore.getState())
  );
}

// Helper to query clip by ID in components
export function getClipById(clipId: string | null): TimelineClip | null {
  if (!clipId) return null;
  const tracks = editorStore.getState().tracks;
  for (const trackClips of Object.values(tracks)) {
    const found = trackClips.find((c) => c.id === clipId);
    if (found) return found;
  }
  return null;
}
