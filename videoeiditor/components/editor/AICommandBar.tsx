'use client';

import React, { useEffect, useState } from 'react';
import { useEditorStore, editorStore } from '../../store/editorStore';
import type { AiDirectorPlan, AiEditAction, TimelinePromptContext } from '../../lib/ai/tools';
import { BUILTIN_STYLE_PRESETS, stylePresetToActions } from '../../lib/ai/styles';
import type { StylePreset } from '../../lib/timeline/types';

const QUICK_PROMPTS = [
  {
    label: 'Pro Reels Polish',
    prompt: 'Pro polish: cut silences, add Hormozi captions, punch-in zoom, and duck BGM',
  },
  {
    label: 'Cut Dead Air',
    prompt: 'Remove silences and dead air pauses from the video',
  },
  {
    label: 'Auto Captions',
    prompt: 'Generate Hormozi style captions from speech',
  },
  {
    label: 'Scene Split',
    prompt: 'Split video at detected scene boundaries',
  },
  {
    label: 'Punch-In Zoom',
    prompt: 'Apply alternating punch-in zoom on cuts',
  },
  {
    label: 'Duck BGM',
    prompt: 'Duck background music under voice track',
  },
];

export default function AICommandBar() {
  const canUndo = useEditorStore((state) => state.canUndo);
  const customStylePresets = useEditorStore((state) => state.customStylePresets || []);
  const allStylePresets: StylePreset[] = [...customStylePresets, ...BUILTIN_STYLE_PRESETS];

  const [prompt, setPrompt] = useState('');
  const [reviewMode, setReviewMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [engineInfo, setEngineInfo] = useState<{ engine: string; model: string } | null>(null);
  const [pendingPlan, setPendingPlan] = useState<AiDirectorPlan | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastLogs, setLastLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUndoHint, setShowUndoHint] = useState(false);

  useEffect(() => {
    fetch('/api/ai/command')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setEngineInfo(data);
      })
      .catch(() => {});
  }, []);

  const buildContext = (): TimelinePromptContext => {
    const state = editorStore.getState();
    const compactClips: TimelinePromptContext['clips'] = {};
    for (const [trackId, list] of Object.entries(state.clips)) {
      compactClips[trackId] = list.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        startTime: c.startTime,
        duration: c.duration,
        sourceStart: c.sourceStart,
        playbackRate: c.playbackRate,
        volume: c.volume,
        scale: c.scale,
        appliedEffects: c.appliedEffects,
        text: c.text,
        mediaAssetId: c.mediaAssetId,
      }));
    }

    return {
      playheadTime: state.playheadTime,
      selectedClipId: state.selectedClipId,
      tracks: state.tracks.map((t) => ({
        id: t.id,
        name: t.name,
        type: t.type,
        muted: t.muted,
        locked: t.locked,
      })),
      clips: compactClips,
      mediaAssets: state.mediaAssets.map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        duration: a.duration,
        silencesCount: a.analysis?.silences.length,
        scenesCount: a.analysis?.scenes.length,
        wordsCount: a.analysis?.words.length,
        transcriptPreview: a.analysis?.speechSegments
          .slice(0, 4)
          .map((s) => s.text)
          .join(' ')
          .slice(0, 180),
      })),
    };
  };

  const applyActions = async (actions: AiEditAction[]) => {
    if (actions.length === 0) return;
    setExecuting(true);
    setErrorMsg(null);
    try {
      const res = await editorStore.executeAiPlan(actions);
      setPendingPlan(null);
      setLastLogs(res.logs);
      setStatusMessage(`Applied ${res.appliedCount} AI action${res.appliedCount === 1 ? '' : 's'}.`);
      setShowUndoHint(res.appliedCount > 0);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to execute AI plan');
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, overridePrompt?: string) => {
    if (e) e.preventDefault();
    const activePrompt = (overridePrompt ?? prompt).trim();
    if (!activePrompt || loading || executing) return;

    setLoading(true);
    setErrorMsg(null);
    setStatusMessage(null);
    setLastLogs([]);
    setShowUndoHint(false);

    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          context: buildContext(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI Director request failed');
      }

      const plan = data.plan as AiDirectorPlan;
      if (data.engine) {
        setEngineInfo({ engine: data.engine, model: data.model });
      }

      if (plan.actions.length === 0) {
        setStatusMessage(plan.summary);
        setPendingPlan(null);
        return;
      }

      if (reviewMode) {
        setPendingPlan(plan);
      } else {
        await applyActions(plan.actions);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'AI command failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUndoAi = () => {
    editorStore.undo();
    setShowUndoHint(false);
    setStatusMessage('Reverted last AI edit batch.');
    setLastLogs([]);
  };

  const formatActionBadge = (action: AiEditAction) => {
    switch (action.type) {
      case 'remove_silences':
        return 'SILENCE CUT';
      case 'generate_captions':
        return `CAPTIONS (${action.stylePreset ?? 'hormozi'})`;
      case 'split_at_scenes':
        return 'SCENE SPLIT';
      case 'apply_punch_in_zoom':
        return `ZOOM ${action.scalePercent ?? 114}%`;
      case 'apply_effect':
        return `VFX: ${action.effect}`;
      case 'duck_audio':
        return 'AUDIO DUCK';
      case 'set_clip_speed':
        return `SPEED ${action.playbackRate}x`;
      case 'add_text_overlay':
        return `TITLE "${action.text}"`;
      case 'insert_broll':
        return 'INSERT B-ROLL';
      case 'split_clip':
        return `SPLIT @ ${action.time.toFixed(1)}s`;
      case 'trim_clip':
        return 'TRIM CLIP';
      case 'delete_clip':
        return 'DELETE CLIP';
      case 'set_aspect_ratio':
        return `ASPECT ${action.aspectRatio}`;
      case 'set_audio_mastering':
        return `MASTER ${action.targetLufs ?? -14} LUFS`;
      case 'set_clip_transition':
        return `TRANSITION: ${action.transitionIn.toUpperCase()}`;
    }
  };

  const handleApplyStylePreset = (preset: StylePreset) => {
    const actions = stylePresetToActions(preset);
    if (reviewMode) {
      setPendingPlan({
        summary: `Style Skill "${preset.name}": ${preset.description}`,
        actions,
      });
    } else {
      void applyActions(actions);
    }
  };

  const handleSaveCurrentStyle = () => {
    const state = editorStore.getState();
    const v1Clips = state.clips['v1'] || [];
    const firstClip = v1Clips[0];
    const name = window.prompt('Name your reusable Style Skill:', 'My Pro Preset');
    if (!name || !name.trim()) return;

    const preset: StylePreset = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: `Custom ${state.exportConfig.aspectRatio || '16:9'} preset`,
      aspectRatio: state.exportConfig.aspectRatio || '16:9',
      captionStyle: 'hormozi',
      removeSilences: true,
      punchInScale: firstClip?.scale && firstClip.scale > 100 ? firstClip.scale : 112,
      transitionIn: firstClip?.transitionIn || 'fade',
      effect: firstClip?.appliedEffects?.[0] as StylePreset['effect'],
      audioMastering: state.exportConfig.audioMastering || {
        normalizeLufs: true,
        targetLufs: -14,
        autoDuckBgm: true,
      },
    };
    editorStore.saveCustomStylePreset(preset);
    setStatusMessage(`Saved Style Skill "${preset.name}".`);
  };

  return (
    <div className="border-b border-outline-variant bg-surface-container-low px-3 py-2 flex flex-col gap-2 flex-shrink-0">
      {/* Main Command Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono-data font-bold flex-shrink-0">
          <span className="material-symbols-outlined text-[14px] block">auto_awesome</span>
          <span>AI DIRECTOR</span>
          {engineInfo && (
            <span className="text-[9px] text-secondary opacity-90 font-normal">
              ({engineInfo.engine === 'local-intent' ? 'Local' : engineInfo.engine})
            </span>
          )}
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="flex-1 min-w-[240px] flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Command AI to edit... e.g. "Cut silences, add Hormozi captions, punch-in zoom, apply Vintage 35mm"'
            disabled={loading || executing}
            className="flex-1 bg-surface-container-lowest border border-outline-variant focus:border-primary rounded-lg px-3 py-1.5 text-xs text-on-surface outline-none placeholder:text-outline/60"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || loading || executing}
            className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-caps text-[10px] font-bold uppercase cursor-pointer hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
          >
            <span
              className={`material-symbols-outlined text-[14px] block ${
                loading || executing ? 'animate-spin' : ''
              }`}
            >
              {loading || executing ? 'sync' : 'bolt'}
            </span>
            <span>{loading ? 'Planning...' : executing ? 'Applying...' : 'Run AI'}</span>
          </button>
        </form>

        <button
          type="button"
          onClick={() => setReviewMode((prev) => !prev)}
          className={`px-2 py-1 rounded border text-[10px] font-mono-data cursor-pointer transition-colors flex-shrink-0 ${
            reviewMode
              ? 'border-secondary/40 bg-secondary/10 text-secondary'
              : 'border-outline-variant bg-surface-container-high text-on-surface-variant'
          }`}
          title="Toggle between reviewing AI plan before applying vs auto-applying immediately"
        >
          {reviewMode ? 'Review: ON' : 'Auto-Run'}
        </button>

        {showUndoHint && canUndo && (
          <button
            type="button"
            onClick={handleUndoAi}
            className="px-2.5 py-1 rounded border border-tertiary/50 bg-tertiary/10 text-tertiary text-[10px] font-mono-data font-bold cursor-pointer hover:bg-tertiary hover:text-on-tertiary transition-colors flex items-center gap-1 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[13px] block">undo</span>
            <span>Undo AI Edit</span>
          </button>
        )}
      </div>

      {/* Quick Prompts & Style Skills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[9px] font-label-caps uppercase text-secondary font-bold mr-1 flex-shrink-0">
          Style Skills:
        </span>
        <select
          defaultValue=""
          disabled={loading || executing}
          onChange={(e) => {
            const preset = allStylePresets.find((p) => p.id === e.target.value);
            if (preset) {
              handleApplyStylePreset(preset);
              e.target.value = '';
            }
          }}
          className="px-2 py-0.5 rounded bg-surface-container-lowest border border-secondary/40 text-secondary text-[10px] font-mono-data cursor-pointer outline-none flex-shrink-0"
        >
          <option value="" disabled>
            Apply Style Preset...
          </option>
          {allStylePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSaveCurrentStyle}
          disabled={loading || executing}
          className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant hover:border-secondary hover:text-secondary text-[10px] text-on-surface-variant whitespace-nowrap cursor-pointer transition-colors flex-shrink-0"
          title="Save current aspect ratio, mastering, and transition settings as a reusable Style Skill"
        >
          + Save Style
        </button>

        <div className="h-3 w-px bg-outline-variant mx-1 flex-shrink-0"></div>

        <span className="text-[9px] font-label-caps uppercase text-outline mr-1 flex-shrink-0">
          Presets:
        </span>
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={loading || executing}
            onClick={() => {
              setPrompt(item.prompt);
              void handleSubmit(undefined, item.prompt);
            }}
            className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant hover:border-primary hover:text-primary text-[10px] text-on-surface-variant whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Plan Review Drawer */}
      {pendingPlan && (
        <div className="bg-surface-container border border-primary/40 rounded-lg p-2.5 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-on-surface truncate">
              {pendingPlan.summary}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setPendingPlan(null)}
                disabled={executing}
                className="px-2.5 py-1 rounded border border-outline-variant text-[10px] font-label-caps uppercase text-on-surface-variant hover:text-white cursor-pointer"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => void applyActions(pendingPlan.actions)}
                disabled={executing}
                className="px-3 py-1 rounded bg-secondary text-on-secondary text-[10px] font-label-caps uppercase font-bold cursor-pointer hover:brightness-105 disabled:opacity-50"
              >
                {executing ? 'Applying...' : `Apply ${pendingPlan.actions.length} Action(s)`}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pendingPlan.actions.map((act, idx) => (
              <div
                key={idx}
                className="px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant text-[10px] font-mono-data flex items-center gap-1.5"
                title={act.reason}
              >
                <span className="text-primary font-bold">{formatActionBadge(act)}</span>
                {act.reason && <span className="text-on-surface-variant max-w-[240px] truncate">{act.reason}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status / Execution Feedback */}
      {(statusMessage || errorMsg) && !pendingPlan && (
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-data">
          {errorMsg ? (
            <span className="text-error">{errorMsg}</span>
          ) : (
            <span className="text-secondary">{statusMessage}</span>
          )}
          {lastLogs.slice(0, 3).map((log, idx) => (
            <span
              key={idx}
              className="px-1.5 py-0.5 rounded bg-surface-container-lowest border border-outline-variant text-on-surface-variant"
            >
              {log}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
