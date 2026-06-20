'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore, editorStore, TimelineClip } from '../../store/editorStore';

export default function PreviewMonitor() {
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const tracks = useEditorStore((state) => state.tracks);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideoClip, setActiveVideoClip] = useState<TimelineClip | null>(null);
  const [activeTextClips, setActiveTextClips] = useState<TimelineClip[]>([]);
  const [activeOverlayClips, setActiveOverlayClips] = useState<TimelineClip[]>([]);

  // Find active clips based on playhead time
  useEffect(() => {
    // 1. Video Clip (V1)
    const activeVideo = tracks.V1.find(
      (clip) => playheadTime >= clip.startTime && playheadTime < clip.startTime + clip.duration
    );
    setActiveVideoClip(activeVideo || null);

    // 2. Text Clips (V3)
    const activeTexts = tracks.V3.filter(
      (clip) => playheadTime >= clip.startTime && playheadTime < clip.startTime + clip.duration
    );
    setActiveTextClips(activeTexts);

    // 3. VFX Overlays (V2)
    const activeOverlays = tracks.V2.filter(
      (clip) => playheadTime >= clip.startTime && playheadTime < clip.startTime + clip.duration
    );
    setActiveOverlayClips(activeOverlays);
  }, [playheadTime, tracks]);

  // Synchronize HTML5 video playback with playhead
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideoClip) return;

    const targetVideoTime = playheadTime - activeVideoClip.startTime;

    // Avoid infinite seeking loops by checking threshold
    if (Math.abs(video.currentTime - targetVideoTime) > 0.15) {
      video.currentTime = Math.max(0, targetVideoTime);
    }

    if (isPlaying) {
      if (video.paused && video.readyState >= 2) {
        video.play().catch(() => {});
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [playheadTime, isPlaying, activeVideoClip]);

  // Playback timer loop
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updateTimer = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        editorStore.setPlayheadTime(playheadTime + delta);
      }
      lastTime = now;
      animFrame = requestAnimationFrame(updateTimer);
    };

    animFrame = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playheadTime]);

  const handleTogglePlay = () => {
    editorStore.setPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = scrubberContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const percent = clickX / rect.width;
    const totalDuration = 30; // standard 30s timeline limit
    const targetTime = percent * totalDuration;
    editorStore.setPlayheadTime(targetTime);
  };

  // Convert playhead time to frames (23.976 fps)
  const formatTimecode = (timeInSecs: number) => {
    const fps = 23.976;
    const hours = Math.floor(timeInSecs / 3600);
    const mins = Math.floor((timeInSecs % 3600) / 60);
    const secs = Math.floor(timeInSecs % 60);
    const frames = Math.floor((timeInSecs % 1) * fps);

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <section className="flex-grow flex-shrink flex flex-col bg-surface-container-lowest relative select-none">
      
      {/* Preview Toolbar */}
      <div className="flex justify-between items-center p-2 border-b border-outline-variant bg-surface flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-mono-data text-label-caps text-on-surface-variant">
            {formatTimecode(playheadTime)}
          </span>
          <div className="h-4 w-px bg-outline-variant"></div>
          <span className="font-mono-data text-label-caps text-primary cursor-pointer hover:text-white">FIT</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="material-symbols-outlined text-on-surface-variant text-sm p-1 hover:bg-surface-container-high rounded cursor-pointer block">
            high_quality
          </button>
          <button className="material-symbols-outlined text-on-surface-variant text-sm p-1 hover:bg-surface-container-high rounded cursor-pointer block">
            grid_view
          </button>
        </div>
      </div>

      {/* Monitor Display Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 relative min-h-0 bg-[#0e0e0e]">
        <div className="relative w-full h-full max-w-4xl shadow-2xl overflow-hidden rounded bg-black flex items-center justify-center aspect-video">
          
          {/* Active Video Player */}
          {activeVideoClip ? (
            <video
              ref={videoRef}
              src={activeVideoClip.assetUrl}
              muted
              playsInline
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter: activeVideoClip.appliedEffects?.includes('Chromatic Aberration') 
                  ? 'hue-rotate(30deg) saturate(1.2)' 
                  : undefined,
                transform: `scale(${activeVideoClip.scale ? activeVideoClip.scale / 100 : 1}) translate(${activeVideoClip.positionX || 0}px, ${activeVideoClip.positionY || 0}px) rotate(${activeVideoClip.rotation || 0}deg)`,
                opacity: activeVideoClip.opacity ? activeVideoClip.opacity / 100 : 1,
              }}
            />
          ) : (
            <div className="text-on-surface-variant text-xs flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-3xl opacity-40">movie_creation</span>
              <span className="opacity-50">Empty Timeline Segment</span>
            </div>
          )}

          {/* Active Overlay Effect Filters (V2) */}
          {activeOverlayClips.map((overlay) => (
            <div
              key={overlay.id}
              className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/15"
              style={{
                opacity: overlay.opacity ? overlay.opacity / 100 : 0.4,
              }}
            />
          ))}

          {/* Active Text Clips Overlays (V3) */}
          {activeTextClips.map((textClip) => (
            <div
              key={textClip.id}
              className={`absolute pointer-events-none transition-all ${
                textClip.id === selectedClipId ? 'outline outline-dashed outline-primary/60 outline-offset-4' : ''
              }`}
              style={{
                left: `calc(50% + ${textClip.positionX || 0}px)`,
                top: `calc(50% + ${textClip.positionY || 0}px)`,
                transform: `translate(-50%, -50%) scale(${textClip.scale ? textClip.scale / 100 : 1}) rotate(${textClip.rotation || 0}deg)`,
                opacity: textClip.opacity ? textClip.opacity / 100 : 1,
              }}
            >
              <div className={textClip.color || 'text-white text-lg font-bold drop-shadow-md text-center'}>
                {textClip.text}
              </div>
            </div>
          ))}

          {/* Playback click-to-toggle overlay */}
          <div 
            onClick={handleTogglePlay}
            className="absolute inset-0 bg-transparent flex items-center justify-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined text-4xl block font-bold">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playback controls & Track slider */}
      <div className="p-3 bg-surface border-t border-outline-variant flex flex-col gap-2 flex-shrink-0">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={() => editorStore.setPlayheadTime(0)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block"
            title="Go to start"
          >
            skip_previous
          </button>
          
          <button 
            onClick={() => editorStore.setPlayheadTime(playheadTime - 5)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block"
            title="Rewind 5s"
          >
            fast_rewind
          </button>
          
          <button 
            onClick={handleTogglePlay}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined text-2xl block font-bold">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
          
          <button 
            onClick={() => editorStore.setPlayheadTime(playheadTime + 5)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block"
            title="Forward 5s"
          >
            fast_forward
          </button>
          
          <button 
            onClick={() => editorStore.setPlayheadTime(28)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block"
            title="Go to end"
          >
            skip_next
          </button>
        </div>
        
        {/* Scrubber slider track */}
        <div 
          ref={scrubberContainerRef}
          onClick={handleSeek}
          className="h-1.5 w-full bg-surface-container-highest rounded-full relative cursor-pointer group"
        >
          <div 
            className="absolute h-full bg-primary rounded-full"
            style={{ width: `${(playheadTime / 30) * 100}%` }}
          ></div>
          <div 
            className="absolute h-3.5 w-3.5 bg-white rounded-full -top-1 shadow-md border-2 border-primary -translate-x-1/2 group-hover:scale-110 transition-transform pointer-events-none"
            style={{ left: `${(playheadTime / 30) * 100}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
}
