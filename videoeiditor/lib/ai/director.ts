import {
  AiDirectorPlan,
  AiDirectorPlanSchema,
  AiEditAction,
  TimelinePromptContext,
} from './tools';

export type DirectorEngine = 'gemini' | 'openai-compatible' | 'local-intent';

export function getActiveDirectorEngine(): {
  engine: DirectorEngine;
  model: string;
} {
  if (process.env.GEMINI_API_KEY) {
    return {
      engine: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.OLLAMA_BASE_URL) {
    return {
      engine: 'openai-compatible',
      model:
        process.env.OPENAI_MODEL ||
        (process.env.OLLAMA_BASE_URL ? 'llama3.2' : 'gpt-4o-mini'),
    };
  }
  return {
    engine: 'local-intent',
    model: 'CineFlow Rule-Based Director',
  };
}

const SYSTEM_INSTRUCTION = `You are CineFlow AI Director, a professional video editor assistant.
Given a user's editing command and the current JSON timeline + media assets context, output ONLY valid JSON matching:
{
  "summary": "Brief 1-sentence description of the edit plan",
  "actions": [ ...typed actions... ]
}

Allowed action types and exact schemas:
1. {"type":"remove_silences","clipId":"optional","minSilenceSec":0.5,"paddingSec":0.12,"reason":"..."}
2. {"type":"generate_captions","clipId":"optional","stylePreset":"hormozi|minimal|neon","reason":"..."}
3. {"type":"split_at_scenes","clipId":"optional","maxSceneSplits":12,"reason":"..."}
4. {"type":"apply_punch_in_zoom","targetTrack":"v1","clipIds":["optional"],"scalePercent":114,"reason":"..."}
5. {"type":"split_clip","clipId":"optional","time":number,"reason":"..."}
6. {"type":"trim_clip","clipId":"required","startTime":number,"duration":number,"sourceStart":number,"reason":"..."}
7. {"type":"set_clip_speed","clipId":"optional","targetTrack":"optional","playbackRate":0.25..4,"reason":"..."}
8. {"type":"apply_effect","targetTrack":"v1","clipIds":["optional"],"effect":"Chromatic Aberration|Emerald Forest|Vintage 35mm|VHS Overdrive","reason":"..."}
9. {"type":"add_text_overlay","text":"string","startTime":number,"duration":number,"positionY":number,"scale":number,"stylePreset":"hormozi|minimal|neon","reason":"..."}
10. {"type":"duck_audio","voiceTrack":"a1","bgmTrack":"a2","voiceVolume":95,"bgmVolume":22,"reason":"..."}
11. {"type":"insert_broll","mediaAssetId":"string","startTime":number,"duration":number,"trackId":"v2","opacity":100,"reason":"..."}
12. {"type":"delete_clip","clipId":"string","ripple":true,"reason":"..."}
13. {"type":"set_aspect_ratio","aspectRatio":"16:9|9:16|1:1|4:5","reason":"..."}
14. {"type":"set_audio_mastering","normalizeLufs":true,"targetLufs":-14,"autoDuckBgm":true,"reason":"..."}
15. {"type":"set_clip_transition","targetTrack":"v1","transitionIn":"none|fade|dissolve","transitionDuration":0.35,"reason":"..."}

Rules:
- Only reference existing clip IDs and mediaAssetIds from the provided context.
- For "pro reels / short / viral / polish" commands, combine set_aspect_ratio (9:16 if vertical/reels/shorts/tiktok), set_audio_mastering (-14 LUFS + autoDuckBgm), remove_silences, generate_captions (hormozi), apply_punch_in_zoom, and duck_audio.
- Keep actions practical, non-destructive, and ordered logically (e.g., remove_silences or split_at_scenes before generate_captions/apply_punch_in_zoom).`;

function extractJsonBlock(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(candidate);
}

async function planWithGemini(
  prompt: string,
  context: TimelinePromptContext
): Promise<AiDirectorPlan> {
  const apiKey = process.env.GEMINI_API_KEY!;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(25000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Timeline Context:\n${JSON.stringify(context)}\n\nUser Command: ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Gemini returned empty response');

  return AiDirectorPlanSchema.parse(extractJsonBlock(rawText));
}

async function planWithOpenAiCompatible(
  prompt: string,
  context: TimelinePromptContext
): Promise<AiDirectorPlan> {
  const baseUrl = (
    process.env.OPENAI_BASE_URL ||
    process.env.OLLAMA_BASE_URL ||
    (process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : 'https://api.openai.com/v1')
  ).replace(/\/$/, '');

  const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || 'ollama';
  const model =
    process.env.OPENAI_MODEL || (process.env.OLLAMA_BASE_URL ? 'llama3.2' : 'gpt-4o-mini');

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(25000),
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        {
          role: 'user',
          content: `Timeline Context:\n${JSON.stringify(context)}\n\nUser Command: ${prompt}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`LLM API error (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) throw new Error('LLM returned empty response');

  return AiDirectorPlanSchema.parse(extractJsonBlock(rawText));
}

/**
 * Deterministic local intent planner so natural language commands work offline with zero API keys.
 */
export function planWithLocalIntent(
  prompt: string,
  context: TimelinePromptContext
): AiDirectorPlan {
  const lower = prompt.toLowerCase();
  const actions: AiEditAction[] = [];

  const isProPolish =
    /\b(pro|polish|viral|reels|shorts|tiktok|auto[\s-]?edit|full edit|cinematic edit)\b/.test(
      lower
    );

  // 0. Aspect Ratio / Vertical Reframe
  if (/\b(9:16|vertical|reels|shorts|tiktok)\b/.test(lower)) {
    actions.push({
      type: 'set_aspect_ratio',
      aspectRatio: '9:16',
      reason: 'Reframe output canvas to 9:16 vertical',
    });
  } else if (/\b(1:1|square|instagram post)\b/.test(lower)) {
    actions.push({
      type: 'set_aspect_ratio',
      aspectRatio: '1:1',
      reason: 'Reframe output canvas to 1:1 square',
    });
  } else if (/\b4:5\b/.test(lower)) {
    actions.push({
      type: 'set_aspect_ratio',
      aspectRatio: '4:5',
      reason: 'Reframe output canvas to 4:5 portrait',
    });
  } else if (/\b(16:9|widescreen|landscape|youtube)\b/.test(lower)) {
    actions.push({
      type: 'set_aspect_ratio',
      aspectRatio: '16:9',
      reason: 'Set output canvas to 16:9 widescreen',
    });
  }

  // 0b. Audio mastering (-14 LUFS + sidechain ducking)
  if (isProPolish || /\b(lufs|normalize|master|sidechain|duck)\b/.test(lower)) {
    const targetLufs = lower.includes('-16') ? -16 : -14;
    actions.push({
      type: 'set_audio_mastering',
      normalizeLufs: true,
      targetLufs,
      autoDuckBgm: true,
      reason: `Enable ${targetLufs} LUFS loudness normalization & FFmpeg sidechain BGM ducking`,
    });
  }

  // 0c. Transitions
  if (/\b(dissolve|crossfade)\b/.test(lower)) {
    actions.push({
      type: 'set_clip_transition',
      targetTrack: 'v1',
      clipIds: context.selectedClipId ? [context.selectedClipId] : undefined,
      transitionIn: 'dissolve',
      transitionDuration: 0.4,
      reason: 'Apply smooth dissolve transition',
    });
  } else if (/\bfade\b/.test(lower)) {
    actions.push({
      type: 'set_clip_transition',
      targetTrack: 'v1',
      clipIds: context.selectedClipId ? [context.selectedClipId] : undefined,
      transitionIn: 'fade',
      transitionDuration: 0.35,
      reason: 'Apply smooth fade-in transition',
    });
  }

  // 1. Silence removal / dead-air cleanup
  if (
    isProPolish ||
    /\b(silence|silences|dead air|pause|pauses|umms|retake|clean up audio)\b/.test(lower)
  ) {
    actions.push({
      type: 'remove_silences',
      clipId: context.selectedClipId ?? undefined,
      minSilenceSec: 0.45,
      paddingSec: 0.12,
      reason: 'Cut silent dead-air pauses and tighten pacing',
    });
  }

  // 2. Scene-cut splitting
  if (/\b(scene|scenes|shot|shots|auto[\s-]?cut)\b/.test(lower)) {
    actions.push({
      type: 'split_at_scenes',
      clipId: context.selectedClipId ?? undefined,
      maxSceneSplits: 12,
      reason: 'Split video clip at FFmpeg-detected scene boundaries',
    });
  }

  // 3. Explicit split at time / playhead
  const splitMatch = lower.match(/\b(?:split|cut)\b.*?\b(?:at|@)\s*(\d+(?:\.\d+)?)\s*s?\b/);
  if (splitMatch) {
    actions.push({
      type: 'split_clip',
      clipId: context.selectedClipId ?? undefined,
      time: parseFloat(splitMatch[1]),
      reason: `Split clip at ${splitMatch[1]}s`,
    });
  } else if (/\bsplit\b/.test(lower) && !/\bscene\b/.test(lower)) {
    actions.push({
      type: 'split_clip',
      clipId: context.selectedClipId ?? undefined,
      time: context.playheadTime,
      reason: `Split clip at playhead (${context.playheadTime.toFixed(1)}s)`,
    });
  }

  // 4. Punch-in zoom on alternating cuts
  if (isProPolish || /\b(punch[\s-]?in|zoom|dynamic zoom|ken burns)\b/.test(lower)) {
    actions.push({
      type: 'apply_punch_in_zoom',
      targetTrack: 'v1',
      scalePercent: 114,
      reason: 'Add alternating 114% punch-in zoom on cuts for viewer retention',
    });
  }

  // 5. Captions / subtitles
  if (isProPolish || /\b(caption|captions|subtitle|subtitles|transcribe|hormozi)\b/.test(lower)) {
    const stylePreset = lower.includes('minimal')
      ? 'minimal'
      : lower.includes('neon')
      ? 'neon'
      : 'hormozi';
    actions.push({
      type: 'generate_captions',
      clipId: context.selectedClipId ?? undefined,
      stylePreset,
      reason: `Generate synced ${stylePreset}-style captions via Whisper`,
    });
  }

  // 6. Audio ducking / balancing
  if (isProPolish || /\b(duck|bgm|music|audio balance|loudness|mix audio|lower music)\b/.test(lower)) {
    actions.push({
      type: 'duck_audio',
      voiceTrack: 'a1',
      bgmTrack: 'a2',
      voiceVolume: 95,
      bgmVolume: 22,
      reason: 'Boost dialogue (A1) and duck background music (A2) to 22%',
    });
  }

  // 7. Visual Effects & Color Grades
  type EffectName = Extract<AiEditAction, { type: 'apply_effect' }>['effect'];
  const effectMap: Array<[RegExp, EffectName]> = [
    [/\b(vintage|35mm|retro|film|warm)\b/, 'Vintage 35mm'],
    [/\b(emerald|forest|green|teal|cinema|cinematic)\b/, 'Emerald Forest'],
    [/\b(vhs|tape|overdrive|90s)\b/, 'VHS Overdrive'],
    [/\b(chromatic|aberration|glitch|rgb)\b/, 'Chromatic Aberration'],
  ];
  for (const [pattern, effect] of effectMap) {
    if (pattern.test(lower)) {
      actions.push({
        type: 'apply_effect',
        targetTrack: 'v1',
        clipIds: context.selectedClipId ? [context.selectedClipId] : undefined,
        effect,
        reason: `Apply ${effect} grade/VFX`,
      });
      break;
    }
  }

  // 8. Speed changes (e.g. "speed up 1.5x" or "slow mo 0.5x")
  const speedMatch = lower.match(/(\d+(?:\.\d+)?)\s*x\b/);
  if (speedMatch || /\b(speed up|faster|slow motion|slow mo)\b/.test(lower)) {
    const rate = speedMatch
      ? Math.max(0.25, Math.min(4, parseFloat(speedMatch[1])))
      : /\b(slow motion|slow mo)\b/.test(lower)
      ? 0.5
      : 1.5;
    actions.push({
      type: 'set_clip_speed',
      clipId: context.selectedClipId ?? undefined,
      targetTrack: 'v1',
      playbackRate: rate,
      reason: `Set playback speed to ${rate}x`,
    });
  }

  // 9. Explicit quoted text / title overlay
  const titleMatch = prompt.match(/["']([^"']{2,80})["']/);
  if (titleMatch || /\b(add title|add text|intro text)\b/.test(lower)) {
    const text = titleMatch ? titleMatch[1] : 'FEATURED CLIP';
    actions.push({
      type: 'add_text_overlay',
      text,
      startTime: context.playheadTime,
      duration: 4,
      positionY: -40,
      scale: 120,
      stylePreset: 'neon',
      reason: `Add title "${text}" at ${context.playheadTime.toFixed(1)}s`,
    });
  }

  // 10. Insert B-Roll matching asset name
  if (/\b(b-?roll|overlay|insert)\b/.test(lower) && context.mediaAssets.length > 0) {
    const matchedAsset =
      context.mediaAssets.find((a) =>
        a.name
          .toLowerCase()
          .replace(/\.[^.]+$/, '')
          .split(/[_\s-]+/)
          .some((tok) => tok.length > 2 && lower.includes(tok))
      ) || context.mediaAssets.find((a) => a.type === 'video' || a.type === 'image');

    if (matchedAsset) {
      actions.push({
        type: 'insert_broll',
        mediaAssetId: matchedAsset.id,
        startTime: context.playheadTime,
        duration: Math.min(5, matchedAsset.duration),
        trackId: 'v2',
        opacity: 100,
        reason: `Insert B-roll "${matchedAsset.name}" on V2 at ${context.playheadTime.toFixed(1)}s`,
      });
    }
  }

  // 11. Delete selected clip
  if (/\b(delete|remove clip)\b/.test(lower) && context.selectedClipId) {
    actions.push({
      type: 'delete_clip',
      clipId: context.selectedClipId,
      ripple: !lower.includes('no ripple'),
      reason: 'Remove selected clip from timeline',
    });
  }

  const summary =
    actions.length > 0
      ? `Planned ${actions.length} edit action${actions.length === 1 ? '' : 's'} for: "${prompt.trim()}"`
      : 'No matching edit commands detected. Try "Cut silences, add Hormozi captions, punch-in zoom, and duck BGM" or configure GEMINI_API_KEY / OPENAI_API_KEY.';

  return { summary, actions };
}

export async function generateAiEditPlan(
  prompt: string,
  context: TimelinePromptContext
): Promise<{ plan: AiDirectorPlan; engine: DirectorEngine; model: string }> {
  const active = getActiveDirectorEngine();

  if (active.engine === 'gemini') {
    const plan = await planWithGemini(prompt, context);
    return { plan, ...active };
  }

  if (active.engine === 'openai-compatible') {
    const plan = await planWithOpenAiCompatible(prompt, context);
    return { plan, ...active };
  }

  const plan = planWithLocalIntent(prompt, context);
  return { plan, ...active };
}
