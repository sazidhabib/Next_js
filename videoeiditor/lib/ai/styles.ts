import type { StylePreset } from '../timeline/types';
import type { AiEditAction } from './tools';

export const BUILTIN_STYLE_PRESETS: StylePreset[] = [
  {
    id: 'viral_short_9_16',
    name: 'Hormozi Viral Short (9:16)',
    description: '9:16 vertical crop, tight silence cuts, bold gold captions, 114% punch-in zoom, sidechain BGM ducking & -14 LUFS.',
    aspectRatio: '9:16',
    captionStyle: 'hormozi',
    removeSilences: true,
    punchInScale: 114,
    transitionIn: 'fade',
    audioMastering: {
      normalizeLufs: true,
      targetLufs: -14,
      autoDuckBgm: true,
    },
  },
  {
    id: 'youtube_talking_head',
    name: 'YouTube Pro Talking Head (16:9)',
    description: '16:9 widescreen, dead-air cleanup, clean minimal subtitles, subtle 110% punch-ins, dissolve cuts & -14 LUFS mastering.',
    aspectRatio: '16:9',
    captionStyle: 'minimal',
    removeSilences: true,
    punchInScale: 110,
    transitionIn: 'dissolve',
    audioMastering: {
      normalizeLufs: true,
      targetLufs: -14,
      autoDuckBgm: true,
    },
  },
  {
    id: 'cinematic_reel',
    name: 'Cinematic Film Reel (16:9)',
    description: '16:9 widescreen, Vintage 35mm film grade, smooth dissolve transitions, neon titles & mastered -14 LUFS mix.',
    aspectRatio: '16:9',
    captionStyle: 'neon',
    removeSilences: false,
    punchInScale: null,
    transitionIn: 'dissolve',
    effect: 'Vintage 35mm',
    audioMastering: {
      normalizeLufs: true,
      targetLufs: -14,
      autoDuckBgm: true,
    },
  },
  {
    id: 'podcast_highlight',
    name: 'Podcast Clip (9:16)',
    description: '9:16 vertical crop, aggressive pause removal, high-contrast captions, voice clarity & -16 LUFS broadcast loudness.',
    aspectRatio: '9:16',
    captionStyle: 'hormozi',
    removeSilences: true,
    punchInScale: 112,
    transitionIn: 'none',
    audioMastering: {
      normalizeLufs: true,
      targetLufs: -16,
      autoDuckBgm: true,
    },
  },
];

export function stylePresetToActions(preset: StylePreset): AiEditAction[] {
  const actions: AiEditAction[] = [
    {
      type: 'set_aspect_ratio',
      aspectRatio: preset.aspectRatio,
      reason: `Reframe canvas to ${preset.aspectRatio}`,
    },
    {
      type: 'set_audio_mastering',
      normalizeLufs: preset.audioMastering.normalizeLufs,
      targetLufs: preset.audioMastering.targetLufs,
      autoDuckBgm: preset.audioMastering.autoDuckBgm,
      reason: `Enable ${preset.audioMastering.targetLufs} LUFS mastering${
        preset.audioMastering.autoDuckBgm ? ' & sidechain BGM ducking' : ''
      }`,
    },
  ];

  if (preset.removeSilences) {
    actions.push({
      type: 'remove_silences',
      minSilenceSec: 0.45,
      paddingSec: 0.12,
      reason: 'Remove silent pauses',
    });
  }

  if (preset.punchInScale) {
    actions.push({
      type: 'apply_punch_in_zoom',
      targetTrack: 'v1',
      scalePercent: preset.punchInScale,
      reason: `Apply ${preset.punchInScale}% punch-in zoom on alternating cuts`,
    });
  }

  if (preset.transitionIn !== 'none') {
    actions.push({
      type: 'set_clip_transition',
      targetTrack: 'v1',
      transitionIn: preset.transitionIn,
      transitionDuration: 0.35,
      reason: `Add ${preset.transitionIn} transitions`,
    });
  }

  if (preset.effect) {
    actions.push({
      type: 'apply_effect',
      targetTrack: 'v1',
      effect: preset.effect,
      reason: `Apply ${preset.effect} look`,
    });
  }

  actions.push({
    type: 'generate_captions',
    stylePreset: preset.captionStyle,
    reason: `Generate ${preset.captionStyle} captions`,
  });

  return actions;
}
