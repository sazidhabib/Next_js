'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useEditorStore, editorStore, TimelineClip, EditorState } from '../../store/editorStore';

export default function Timeline() {
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const zoom = useEditorStore((state) => state.zoom);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const tracks = useEditorStore((state) => state.tracks);

  const rulerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingPlayhead, setDraggingPlayhead] = useState(false);
  
  // Track clip dragging state
  const [draggedClipId, setDraggedClipId] = useState<string | null>(null);
  const dragStartXPx = useRef(0);
  const dragStartClipTime = useRef(0);

  // Time scale calculation: pixels per second
  // zoom: 10 to 100. Let's map zoom 50 to 15 pixels/sec.
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
    };

    const handleGlobalMouseUp = () => {
      if (draggingPlayhead) setDraggingPlayhead(false);
      if (draggedClipId) setDraggedClipId(null);
    };

    if (draggingPlayhead || draggedClipId) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingPlayhead, draggedClipId, pxPerSec]);

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

  // Convert time to standard HMS timecode
  const formatTimecode = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    const frames = Math.floor((timeInSecs % 1) * 24);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  // Generate tick markers for timeline ruler
  const renderRulerTicks = () => {
    const ticks = [];
    const step = 5; // tick every 5 seconds
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
              className="material-symbols-outlined text-sm text-on-surface-variant p-1 hover:bg-surface-container-high rounded cursor-pointer block"
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
              className="material-symbols-outlined text-sm text-on-surface-variant p-1 hover:bg-surface-container-high rounded cursor-pointer block"
            >
              zoom_in
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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
          {/* Video Headers */}
          <div className="h-timeline-track-height flex items-center justify-center border-b border-outline-variant bg-surface-container-low text-[9px] font-bold text-on-surface-variant">V3 (TEXT)</div>
          <div className="h-timeline-track-height flex items-center justify-center border-b border-outline-variant bg-surface-container-low text-[9px] font-bold text-on-surface-variant">V2 (VFX)</div>
          <div className="h-timeline-track-height flex items-center justify-center border-b border-outline-variant bg-surface-container-low text-[9px] font-bold text-on-surface-variant">V1 (VID)</div>
          
          {/* Spacer */}
          <div className="h-2 bg-surface-container-highest"></div>
          
          {/* Audio Headers */}
          <div className="h-timeline-track-height flex items-center justify-center border-b border-outline-variant bg-surface-container-low text-[9px] font-bold text-on-surface-variant font-sans">A1 (VOX)</div>
          <div className="h-timeline-track-height flex items-center justify-center border-b border-outline-variant bg-surface-container-low text-[9px] font-bold text-on-surface-variant font-sans">A2 (BGM)</div>
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
            
            {/* V3 TRACK (Text Layer) */}
            <div className="h-timeline-track-height border-b border-outline-variant flex items-center relative bg-[#131313]/10">
              {tracks.V3.map((clip) => (
                <div
                  key={clip.id}
                  onMouseDown={(e) => handleClipMouseDown(e, clip)}
                  className={`absolute h-7 rounded timeline-clip overflow-hidden px-2 flex items-center justify-between cursor-grab text-[9px] font-bold font-sans ${
                    clip.id === selectedClipId 
                      ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary-container/40' 
                      : 'bg-primary-container/20 border border-primary/30 text-primary'
                  }`}
                  style={{
                    left: `${clip.startTime * pxPerSec}px`,
                    width: `${clip.duration * pxPerSec}px`,
                  }}
                >
                  <span className="truncate pr-1 uppercase">Title: &quot;{clip.text}&quot;</span>
                  <span 
                    onClick={(e) => handleClipDelete(e, clip.id)}
                    className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold"
                  >
                    close
                  </span>
                </div>
              ))}
            </div>

            {/* V2 TRACK (Visual Overlay SFX) */}
            <div className="h-timeline-track-height border-b border-outline-variant flex items-center relative">
              {tracks.V2.map((clip) => (
                <div
                  key={clip.id}
                  onMouseDown={(e) => handleClipMouseDown(e, clip)}
                  className={`absolute h-7 rounded timeline-clip overflow-hidden px-2 flex items-center justify-between cursor-grab text-[9px] font-bold ${
                    clip.id === selectedClipId
                      ? 'border-2 border-primary ring-2 ring-primary/20 bg-primary-container/40'
                      : clip.color || 'bg-primary-container/40 border border-primary/50 text-on-primary-container'
                  }`}
                  style={{
                    left: `${clip.startTime * pxPerSec}px`,
                    width: `${clip.duration * pxPerSec}px`,
                  }}
                >
                  <span className="truncate pr-1 uppercase">{clip.name}</span>
                  <span 
                    onClick={(e) => handleClipDelete(e, clip.id)}
                    className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold"
                  >
                    close
                  </span>
                </div>
              ))}
            </div>

            {/* V1 TRACK (Video Clips) */}
            <div className="h-timeline-track-height border-b border-outline-variant flex items-center relative">
              {tracks.V1.map((clip) => (
                <div
                  key={clip.id}
                  onMouseDown={(e) => handleClipMouseDown(e, clip)}
                  className={`absolute h-7 rounded border timeline-clip overflow-hidden flex items-center cursor-grab text-[9px] font-bold ${
                    clip.id === selectedClipId
                      ? 'border-2 border-primary bg-surface-container-highest/80'
                      : 'border-outline bg-surface-container-highest text-on-surface'
                  }`}
                  style={{
                    left: `${clip.startTime * pxPerSec}px`,
                    width: `${clip.duration * pxPerSec}px`,
                  }}
                >
                  {/* Dummy thumbnail visualizer snippet */}
                  <div className="w-10 h-full bg-surface-container-lowest border-r border-outline flex-shrink-0 overflow-hidden">
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[12px] opacity-40">image</span>
                    </div>
                  </div>
                  <span className="truncate px-2 flex-grow uppercase">{clip.name}</span>
                  <div className="flex gap-1.5 pr-2 items-center flex-shrink-0">
                    {clip.appliedEffects && clip.appliedEffects.length > 0 && (
                      <span className="material-symbols-outlined text-[10px] text-primary">auto_fix_high</span>
                    )}
                    <span 
                      onClick={(e) => handleClipDelete(e, clip.id)}
                      className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold"
                    >
                      close
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SPACER CHANNEL */}
            <div className="h-2 bg-surface-container-highest"></div>

            {/* A1 TRACK (Audio Dialogue Clips) */}
            <div className="h-timeline-track-height border-b border-outline-variant flex items-center relative">
              {tracks.A1.map((clip) => (
                <div
                  key={clip.id}
                  onMouseDown={(e) => handleClipMouseDown(e, clip)}
                  className={`absolute h-7 rounded timeline-clip overflow-hidden px-2 flex flex-col justify-center cursor-grab text-[8px] font-bold ${
                    clip.id === selectedClipId
                      ? 'border-2 border-primary bg-secondary-container/40'
                      : clip.color || 'bg-secondary-container/30 border border-secondary/40 text-secondary'
                  }`}
                  style={{
                    left: `${clip.startTime * pxPerSec}px`,
                    width: `${clip.duration * pxPerSec}px`,
                  }}
                >
                  {/* Waveform pattern render helper */}
                  <div className="h-2 w-full mb-0.5" style={{ background: 'repeating-linear-gradient(90deg, #4edea3 0px, #4edea3 1px, transparent 1px, transparent 4px)', opacity: 0.4 }}></div>
                  <div className="flex justify-between items-center w-full">
                    <span className="truncate uppercase">{clip.name}</span>
                    <span 
                      onClick={(e) => handleClipDelete(e, clip.id)}
                      className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold"
                    >
                      close
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* A2 TRACK (Audio Music Soundtracks) */}
            <div className="h-timeline-track-height border-b border-outline-variant flex items-center relative">
              {tracks.A2.map((clip) => (
                <div
                  key={clip.id}
                  onMouseDown={(e) => handleClipMouseDown(e, clip)}
                  className={`absolute h-7 rounded timeline-clip overflow-hidden px-2 flex flex-col justify-center cursor-grab text-[8px] font-bold ${
                    clip.id === selectedClipId
                      ? 'border-2 border-primary bg-secondary-container/30'
                      : clip.color || 'bg-secondary-container/10 border border-secondary/20 text-secondary'
                  }`}
                  style={{
                    left: `${clip.startTime * pxPerSec}px`,
                    width: `${clip.duration * pxPerSec}px`,
                  }}
                >
                  <div className="h-2 w-full mb-0.5" style={{ background: 'repeating-linear-gradient(90deg, #4edea3 0px, #4edea3 2px, transparent 2px, transparent 8px)', opacity: 0.3 }}></div>
                  <div className="flex justify-between items-center w-full">
                    <span className="truncate uppercase">{clip.name}</span>
                    <span 
                      onClick={(e) => handleClipDelete(e, clip.id)}
                      className="material-symbols-outlined text-[10px] hover:text-white cursor-pointer block font-bold"
                    >
                      close
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 60%, 50% 100%, 0% 60%)'
              }}
            ></div>
          </div>

        </div>
      </div>
      
      {/* Footer Track info statistics */}
      <div className="flex items-center justify-between px-3 h-6 border-t border-outline-variant bg-surface text-[10px] text-on-surface-variant font-mono-data flex-shrink-0">
        <div className="flex gap-4">
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
