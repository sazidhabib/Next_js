export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';
export type TransitionType = 'none' | 'fade' | 'dissolve';
export type CaptionStylePreset = 'hormozi' | 'minimal' | 'neon';

export interface SilenceInterval {
  start: number;
  end: number;
  duration: number;
}

export interface SpeechWord {
  word: string;
  start: number;
  end: number;
}

export interface SpeechSegment {
  start: number;
  end: number;
  text: string;
}

export interface SceneCut {
  time: number;
  score: number;
}

export interface MediaAnalysis {
  assetId: string;
  analyzedAt: string;
  duration: number;
  hasVideo: boolean;
  hasAudio: boolean;
  loudnessLufs?: number;
  silences: SilenceInterval[];
  scenes: SceneCut[];
  speechSegments: SpeechSegment[];
  words: SpeechWord[];
  waveformPeaks: number[];
  transcriptEngine?: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  url: string;
  duration: number; // natural media duration in seconds
  size: string;
  thumbnail: string;
  isLocalFile?: boolean;
  mimeType?: string;
  analysis?: MediaAnalysis;
}

export interface TimelineClip {
  id: string;
  mediaAssetId?: string;
  name: string;
  type: 'video' | 'audio' | 'text' | 'overlay';
  startTime: number; // timeline start in seconds
  duration: number; // timeline duration in seconds
  sourceStart?: number; // in-point within the underlying media asset (seconds)
  sourceDuration?: number; // total natural duration of the source media (seconds)
  playbackRate?: number; // speed multiplier, default 1.0
  volume?: number; // 0 - 100
  opacity?: number; // 0 - 100
  scale?: number; // 10 - 200
  positionX?: number; // offset px
  positionY?: number; // offset px
  rotation?: number; // degrees
  blendMode?: string;
  appliedEffects?: string[];
  transitionIn?: TransitionType;
  transitionDuration?: number;
  captionStyle?: CaptionStylePreset;
  color?: string;
  assetUrl?: string;
  text?: string;
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio';
  muted?: boolean;
  locked?: boolean;
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

export interface ProjectTimelineData {
  tracks: Track[];
  clips: Record<string, TimelineClip[]>;
}

export interface AudioMasteringConfig {
  normalizeLufs: boolean;
  targetLufs: number;
  autoDuckBgm: boolean;
}

export interface ExportConfig {
  fileName: string;
  format: string;
  resolution: string;
  fps: string;
  quality: number;
  aspectRatio?: AspectRatio;
  audioMastering?: AudioMasteringConfig;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  captionStyle: CaptionStylePreset;
  removeSilences: boolean;
  punchInScale: number | null;
  transitionIn: TransitionType;
  effect?: 'Chromatic Aberration' | 'Emerald Forest' | 'Vintage 35mm' | 'VHS Overdrive';
  audioMastering: AudioMasteringConfig;
}

export interface EditorState {
  activeProjectId: string | null;
  projects: Project[];
  mediaAssets: MediaAsset[];
  playheadTime: number; // seconds
  isPlaying: boolean;
  zoom: number; // 10 - 100
  snapEnabled: boolean;
  selectedClipId: string | null;
  tracks: Track[];
  clips: Record<string, TimelineClip[]>;
  projectTracks: Record<string, ProjectTimelineData>;
  exportingState: 'idle' | 'exporting' | 'completed' | 'failed';
  exportProgress: number;
  exportStage?: string;
  exportJobId?: string | null;
  exportError?: string | null;
  exportFileSizeBytes?: number | null;
  exportOutputFileName?: string | null;
  exportConfig: ExportConfig;
  customStylePresets?: StylePreset[];
  canUndo: boolean;
  canRedo: boolean;
}
