import { z } from 'zod';

export const CaptionStyleEnum = z.enum(['hormozi', 'minimal', 'neon']);
export const AspectRatioEnum = z.enum(['16:9', '9:16', '1:1', '4:5']);
export const TransitionTypeEnum = z.enum(['none', 'fade', 'dissolve']);
export const VisualEffectEnum = z.enum([
  'Chromatic Aberration',
  'Emerald Forest',
  'Vintage 35mm',
  'VHS Overdrive',
]);

export const AiEditActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('set_aspect_ratio'),
    aspectRatio: AspectRatioEnum,
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('set_audio_mastering'),
    normalizeLufs: z.boolean().optional().default(true),
    targetLufs: z.number().min(-24).max(-6).optional().default(-14),
    autoDuckBgm: z.boolean().optional().default(true),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('set_clip_transition'),
    targetTrack: z.string().optional().default('v1'),
    clipIds: z.array(z.string()).optional(),
    transitionIn: TransitionTypeEnum,
    transitionDuration: z.number().min(0.1).max(2).optional().default(0.35),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('remove_silences'),
    clipId: z.string().optional(),
    minSilenceSec: z.number().min(0.15).max(5).optional().default(0.5),
    paddingSec: z.number().min(0).max(0.5).optional().default(0.12),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('generate_captions'),
    clipId: z.string().optional(),
    stylePreset: CaptionStyleEnum.optional().default('hormozi'),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('split_at_scenes'),
    clipId: z.string().optional(),
    maxSceneSplits: z.number().int().min(1).max(30).optional().default(12),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('apply_punch_in_zoom'),
    targetTrack: z.string().optional().default('v1'),
    clipIds: z.array(z.string()).optional(),
    scalePercent: z.number().min(102).max(160).optional().default(114),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('split_clip'),
    clipId: z.string().optional(),
    time: z.number().min(0),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('trim_clip'),
    clipId: z.string(),
    startTime: z.number().min(0).optional(),
    duration: z.number().min(0.2).optional(),
    sourceStart: z.number().min(0).optional(),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('set_clip_speed'),
    clipId: z.string().optional(),
    targetTrack: z.string().optional(),
    playbackRate: z.number().min(0.25).max(4),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('apply_effect'),
    targetTrack: z.string().optional().default('v1'),
    clipIds: z.array(z.string()).optional(),
    effect: VisualEffectEnum,
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('add_text_overlay'),
    text: z.string().min(1),
    startTime: z.number().min(0),
    duration: z.number().min(0.5).max(60),
    positionY: z.number().optional().default(0),
    scale: z.number().min(50).max(200).optional().default(115),
    stylePreset: CaptionStyleEnum.optional().default('neon'),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('duck_audio'),
    voiceTrack: z.string().optional().default('a1'),
    bgmTrack: z.string().optional().default('a2'),
    voiceVolume: z.number().min(0).max(100).optional().default(95),
    bgmVolume: z.number().min(0).max(100).optional().default(22),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('insert_broll'),
    mediaAssetId: z.string(),
    startTime: z.number().min(0),
    duration: z.number().min(0.5).max(60).optional(),
    trackId: z.string().optional().default('v2'),
    opacity: z.number().min(10).max(100).optional().default(100),
    reason: z.string().optional(),
  }),
  z.object({
    type: z.literal('delete_clip'),
    clipId: z.string(),
    ripple: z.boolean().optional().default(true),
    reason: z.string().optional(),
  }),
]);

export type AiEditAction = z.infer<typeof AiEditActionSchema>;

export const AiDirectorPlanSchema = z.object({
  summary: z.string(),
  actions: z.array(AiEditActionSchema),
});

export type AiDirectorPlan = z.infer<typeof AiDirectorPlanSchema>;

export interface TimelinePromptContext {
  playheadTime: number;
  selectedClipId: string | null;
  tracks: Array<{ id: string; name: string; type: 'video' | 'audio'; muted?: boolean; locked?: boolean }>;
  clips: Record<
    string,
    Array<{
      id: string;
      name: string;
      type: 'video' | 'audio' | 'text' | 'overlay';
      startTime: number;
      duration: number;
      sourceStart?: number;
      playbackRate?: number;
      volume?: number;
      scale?: number;
      appliedEffects?: string[];
      text?: string;
      mediaAssetId?: string;
    }>
  >;
  mediaAssets: Array<{
    id: string;
    name: string;
    type: 'video' | 'audio' | 'image';
    duration: number;
    silencesCount?: number;
    scenesCount?: number;
    wordsCount?: number;
    transcriptPreview?: string;
  }>;
}
