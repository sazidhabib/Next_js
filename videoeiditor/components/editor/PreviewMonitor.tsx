'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore, editorStore, TimelineClip } from '../../store/editorStore';

export default function PreviewMonitor() {
  const playheadTime = useEditorStore((state) => state.playheadTime);
  const isPlaying = useEditorStore((state) => state.isPlaying);
  const selectedClipId = useEditorStore((state) => state.selectedClipId);
  const tracks = useEditorStore((state) => state.tracks);
  const clipsMap = useEditorStore((state) => state.clips);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideoClip, setActiveVideoClip] = useState<TimelineClip | null>(null);
  const [activeTextClips, setActiveTextClips] = useState<TimelineClip[]>([]);
  const [activeOverlayClips, setActiveOverlayClips] = useState<TimelineClip[]>([]);

  // Keep references to HTML5 audio objects for timeline syncing
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  // Find active clips based on playhead time
  useEffect(() => {
    let videoClip: TimelineClip | null = null;
    let textClips: TimelineClip[] = [];
    let overlayClips: TimelineClip[] = [];

    const videoTrackIds = tracks.filter((t) => t.type === 'video').map((t) => t.id);

    videoTrackIds.forEach((trackId) => {
      const trackClips = clipsMap[trackId] || [];
      const active = trackClips.filter(
        (clip) => playheadTime >= clip.startTime && playheadTime < clip.startTime + clip.duration
      );

      active.forEach((clip) => {
        if (clip.type === 'video') {
          if (!videoClip) {
            videoClip = clip;
          }
        } else if (clip.type === 'text') {
          textClips.push(clip);
        } else if (clip.type === 'overlay') {
          overlayClips.push(clip);
        }
      });
    });

    setActiveVideoClip(videoClip);
    setActiveTextClips(textClips);
    setActiveOverlayClips(overlayClips);
  }, [playheadTime, tracks, clipsMap]);

  // Synchronize state values to refs to make the 60fps timer loop dependency-free and avoid stuttering seeking triggers
  const isPlayingRef = useRef(isPlaying);
  const playheadTimeRef = useRef(playheadTime);
  const activeVideoClipRef = useRef(activeVideoClip);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    playheadTimeRef.current = playheadTime;
    activeVideoClipRef.current = activeVideoClip;
  }, [isPlaying, playheadTime, activeVideoClip]);

  // Synchronize HTML5 video playback, volume and timecode with playhead
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeVideoClip) return;

    // Sync volume level (convert 0-100 range to 0.0-1.0 float)
    video.volume = (activeVideoClip.volume ?? 100) / 100;
    video.muted = false;

    const targetVideoTime = playheadTime - activeVideoClip.startTime;

    if (!isPlaying) {
      // While paused or scrubbing, seek to target time
      if (Math.abs(video.currentTime - targetVideoTime) > 0.1) {
        video.currentTime = Math.max(0, targetVideoTime);
      }
      if (!video.paused) {
        video.pause();
      }
    } else {
      // If playing, ensure it is playing, but do NOT seek (seeking stutters playback)
      if (video.paused && video.readyState >= 2) {
        // Sync timecode once before triggering play
        if (Math.abs(video.currentTime - targetVideoTime) > 0.15) {
          video.currentTime = Math.max(0, targetVideoTime);
        }
        video.play().catch(() => {});
      }
    }
  }, [playheadTime, isPlaying, activeVideoClip]);

  // Synchronize dynamic timeline audio tracks (A1 & A2)
  useEffect(() => {
    const audioTrackIds = tracks.filter((t) => t.type === 'audio').map((t) => t.id);
    const activeAudios: TimelineClip[] = [];

    audioTrackIds.forEach((trackId) => {
      const trackClips = clipsMap[trackId] || [];
      const active = trackClips.filter(
        (clip) => playheadTime >= clip.startTime && playheadTime < clip.startTime + clip.duration
      );
      activeAudios.push(...active);
    });

    // 1. Pause and destroy any audio elements that are no longer active
    const activeIds = new Set(activeAudios.map((c) => c.id));
    Object.keys(audioElementsRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        const audio = audioElementsRef.current[id];
        audio.pause();
        delete audioElementsRef.current[id];
      }
    });

    // 2. Synchronize active audios
    activeAudios.forEach((clip) => {
      if (!clip.assetUrl) return; // skip mock clips with no url

      let audio = audioElementsRef.current[clip.id];
      if (!audio) {
        audio = new Audio(clip.assetUrl);
        audioElementsRef.current[clip.id] = audio;
      }

      // Sync volume
      const volumeLevel = (clip.volume ?? 100) / 100;
      if (audio.volume !== volumeLevel) {
        audio.volume = volumeLevel;
      }

      const targetTime = playheadTime - clip.startTime;

      if (!isPlaying) {
        // While paused or scrubbing, seek to target time
        if (Math.abs(audio.currentTime - targetTime) > 0.1) {
          audio.currentTime = Math.max(0, targetTime);
        }
        if (!audio.paused) {
          audio.pause();
        }
      } else {
        if (audio.paused) {
          // Sync timecode once before starting audio playback
          audio.currentTime = Math.max(0, targetTime);
          audio.play().catch(() => {});
        } else {
          // While playing natively, check if there is a drift (> 0.4s) before seeking
          if (Math.abs(audio.currentTime - targetTime) > 0.4) {
            audio.currentTime = Math.max(0, targetTime);
          }
        }
      }
    });
  }, [playheadTime, isPlaying, tracks, clipsMap]);

  // Clean up all audios on component unmount to prevent resource leak
  useEffect(() => {
    return () => {
      Object.values(audioElementsRef.current).forEach((audio) => {
        audio.pause();
      });
      audioElementsRef.current = {};
    };
  }, []);

  // Continuous 60fps Playback timer loop running exactly once on mount
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const updateTimer = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingRef.current) {
        const video = videoRef.current;
        const activeClip = activeVideoClipRef.current;

        if (video && activeClip && !video.paused && video.readyState >= 2) {
          // Master Clock Sync: read native video currentTime to progress playhead smoothly
          const videoPlayhead = activeClip.startTime + video.currentTime;
          editorStore.setPlayheadTime(videoPlayhead);
        } else {
          // Delta fallback if no video is playing
          editorStore.setPlayheadTime(playheadTimeRef.current + delta);
        }
      }

      animFrame = requestAnimationFrame(updateTimer);
    };

    animFrame = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animFrame);
  }, []);

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

  // Get CSS filters mapping for visual effects
  const getVideoFilters = (clip: TimelineClip) => {
    const filters = [];
    if (clip.appliedEffects?.includes('Chromatic Aberration')) {
      filters.push('hue-rotate(15deg) saturate(1.25) contrast(1.1)');
    }
    if (clip.appliedEffects?.includes('Emerald Forest')) {
      filters.push('hue-rotate(-25deg) saturate(0.7) sepia(0.2) contrast(1.15) brightness(0.95)');
    }
    if (clip.appliedEffects?.includes('Vintage 35mm')) {
      filters.push('sepia(0.35) contrast(1.2) saturate(0.85) brightness(0.95)');
    }
    if (clip.appliedEffects?.includes('VHS Overdrive')) {
      filters.push('saturate(1.4) contrast(1.3) brightness(1.1)');
    }
    return filters.length > 0 ? filters.join(' ') : undefined;
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
          <button className="material-symbols-outlined text-on-surface-variant text-sm p-1 hover:bg-surface-container-high rounded cursor-pointer block font-sans">
            high_quality
          </button>
          <button className="material-symbols-outlined text-on-surface-variant text-sm p-1 hover:bg-surface-container-high rounded cursor-pointer block font-sans">
            grid_view
          </button>
        </div>
      </div>

      {/* Monitor Display Canvas */}
      <div className="flex-grow flex-shrink flex items-center justify-center p-4 relative min-h-0 bg-[#0e0e0e]">
        <div className="relative w-full h-full max-w-4xl shadow-2xl overflow-hidden rounded bg-black flex items-center justify-center aspect-video">
          {/* Active Video Player */}
          {activeVideoClip ? (
            <video
              ref={videoRef}
              src={activeVideoClip.assetUrl}
              playsInline
              className="w-full h-full object-contain pointer-events-none"
              style={{
                filter: getVideoFilters(activeVideoClip),
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
          {activeOverlayClips.map((overlay) => {
            if (overlay.assetUrl) {
              return (
                <img
                  key={overlay.id}
                  src={overlay.assetUrl}
                  alt={overlay.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen"
                  style={{
                    opacity: overlay.opacity ? overlay.opacity / 100 : 0.4,
                    transform: `scale(${overlay.scale ? overlay.scale / 100 : 1}) translate(${overlay.positionX || 0}px, ${overlay.positionY || 0}px) rotate(${overlay.rotation || 0}deg)`,
                  }}
                />
              );
            }
            // Default mock gradient fallback if url is empty
            return (
              <div
                key={overlay.id}
                className="absolute inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/15"
                style={{
                  opacity: overlay.opacity ? overlay.opacity / 100 : 0.4,
                }}
              />
            );
          })}

          {/* VHS Overdrive Scanline & Wobble Layer */}
          {activeVideoClip && activeVideoClip.appliedEffects?.includes('VHS Overdrive') && (
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_3px_100%] animate-pulse opacity-30"></div>
          )}

          {/* Glitch Distortion Ping Layer */}
          {activeVideoClip && activeVideoClip.appliedEffects?.includes('Glitch Distortion') && (
            <div className="absolute inset-0 pointer-events-none mix-blend-difference bg-red-500/10 animate-pulse opacity-40"></div>
          )}

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
              <span className="material-symbols-outlined text-4xl block font-bold font-sans">
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
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block font-sans"
            title="Go to start"
          >
            skip_previous
          </button>

          <button
            onClick={() => editorStore.setPlayheadTime(playheadTime - 5)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block font-sans"
            title="Rewind 5s"
          >
            fast_rewind
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined text-2xl block font-bold font-sans">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => editorStore.setPlayheadTime(playheadTime + 5)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block font-sans"
            title="Forward 5s"
          >
            fast_forward
          </button>

          <button
            onClick={() => editorStore.setPlayheadTime(28)}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-xl block font-sans"
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
