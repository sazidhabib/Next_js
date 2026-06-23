'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore, editorStore, TimelineClip, EditorState } from '../../store/editorStore';

export default function Timeline() {
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const zoom = useEditorStore((state) => state.zoom);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const tracks = useEditorStore((state) => state.tracks);
  const clipsMap = useEditorStore((state) => state.clips);

  const rulerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);

  // Clip Drag-Move State
  const [draggedClipId, setDraggedClipId] = useState<string | null>(null);
  const dragStartXPx = useRef(0);
  const dragStartClipTime = useRef(0);

  // Clip Resize/Trim State
  const [resizedClipId, setResizedClipId] = useState<string | null>(null);
  const resizeStartXPx = useRef(0);
  const resizeStartClipTime = useRef(0);
  const resizeStartClipDuration = useRef(0);
  const resizeDirection = useRef<'left' | 'right'>('right');

  // Drag over highlights for Drag-and-Drop
  const [draggedOverTrack, setDraggedOverTrack] = useState<string | null>(null);

  // Time scale calculation: pixels per second
  const pxPerSec = (zoom / 50) * 15;
  const maxTimelineDuration = 30; // seconds

  const handleRulerInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left + (canvasRef.current?.scrollLeft || 0);
    const targetTime = Math.max(0, Math.min(maxTimelineDuration, clickX / pxPerSec));
    editorStore.setPlayheadTime(targetTime);
  };

  const handlePlayheadMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingPlayhead(true);
  };

  const handleResizeStart = (e: React.MouseEvent, clip: TimelineClip, direction: 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    setResizedClipId(clip.id);
    resizeDirection.current = direction;
    resizeStartXPx.current = e.clientX;
    resizeStartClipTime.current = clip.startTime;
    resizeStartClipDuration.current = clip.duration;
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingPlayhead) {
        const rect = rulerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const offsetLeft = e.clientX - rect.left + (canvasRef.current?.scrollLeft || 0);
        const targetTime = Math.max(0, Math.min(maxTimelineDuration, offsetLeft / pxPerSec));
        editorStore.setPlayheadTime(targetTime);
      }

      if (draggedClipId) {
        const deltaPx = e.clientX - dragStartXPx.current;
        const deltaTime = deltaPx / pxPerSec;
        const targetTime = Math.max(0, Math.min(maxTimelineDuration, dragStartClipTime.current + deltaTime));
        editorStore.updateClip(draggedClipId, { startTime: parseFloat(targetTime.toFixed(1)) });
      }

      if (resizedClipId) {
        const deltaPx = e.clientX - resizeStartXPx.current;
        const deltaTime = deltaPx / pxPerSec;

        if (resizeDirection.current === 'right') {
          const newDuration = Math.max(0.5, resizeStartClipDuration.current + deltaTime);
          editorStore.updateClip(resizedClipId, { duration: parseFloat(newDuration.toFixed(1)) });
        } else {
          const potentialStartTime = resizeStartClipTime.current + deltaTime;
          const actualStartTime = Math.max(0, potentialStartTime);
          const deltaApplied = actualStartTime - resizeStartClipTime.current;
          const newDuration = Math.max(0.5, resizeStartClipDuration.current - deltaApplied);

          editorStore.updateClip(resizedClipId, {
            startTime: parseFloat(actualStartTime.toFixed(1)),
            duration: parseFloat(newDuration.toFixed(1)),
          });
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (draggingPlayhead) setDraggingPlayhead(false);
      if (draggedClipId) setDraggedClipId(null);
      if (resizedClipId) setResizedClipId(null);
    };

    if (draggingPlayhead || draggedClipId || resizedClipId) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingPlayhead, draggedClipId, resizedClipId, pxPerSec]);

  const handleClipMouseDown = (e: React.MouseEvent, clip: TimelineClip) => {
    e.stopPropagation();
    editorStore.setSelectedClipId(clip.id);
    setDraggedClipId(clip.id);
    dragStartXPx.current = e.clientX;
    dragStartClipTime.current = clip.startTime;
  };

  const handleClipDelete = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    editorStore.deleteClip(clipId);
  };

  const handleDragOver = (e: React.DragEvent, trackId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (draggedOverTrack !== trackId) {
      setDraggedOverTrack(trackId);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverTrack(null);
  };

  const handleRowDrop = (e: React.DragEvent, trackId: string) => {
    e.preventDefault();
    setDraggedOverTrack(null);
    try {
      const assetData = e.dataTransfer.getData('application/json');
      if (!assetData) return;
      const asset = JSON.parse(assetData);

      // Calculate timeline offset dropped at
      const rect = e.currentTarget.getBoundingClientRect();
      const dropXPx = e.clientX - rect.left + (canvasRef.current?.scrollLeft || 0);
      const startTime = Math.max(0, parseFloat((dropXPx / pxPerSec).toFixed(1)));

      editorStore.addClipToTrack(trackId, asset, startTime);
    } catch (err) {
      console.error('Failed to drop asset:', err);
    }
  };

  const formatTimecode = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    const frames = Math.floor((timeInSecs % 1) * 24);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const renderRulerTicks = () => {
    const ticks = [];
    const step = 5;
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

  // Filter video and audio tracks dynamically
  const videoTracks = tracks.filter((t) => t.type === 'video');
  const audioTracks = tracks.filter((t) => t.type === 'audio');

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
            >
              zoom_in
            </button>
          </div>
        </div>

        {/* Dynamic add track triggers & original magnet controls */}
        <div className="flex items-center gap-2">
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

          <button className="material-symbols-outlined text-sm text-primary p-1 bg-primary/10 rounded cursor-pointer block" title="Snap Magnet Active">
            magnet
          </button>
          <button className="material-symbols-outlined text-sm text-on-surface-variant p-1 hover:bg-surface-container-high rounded cursor-pointer block" title="Link clips">
            link
          </button>
          <button className="material-symbols-outlined text-sm text-on-surface-variant p-1 hover:bg-surface-container-high rounded cursor-pointer block" title="Toggle audio waveforms">
            layers
          </button>
        </div>
      </div>

      {/* Tracks Board area */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto custom-scrollbar relative flex bg-[#121212]"
      >
        {/* Sticky Sidebar Track Headers */}
        <div className="w-16 border-r border-outline-variant bg-surface sticky left-0 z-30 flex flex-col flex-shrink-0">
          {/* Ruler Spacer to align headers with tracks */}
          <div className="h-6 border-b border-outline-variant bg-[#131313] flex-shrink-0"></div>

          {/* Video Headers */}
          {videoTracks.map((track) => (
            <div
              key={track.id}
              className="h-timeline-track-height flex items-center justify-between px-1.5 border-b border-outline-variant bg-surface-container-low text-[8px] font-bold text-on-surface-variant relative group"
            >
              <span>{track.name}</span>
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
          ))}

          {/* Spacer */}
          <div className="h-2 bg-surface-container-highest flex-shrink-0"></div>

          {/* Audio Headers */}
          {audioTracks.map((track) => (
            <div
              key={track.id}
              className="h-timeline-track-height flex items-center justify-between px-1.5 border-b border-outline-variant bg-surface-container-low text-[8px] font-bold text-on-surface-variant relative group font-sans"
            >
              <span>{track.name}</span>
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
                  onDragOver={(e) => handleDragOver(e, track.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleRowDrop(e, track.id)}
                  className={`h-timeline-track-height border-b border-outline-variant flex items-center relative transition-colors duration-150 ${
                    draggedOverTrack === track.id ? 'bg-primary/10 border-y border-y-primary z-10' : ''
                  }`}
                >
                  {trackClips.map((clip) => {
                    const isSelected = clip.id === selectedClipId;
                    const isText = clip.type === 'text';
                    const isVideo = clip.type === 'video';

                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => handleClipMouseDown(e, clip)}
                        className={`absolute h-7 rounded px-2 flex items-center justify-between cursor-grab text-[9px] font-bold ${
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
                            : clip.color || 'bg-primary-container/40 border border-primary/50 text-on-primary-container'
                        }`}
                        style={{
                          left: `${clip.startTime * pxPerSec}px`,
                          width: `${clip.duration * pxPerSec}px`,
                        }}
                      >
                        {/* Trim handles */}
                        {isSelected && (
                          <>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'left')}
                              className="absolute left-0 top-0 bottom-0 w-2.5 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-l"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'right')}
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

                        <span
                          onClick={(e) => handleClipDelete(e, clip.id)}
                          className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold font-sans z-50 pl-1"
                        >
                          close
                        </span>
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
                  onDragOver={(e) => handleDragOver(e, track.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleRowDrop(e, track.id)}
                  className={`h-timeline-track-height border-b border-outline-variant flex items-center relative transition-colors duration-150 ${
                    draggedOverTrack === track.id ? 'bg-primary/10 border-y border-y-primary z-10' : ''
                  }`}
                >
                  {trackClips.map((clip) => {
                    const isSelected = clip.id === selectedClipId;
                    return (
                      <div
                        key={clip.id}
                        onMouseDown={(e) => handleClipMouseDown(e, clip)}
                        className={`absolute h-7 rounded px-2 flex flex-col justify-center cursor-grab text-[8px] font-bold ${
                          isSelected
                            ? 'border-2 border-primary bg-secondary-container/40'
                            : clip.color || 'bg-secondary-container/30 border border-secondary/40 text-secondary'
                        }`}
                        style={{
                          left: `${clip.startTime * pxPerSec}px`,
                          width: `${clip.duration * pxPerSec}px`,
                        }}
                      >
                        {/* Trim handles */}
                        {isSelected && (
                          <>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'left')}
                              className="absolute left-0 top-0 bottom-0 w-2 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-l"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                            <div
                              onMouseDown={(e) => handleResizeStart(e, clip, 'right')}
                              className="absolute right-0 top-0 bottom-0 w-2 bg-primary hover:bg-white cursor-ew-resize z-40 flex items-center justify-center rounded-r"
                              style={{ pointerEvents: 'auto' }}
                            >
                              <div className="w-[1px] h-3 bg-on-primary"></div>
                            </div>
                          </>
                        )}

                        <div
                          className="h-2 w-full mb-0.5 mx-2"
                          style={{
                            background:
                              'repeating-linear-gradient(90deg, #4edea3 0px, #4edea3 2px, transparent 2px, transparent 8px)',
                            opacity: 0.3,
                          }}
                        ></div>
                        <div className="flex justify-between items-center w-full px-2">
                          <span className="truncate uppercase">{clip.name}</span>
                          <span
                            onClick={(e) => handleClipDelete(e, clip.id)}
                            className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold font-sans z-50"
                          >
                            close
                          </span>
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
          <span>FPS: 23.976</span>
          <span>RES: 3840 x 2160</span>
          <span>BITRATE: 120 Mbps</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-secondary font-bold font-sans">Rendering: 100% Ready</span>
          <div className="w-24 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full w-full bg-secondary"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
