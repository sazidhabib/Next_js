'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useEditorStore, editorStore, TimelineClip } from '../../store/editorStore';
import {
  collectSnapTargets,
  computeTimelineDuration,
  computeTrimmedClipPatch,
  roundTime,
  snapTime,
} from '../../lib/timeline/commands';

interface TimelineProps {
  activeTool?: string;
  setActiveTool?: (tool: string) => void;
}

export default function Timeline({ activeTool = 'select', setActiveTool }: TimelineProps) {
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const zoom = useEditorStore((state) => state.zoom);
  const snapEnabled = useEditorStore((state) => state.snapEnabled);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const tracks = useEditorStore((state) => state.tracks);
  const clipsMap = useEditorStore((state) => state.clips);
  const mediaAssets = useEditorStore((state) => state.mediaAssets);
  const exportConfig = useEditorStore((state) => state.exportConfig);

  const rulerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);

  // Clip Drag-Move State
  const [draggedClipId, setDraggedClipId] = useState<string | null>(null);
  const dragStartXPx = useRef(0);
  const dragStartClip = useRef<TimelineClip | null>(null);

  // Clip Resize/Trim State
  const [resizedClipId, setResizedClipId] = useState<string | null>(null);
  const resizeStartXPx = useRef(0);
  const resizeInitialClip = useRef<TimelineClip | null>(null);
  const resizeDirection = useRef<'left' | 'right'>('right');

  // Drag over highlights for Drag-and-Drop
  const [draggedOverTrack, setDraggedOverTrack] = useState<string | null>(null);

  // Dynamic timeline duration & pixels per second
  const pxPerSec = (zoom / 50) * 15;
  const maxTimelineDuration = useMemo(() => computeTimelineDuration(clipsMap), [clipsMap]);
  const snapToleranceSec = Math.max(0.15, 8 / pxPerSec);

  const handleRulerInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const targetTime = Math.max(0, Math.min(maxTimelineDuration, clickX / pxPerSec));
    editorStore.setPlayheadTime(targetTime);
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingPlayhead(true);
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    clip: TimelineClip,
    direction: 'left' | 'right',
    isLocked?: boolean
  ) => {
    e.stopPropagation();
    e.preventDefault();
    if (isLocked) return;

    editorStore.pushHistoryCheckpoint();
    setResizedClipId(clip.id);
    resizeDirection.current = direction;
    resizeStartXPx.current = e.clientX;
    resizeInitialClip.current = { ...clip };
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingPlayhead) {
        const rect = rulerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const offsetLeft = e.clientX - rect.left;
        const targetTime = Math.max(0, Math.min(maxTimelineDuration, offsetLeft / pxPerSec));
        editorStore.setPlayheadTime(targetTime);
      }

      if (draggedClipId && dragStartClip.current) {
        const deltaPx = e.clientX - dragStartXPx.current;
        const deltaTime = deltaPx / pxPerSec;
        let targetTime = Math.max(0, dragStartClip.current.startTime + deltaTime);

        if (snapEnabled) {
          const state = editorStore.getState();
          const targets = collectSnapTargets(state.clips, state.playheadTime, draggedClipId);
          const snappedStart = snapTime(targetTime, targets, snapToleranceSec);
          if (snappedStart !== roundTime(targetTime)) {
            targetTime = snappedStart;
          } else {
            // Also try snapping the clip's end edge
            const clipDuration = dragStartClip.current.duration;
            const snappedEnd = snapTime(targetTime + clipDuration, targets, snapToleranceSec);
            if (snappedEnd !== roundTime(targetTime + clipDuration)) {
              targetTime = Math.max(0, snappedEnd - clipDuration);
            }
          }
        }

        editorStore.updateClip(
          draggedClipId,
          { startTime: roundTime(targetTime, 2) },
          { recordHistory: false }
        );
      }

      if (resizedClipId && resizeInitialClip.current) {
        const deltaPx = e.clientX - resizeStartXPx.current;
        let deltaTime = deltaPx / pxPerSec;

        if (snapEnabled) {
          const state = editorStore.getState();
          const targets = collectSnapTargets(state.clips, state.playheadTime, resizedClipId);
          if (resizeDirection.current === 'right') {
            const candidateEnd =
              resizeInitialClip.current.startTime + resizeInitialClip.current.duration + deltaTime;
            const snappedEnd = snapTime(candidateEnd, targets, snapToleranceSec);
            if (snappedEnd !== roundTime(candidateEnd)) {
              deltaTime =
                snappedEnd -
                (resizeInitialClip.current.startTime + resizeInitialClip.current.duration);
            }
          } else {
            const candidateStart = resizeInitialClip.current.startTime + deltaTime;
            const snappedStart = snapTime(candidateStart, targets, snapToleranceSec);
            if (snappedStart !== roundTime(candidateStart)) {
              deltaTime = snappedStart - resizeInitialClip.current.startTime;
            }
          }
        }

        const patch = computeTrimmedClipPatch(
          resizeInitialClip.current,
          resizeDirection.current,
          deltaTime
        );
        editorStore.updateClip(resizedClipId, patch, { recordHistory: false });
      }
    };

    const handleGlobalMouseUp = () => {
      if (draggingPlayhead) setDraggingPlayhead(false);
      if (draggedClipId) {
        setDraggedClipId(null);
        dragStartClip.current = null;
      }
      if (resizedClipId) {
        setResizedClipId(null);
        resizeInitialClip.current = null;
      }
    };

    if (draggingPlayhead || draggedClipId || resizedClipId) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingPlayhead, draggedClipId, resizedClipId, pxPerSec, maxTimelineDuration, snapEnabled, snapToleranceSec]);

  const handleClipMouseDown = (
    e: React.MouseEvent,
    clip: TimelineClip,
    isLocked?: boolean
  ) => {
    e.stopPropagation();

    if (activeTool === 'blade') {
      if (isLocked) return;
      const rulerRect = rulerRef.current?.getBoundingClientRect();
      if (!rulerRect) return;
      const clickX = e.clientX - rulerRect.left;
      const clickTime = roundTime(Math.max(0, clickX / pxPerSec), 2);
      const splitResult = editorStore.splitClip(clip.id, clickTime);
      if (splitResult && setActiveTool) {
        editorStore.setPlayheadTime(clickTime);
      }
      return;
    }

    editorStore.setSelectedClipId(clip.id);
    if (isLocked) return;

    editorStore.pushHistoryCheckpoint();
    setDraggedClipId(clip.id);
    dragStartXPx.current = e.clientX;
    dragStartClip.current = { ...clip };
  };

  const handleClipDelete = (e: React.MouseEvent, clipId: string, isLocked?: boolean) => {
    e.stopPropagation();
    if (isLocked) return;
    editorStore.deleteClip(clipId);
  };

  const handleDragOver = (e: React.DragEvent, trackId: string, isLocked?: boolean) => {
    if (isLocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (draggedOverTrack !== trackId) {
      setDraggedOverTrack(trackId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverTrack(null);
  };

  const handleRowDrop = (e: React.DragEvent, trackId: string, isLocked?: boolean) => {
    e.preventDefault();
    setDraggedOverTrack(null);
    if (isLocked) return;

    try {
      const assetData = e.dataTransfer.getData('application/json');
      if (!assetData) return;
      const asset = JSON.parse(assetData);

      const rect = e.currentTarget.getBoundingClientRect();
      const dropXPx = e.clientX - rect.left;
      let startTime = Math.max(0, roundTime(dropXPx / pxPerSec, 2));

      if (snapEnabled) {
        const targets = collectSnapTargets(clipsMap, playheadTime);
        startTime = snapTime(startTime, targets, snapToleranceSec);
      }

      editorStore.addClipToTrack(trackId, asset, startTime);
    } catch (err) {
      console.error('Failed to drop asset:', err);
    }
  };

  const formatTimecode = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    const frames = Math.floor((timeInSecs % 1) * 24);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames
      .toString()
      .padStart(2, '0')}`;
  };

  const renderRulerTicks = () => {
    const ticks = [];
    const step = zoom >= 70 ? 2 : 5;
    for (let s = 0; s <= maxTimelineDuration; s += step) {
      ticks.push(
        <div
          key={s}
          className="absolute border-l border-outline-variant h-3 text-[8px] font-mono-data opacity-50 flex flex-col justify-end"
          style={{ left: `${s * pxPerSec}px` }}
        >
          <span className="pl-1 pb-0.5 select-none">{formatTimecode(s)}</span>
        </div>
      );
    }
    return ticks;
  };

  const videoTracks = tracks.filter((t) => t.type === 'video');
  const audioTracks = tracks.filter((t) => t.type === 'audio');

  const isBladeMode = activeTool === 'blade';

  return (
    <section className="h-80 flex flex-col bg-surface overflow-hidden relative select-none flex-shrink-0">
      {/* Timeline Toolbar */}
      <div className="flex items-center justify-between px-3 h-8 border-b border-outline-variant bg-surface-container-low flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-surface-container-high rounded px-2 py-0.5 border border-outline-variant">
            <span className="material-symbols-outlined text-xs text-primary block">alarm</span>
            <span className="font-mono-data text-[10px] text-on-surface">
              {formatTimecode(playheadTime)}
            </span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editorStore.setZoom(Math.max(10, zoom - 10))}
              className="material-symbols-outlined text-sm text-on-surface-variant p-1 hover:bg-surface-container-high rounded cursor-pointer block font-sans"
              title="Zoom Out"
            >
              zoom_out
            </button>
            <input
              type="range"
              min="10"
              max="100"
              value={zoom}
              onChange={(e) => editorStore.setZoom(parseInt(e.target.value))}
              className="w-20 accent-primary cursor-pointer h-1"
            />
            <button
              onClick={() => editorStore.setZoom(Math.min(100, zoom + 10))}
              className="material-symbols-outlined text-sm text-on-surface-variant p-1 hover:bg-surface-container-high rounded cursor-pointer block font-sans"
              title="Zoom In"
            >
              zoom_in
            </button>
          </div>
        </div>

        {/* Track triggers, Split at Playhead & Snap Magnet */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => editorStore.splitAtPlayhead()}
            className="flex items-center gap-1 text-[9px] font-label-caps uppercase bg-surface-container-high border border-outline-variant hover:border-primary hover:text-primary px-2 py-0.5 rounded cursor-pointer transition-colors font-sans font-bold"
            title="Split clip at playhead (S)"
          >
            <span className="material-symbols-outlined text-[11px] block font-bold">content_cut</span>
            <span>Split</span>
          </button>

          <button
            onClick={() => editorStore.addTrack('video')}
            className="flex items-center gap-1 text-[9px] font-label-caps uppercase bg-surface-container-high border border-outline-variant hover:border-primary hover:text-primary px-2 py-0.5 rounded cursor-pointer transition-colors font-sans font-bold"
            title="Add Video Track"
          >
            <span className="material-symbols-outlined text-[10px] block font-bold">add</span>
            <span>+ Video</span>
          </button>

          <button
            onClick={() => editorStore.addTrack('audio')}
            className="flex items-center gap-1 text-[9px] font-label-caps uppercase bg-surface-container-high border border-outline-variant hover:border-secondary hover:text-secondary px-2 py-0.5 rounded cursor-pointer transition-colors font-sans font-bold"
            title="Add Audio Track"
          >
            <span className="material-symbols-outlined text-[10px] block font-bold">add</span>
            <span>+ Audio</span>
          </button>

          <div className="h-4 w-px bg-outline-variant mx-1"></div>

          <button
            onClick={() => editorStore.toggleSnap()}
            className={`material-symbols-outlined text-sm p-1 rounded cursor-pointer block transition-colors ${
              snapEnabled
                ? 'text-primary bg-primary/15'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title={snapEnabled ? 'Snap Magnet: ON' : 'Snap Magnet: OFF'}
          >
            magnet
          </button>
          <button
            onClick={() => setActiveTool && setActiveTool(isBladeMode ? 'select' : 'blade')}
            className={`material-symbols-outlined text-sm p-1 rounded cursor-pointer block transition-colors ${
              isBladeMode
                ? 'text-primary bg-primary/15'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title={isBladeMode ? 'Blade Mode Active (C) — Click a clip to cut' : 'Switch to Blade Tool (C)'}
          >
            content_cut
          </button>
        </div>
      </div>

      {/* Tracks Board area */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto custom-scrollbar relative flex bg-[#121212]"
      >
        {/* Sticky Sidebar Track Headers */}
        <div className="w-24 border-r border-outline-variant bg-surface sticky left-0 z-30 flex flex-col flex-shrink-0">
          {/* Ruler Spacer to align headers with tracks */}
          <div className="h-6 border-b border-outline-variant bg-[#131313] flex-shrink-0"></div>

          {/* Video Headers */}
          {videoTracks.map((track) => (
            <div
              key={track.id}
              className={`h-timeline-track-height flex items-center justify-between px-1.5 border-b border-outline-variant bg-surface-container-low text-[8px] font-bold relative group ${
                track.muted ? 'opacity-50' : 'text-on-surface-variant'
              }`}
            >
              <span className="truncate max-w-[44px]" title={track.name}>
                {track.name}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.toggleTrackMute(track.id);
                  }}
                  className={`material-symbols-outlined text-[11px] cursor-pointer font-sans ${
                    track.muted ? 'text-tertiary' : 'text-on-surface-variant/60 hover:text-white'
                  }`}
                  title={track.muted ? 'Show/Unmute Track' : 'Hide/Mute Track'}
                >
                  {track.muted ? 'visibility_off' : 'visibility'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.toggleTrackLock(track.id);
                  }}
                  className={`material-symbols-outlined text-[11px] cursor-pointer font-sans ${
                    track.locked ? 'text-primary' : 'text-on-surface-variant/60 hover:text-white'
                  }`}
                  title={track.locked ? 'Unlock Track' : 'Lock Track'}
                >
                  {track.locked ? 'lock' : 'lock_open'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete track "${track.name}" and all of its timeline clips?`)) {
                      editorStore.deleteTrack(track.id);
                    }
                  }}
                  className="material-symbols-outlined text-[11px] text-error hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-bold font-sans"
                  title="Delete Track"
                >
                  delete
                </button>
              </div>
            </div>
          ))}

          {/* Spacer */}
          <div className="h-2 bg-surface-container-highest flex-shrink-0"></div>

          {/* Audio Headers */}
          {audioTracks.map((track) => (
            <div
              key={track.id}
              className={`h-timeline-track-height flex items-center justify-between px-1.5 border-b border-outline-variant bg-surface-container-low text-[8px] font-bold relative group font-sans ${
                track.muted ? 'opacity-50' : 'text-on-surface-variant'
              }`}
            >
              <span className="truncate max-w-[44px]" title={track.name}>
                {track.name}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.toggleTrackMute(track.id);
                  }}
                  className={`material-symbols-outlined text-[11px] cursor-pointer font-sans ${
                    track.muted ? 'text-tertiary' : 'text-on-surface-variant/60 hover:text-white'
                  }`}
                  title={track.muted ? 'Unmute Track' : 'Mute Track'}
                >
                  {track.muted ? 'volume_off' : 'volume_up'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.toggleTrackLock(track.id);
                  }}
                  className={`material-symbols-outlined text-[11px] cursor-pointer font-sans ${
                    track.locked ? 'text-primary' : 'text-on-surface-variant/60 hover:text-white'
                  }`}
                  title={track.locked ? 'Unlock Track' : 'Lock Track'}
                >
                  {track.locked ? 'lock' : 'lock_open'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete track "${track.name}" and all of its timeline clips?`)) {
                      editorStore.deleteTrack(track.id);
                    }
                  }}
                  className="material-symbols-outlined text-[11px] text-error hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-bold font-sans"
                  title="Delete Track"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Timeline Canvas */}
        <div
          className="relative flex-1"
          style={{ width: `${maxTimelineDuration * pxPerSec}px`, minWidth: '100%' }}
        >
          {/* Ruler and Ticks */}
          <div
            ref={rulerRef}
            onClick={handleRulerInteraction}
            className="h-6 border-b border-outline-variant bg-[#131313] relative cursor-pointer"
          >
            {renderRulerTicks()}
          </div>

          {/* Track Blocks Rows Container */}
          <div className="flex flex-col relative">
            {/* Video Tracks Rows */}
            {videoTracks.map((track) => {
              const trackClips = clipsMap[track.id] || [];
              return (
                <div
                  key={track.id}
                  onDragOver={(e) => handleDragOver(e, track.id, track.locked)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleRowDrop(e, track.id, track.locked)}
                  className={`h-timeline-track-height border-b border-outline-variant flex items-center relative transition-colors duration-150 ${
                    draggedOverTrack === track.id ? 'bg-primary/10 border-y border-y-primary z-10' : ''
                  } ${track.muted ? 'opacity-45' : ''} ${track.locked ? 'bg-white/[0.02]' : ''}`}
                >
                  {trackClips.map((clip) => {
                    const isSelected = clip.id === selectedClipId;
                    const isText = clip.type === 'text';
                    const isVideo = clip.type === 'video';

                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => handleClipMouseDown(e, clip, track.locked)}
                        className={`absolute h-7 rounded px-2 flex items-center justify-between text-[9px] font-bold ${
                          isBladeMode
                            ? 'cursor-crosshair'
                            : track.locked
                            ? 'cursor-not-allowed'
                            : 'cursor-grab'
                        } ${
                          isVideo
                            ? isSelected
                              ? 'border-2 border-primary bg-surface-container-highest/80'
                              : 'border border-outline bg-surface-container-highest text-on-surface'
                            : isText
                            ? isSelected
                              ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary-container/40'
                              : 'bg-primary-container/20 border border-primary/30 text-primary'
                            : isSelected
                            ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary-container/40'
                            : clip.color ||
                              'bg-primary-container/40 border border-primary/50 text-on-primary-container'
                        }`}
                        style={{
                          left: `${clip.startTime * pxPerSec}px`,
                          width: `${Math.max(12, clip.duration * pxPerSec)}px`,
                        }}
                      >
                        {/* Trim handles */}
                        {isSelected && !isBladeMode && !track.locked && (
                          <>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'left', track.locked)}
                              className="absolute left-0 top-0 bottom-0 w-2.5 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-l"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'right', track.locked)}
                              className="absolute right-0 top-0 bottom-0 w-2.5 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-r"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                          </>
                        )}

                        <span className="truncate pr-4 uppercase">
                          {isText ? `Text: "${clip.text}"` : clip.name}
                        </span>

                        {!track.locked && (
                          <span
                            onClick={(e) => handleClipDelete(e, clip.id, track.locked)}
                            className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold font-sans z-50 pl-1"
                          >
                            close
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* SPACER CHANNEL */}
            <div className="h-2 bg-surface-container-highest flex-shrink-0"></div>

            {/* Audio Tracks Rows */}
            {audioTracks.map((track) => {
              const trackClips = clipsMap[track.id] || [];
              return (
                <div
                  key={track.id}
                  onDragOver={(e) => handleDragOver(e, track.id, track.locked)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleRowDrop(e, track.id, track.locked)}
                  className={`h-timeline-track-height border-b border-outline-variant flex items-center relative transition-colors duration-150 ${
                    draggedOverTrack === track.id ? 'bg-primary/10 border-y border-y-primary z-10' : ''
                  } ${track.muted ? 'opacity-45' : ''} ${track.locked ? 'bg-white/[0.02]' : ''}`}
                >
                  {trackClips.map((clip) => {
                    const isSelected = clip.id === selectedClipId;
                    const assetPeaks = clip.mediaAssetId
                      ? mediaAssets.find((a) => a.id === clip.mediaAssetId)?.analysis?.waveformPeaks
                      : undefined;
                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => handleClipMouseDown(e, clip, track.locked)}
                        className={`absolute h-7 rounded px-2 flex flex-col justify-center text-[8px] font-bold ${
                          isBladeMode
                            ? 'cursor-crosshair'
                            : track.locked
                            ? 'cursor-not-allowed'
                            : 'cursor-grab'
                        } ${
                          isSelected
                            ? 'border-2 border-primary bg-secondary-container/40'
                            : clip.color ||
                              'bg-secondary-container/30 border border-secondary/40 text-secondary'
                        }`}
                        style={{
                          left: `${clip.startTime * pxPerSec}px`,
                          width: `${Math.max(12, clip.duration * pxPerSec)}px`,
                        }}
                      >
                        {/* Trim handles */}
                        {isSelected && !isBladeMode && !track.locked && (
                          <>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'left', track.locked)}
                              className="absolute left-0 top-0 bottom-0 w-2 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-l"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'right', track.locked)}
                              className="absolute right-0 top-0 bottom-0 w-2 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-r"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                          </>
                        )}

                        {assetPeaks && assetPeaks.length > 0 ? (
                          <div className="h-2.5 w-full mb-0.5 flex items-end gap-[1px] overflow-hidden opacity-65">
                            {assetPeaks.slice(0, 48).map((peak, pIdx) => (
                              <div
                                key={pIdx}
                                className="flex-1 bg-secondary rounded-t-[1px]"
                                style={{ height: `${Math.max(18, Math.round(peak * 100))}%` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div
                            className="h-2 w-full mb-0.5 mx-2"
                            style={{
                              background:
                                'repeating-linear-gradient(90deg, #4edea3 0px, #4edea3 2px, transparent 2px, transparent 8px)',
                              opacity: 0.3,
                            }}
                          ></div>
                        )}
                        <div className="flex justify-between items-center w-full px-2">
                          <span className="truncate uppercase">{clip.name}</span>
                          {!track.locked && (
                            <span
                              onClick={(e) => handleClipDelete(e, clip.id, track.locked)}
                              className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold font-sans z-50"
                            >
                              close
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Timeline Playhead line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-primary z-20 pointer-events-none shadow-[0_0_8px_rgba(173,198,255,0.5)]"
            style={{ left: `${playheadTime * pxPerSec}px` }}
          >
            {/* Playhead geometric knob top flag */}
            <div
              onMouseDown={handlePlayheadMouseDown}
              className="absolute -top-1 -left-[5px] w-[11px] h-[15px] bg-primary flex flex-col items-center cursor-ew-resize pointer-events-auto"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)',
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer Track info statistics */}
      <div className="flex items-center justify-between px-3 h-6 border-t border-outline-variant bg-surface text-[10px] text-on-surface-variant font-mono-data flex-shrink-0">
        <div className="flex gap-4 font-sans">
          <span>FPS: {exportConfig.fps}</span>
          <span>RES: {exportConfig.resolution}</span>
          <span>TOOL: {isBladeMode ? 'BLADE (C)' : 'SELECT (V)'}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-secondary font-bold font-sans">
            Runway: {maxTimelineDuration}s • Ready
          </span>
          <div className="w-24 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full w-full bg-secondary"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
