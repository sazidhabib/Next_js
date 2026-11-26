'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useEditorStore, editorStore } from '../../store/editorStore';
import type { AspectRatio } from '../../lib/timeline/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FfmpegHealthInfo {
  available: boolean;
  ffmpegSource?: string;
  version?: string;
  error?: string;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const exportingState = useEditorStore((state) => state.exportingState);
  const exportProgress = useEditorStore((state) => state.exportProgress);
  const exportStage = useEditorStore((state) => state.exportStage);
  const exportJobId = useEditorStore((state) => state.exportJobId);
  const exportError = useEditorStore((state) => state.exportError);
  const exportFileSizeBytes = useEditorStore((state) => state.exportFileSizeBytes);
  const exportOutputFileName = useEditorStore((state) => state.exportOutputFileName);
  const exportConfig = useEditorStore((state) => state.exportConfig);
  const tracks = useEditorStore((state) => state.tracks);
  const clipsMap = useEditorStore((state) => state.clips);

  const [fileName, setFileName] = useState(exportConfig.fileName);
  const [format, setFormat] = useState(exportConfig.format);
  const [resolution, setResolution] = useState(exportConfig.resolution);
  const [fps, setFps] = useState(exportConfig.fps);
  const [quality, setQuality] = useState(exportConfig.quality);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(exportConfig.aspectRatio || '16:9');
  const [autoDuckBgm, setAutoDuckBgm] = useState(
    exportConfig.audioMastering?.autoDuckBgm ?? true
  );
  const [normalizeLufs, setNormalizeLufs] = useState(
    exportConfig.audioMastering?.normalizeLufs ?? true
  );
  const [targetLufs, setTargetLufs] = useState(exportConfig.audioMastering?.targetLufs ?? -14);
  const [uploadYouTube, setUploadYouTube] = useState(true);
  const [uploadInstagram, setUploadInstagram] = useState(false);
  const [ffmpegHealth, setFfmpegHealth] = useState<FfmpegHealthInfo | null>(null);

  // Sync back local states to store when changed
  useEffect(() => {
    editorStore.updateExportConfig({
      fileName,
      format,
      resolution,
      fps,
      quality,
      aspectRatio,
      audioMastering: {
        normalizeLufs,
        targetLufs,
        autoDuckBgm,
      },
    });
  }, [fileName, format, resolution, fps, quality, aspectRatio, normalizeLufs, targetLufs, autoDuckBgm]);

  // Check local/server FFmpeg readiness when opened
  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    fetch('/api/render')
      .then((res) => res.json())
      .then((data: FfmpegHealthInfo) => {
        if (active) setFfmpegHealth(data);
      })
      .catch(() => {
        if (active) setFfmpegHealth({ available: false, error: 'Unable to reach render server' });
      });
    return () => {
      active = false;
    };
  }, [isOpen]);

  // Real timeline duration from unmuted tracks
  const durationSec = useMemo(() => {
    let maxEnd = 0;
    for (const track of tracks) {
      if (track.muted) continue;
      for (const clip of clipsMap[track.id] || []) {
        const end = clip.startTime + clip.duration;
        if (end > maxEnd) maxEnd = end;
      }
    }
    return Math.max(1, Math.round(maxEnd));
  }, [tracks, clipsMap]);

  const formattedDuration = `${Math.floor(durationSec / 60)
    .toString()
    .padStart(2, '0')}:${(durationSec % 60).toString().padStart(2, '0')}`;

  const isProRes = format.includes('ProRes');
  const sizeMultMb = isProRes ? 0.14 : 0.025;
  const estimatedMb = (quality * durationSec * sizeMultMb).toFixed(1);
  const displayFileSize =
    exportFileSizeBytes && exportFileSizeBytes > 0
      ? `${(exportFileSizeBytes / (1024 * 1024)).toFixed(2)} MB`
      : `~${estimatedMb} MB`;
  const renderTimeSec = Math.max(2, Math.round((quality / 100) * durationSec * 0.6));

  const handleStartExport = () => {
    void editorStore.startExport();
  };

  const handleDownload = () => {
    if (!exportJobId) return;
    const link = document.createElement('a');
    link.href = `/api/render/${encodeURIComponent(exportJobId)}/download`;
    link.download = exportOutputFileName || `${fileName}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancelOrReset = () => {
    editorStore.resetExport();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Modal Container */}
      <div className="w-full max-w-5xl h-[640px] bento-card rounded-xl overflow-hidden flex flex-col shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="h-12 border-b border-outline-variant px-6 flex items-center justify-between bg-surface-container-high">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] block">
              movie_edit
            </span>
            <h2 className="font-headline-md text-headline-md font-bold">Export Media</h2>
            {ffmpegHealth && (
              <span
                className={`text-[10px] font-mono-data px-2 py-0.5 rounded border ${
                  ffmpegHealth.available
                    ? 'bg-secondary/10 border-secondary/30 text-secondary'
                    : 'bg-error/10 border-error/30 text-error'
                }`}
                title={ffmpegHealth.version || ffmpegHealth.error}
              >
                {ffmpegHealth.available
                  ? `FFmpeg Ready (${ffmpegHealth.ffmpegSource || 'local'})`
                  : 'FFmpeg Unavailable'}
              </span>
            )}
          </div>
          <button
            onClick={handleCancelOrReset}
            className="material-symbols-outlined text-on-surface-variant hover:text-white transition-colors cursor-pointer block"
          >
            close
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Settings */}
          <div className="flex-[1.2] p-8 border-r border-outline-variant overflow-y-auto custom-scrollbar bg-surface-container-low">
            <div className="space-y-6">
              {/* File Identity */}
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-3 uppercase tracking-widest font-bold">
                  General Settings
                </label>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-outline font-medium">File Name</span>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      disabled={exportingState === 'exporting'}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-outline font-medium">Render Engine</span>
                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-mono-data text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-secondary block">
                        terminal
                      </span>
                      <span className="truncate">
                        Local Server FFmpeg ({ffmpegHealth?.version?.split(' ').slice(0, 3).join(' ') || 'Checking...'})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Configuration */}
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-3 uppercase tracking-widest font-bold">
                  Video Configuration
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-outline font-medium">Format</span>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      disabled={exportingState === 'exporting'}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface appearance-none cursor-pointer"
                    >
                      <option>MP4 (H.264)</option>
                      <option>MOV (ProRes 422)</option>
                      <option>GIF (Animated)</option>
                      <option>WebM (VP9)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-outline font-medium">Resolution</span>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      disabled={exportingState === 'exporting'}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface appearance-none cursor-pointer"
                    >
                      <option>4K (3840 x 2160)</option>
                      <option>1080p (1920 x 1080)</option>
                      <option>720p (1280 x 720)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-outline font-medium">Frame Rate</span>
                    <select
                      value={fps}
                      onChange={(e) => setFps(e.target.value)}
                      disabled={exportingState === 'exporting'}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface appearance-none cursor-pointer"
                    >
                      <option>23.976 fps</option>
                      <option>24.00 fps</option>
                      <option>30.00 fps</option>
                      <option>60.00 fps</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-outline font-medium">Aspect Ratio</span>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                      disabled={exportingState === 'exporting'}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary outline-none text-on-surface appearance-none cursor-pointer"
                    >
                      <option value="16:9">16:9 Wide (YouTube)</option>
                      <option value="9:16">9:16 Vertical (Reels / Shorts)</option>
                      <option value="1:1">1:1 Square (Feed)</option>
                      <option value="4:5">4:5 Portrait (Instagram)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Studio Audio Mastering */}
              <div className="space-y-3 pt-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-widest font-bold">
                  Studio Audio Mastering
                </label>
                <div className="grid grid-cols-1 gap-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg p-3">
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-on-surface">Auto-Duck BGM under Speech (Sidechain)</span>
                    <input
                      type="checkbox"
                      checked={autoDuckBgm}
                      onChange={(e) => setAutoDuckBgm(e.target.checked)}
                      disabled={exportingState === 'exporting'}
                      className="accent-secondary w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={normalizeLufs}
                        onChange={(e) => setNormalizeLufs(e.target.checked)}
                        disabled={exportingState === 'exporting'}
                        className="accent-secondary w-4 h-4 cursor-pointer"
                      />
                      <span className="text-on-surface">Loudness Normalize (EBU R128)</span>
                    </label>
                    <select
                      value={targetLufs}
                      onChange={(e) => setTargetLufs(Number(e.target.value))}
                      disabled={!normalizeLufs || exportingState === 'exporting'}
                      className="bg-surface-container border border-outline-variant rounded px-2 py-0.5 text-[11px] font-mono-data text-secondary outline-none"
                    >
                      <option value={-14}>-14 LUFS (YouTube/TikTok)</option>
                      <option value={-16}>-16 LUFS (Podcast)</option>
                      <option value={-23}>-23 LUFS (Broadcast)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Encoding Quality */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-bold">
                    Encoding Quality
                  </label>
                  <span className="font-mono-data text-primary text-sm font-semibold">
                    {quality}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    disabled={exportingState === 'exporting'}
                    className="w-full h-1 cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-1 text-[9px] text-outline font-label-caps uppercase">
                    <span>Low Bitrate</span>
                    <span>Lossless</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview & Output info */}
          <div className="flex-1 p-8 bg-surface flex flex-col gap-6">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-3 uppercase tracking-widest font-bold">
                Preview Frame
              </label>
              <div className="aspect-video w-full rounded-lg bg-surface-container-lowest border border-outline-variant overflow-hidden relative group">
                <img
                  className="w-full h-full object-cover"
                  alt="Preview Frame"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv8Rm8riaVej7FueS8XzM6nRHGD6WXlcIgXp5sEmj70GoCzkvuh7GY1qc6owC2a6-1XdoM41rmvo8S0VvztrJpRBgPG5hhxXYnXeG_TRWFsy30_M9aDX34NYMMrZlmYjQHTIKUaIWA2p2JFpN033TCanlUmyag1GAc-IoWBT10VJdIOqP4sFhSjJibp1tYccqG_oA-3g_dU6MdI4qCtvc6pUpWFDVl9uCt7Nxesg_9iBH8d_wh7fCoHWkwp94fqzXUTo_aBVqmtceI"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded text-white font-mono-data text-[10px] backdrop-blur-md">
                  {formattedDuration}
                </div>
              </div>
            </div>

            {/* Estimated Output parameters */}
            <div className="space-y-4 bg-surface-container-high p-4 rounded-xl border border-outline-variant">
              <h4 className="font-label-caps text-label-caps text-primary uppercase font-bold">
                {exportingState === 'completed' ? 'Rendered Output' : 'Estimated Output'}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">File Size</span>
                  <span className="font-semibold text-sm text-on-surface">{displayFileSize}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">Duration</span>
                  <span className="font-semibold text-sm text-on-surface">{formattedDuration}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">Resolution</span>
                  <span className="font-semibold text-sm text-on-surface truncate">
                    {resolution.split(' ')[0]}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">Render Est.</span>
                  <span className="font-semibold text-sm text-on-surface">~{renderTimeSec}s</span>
                </div>
              </div>
            </div>

            {/* Error display */}
            {exportError && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-xs break-words max-h-24 overflow-y-auto">
                {exportError}
              </div>
            )}

            {/* Progress bar tracker */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-[10px] font-label-caps text-outline font-bold">
                <span className="truncate pr-2">
                  {exportStage ||
                    (exportingState === 'idle'
                      ? 'READY TO RENDER'
                      : exportingState === 'exporting'
                      ? `EXPORTING... (${exportProgress}%)`
                      : exportingState === 'failed'
                      ? 'EXPORT FAILED'
                      : 'EXPORT COMPLETED!')}
                </span>
                <span
                  className={
                    exportingState === 'completed'
                      ? 'text-secondary font-bold'
                      : exportingState === 'failed'
                      ? 'text-error font-bold'
                      : 'text-[#ffb95f]'
                  }
                >
                  {exportingState === 'idle'
                    ? 'SYSTEM IDLE'
                    : exportingState === 'exporting'
                    ? `${exportProgress}%`
                    : exportingState === 'failed'
                    ? 'ERROR'
                    : 'SUCCESS'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    exportingState === 'completed'
                      ? 'bg-secondary'
                      : exportingState === 'failed'
                      ? 'bg-error'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 bg-surface-container border-t border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={uploadYouTube}
                onChange={(e) => setUploadYouTube(e.target.checked)}
                disabled={exportingState === 'exporting'}
                className="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                Upload to YouTube
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={uploadInstagram}
                onChange={(e) => setUploadInstagram(e.target.checked)}
                disabled={exportingState === 'exporting'}
                className="rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface transition-colors">
                Post to Instagram
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCancelOrReset}
              className="px-6 py-2.5 font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors border border-outline-variant rounded-lg cursor-pointer text-xs"
            >
              {exportingState === 'completed' ? 'Close' : 'Cancel'}
            </button>

            {exportingState === 'completed' ? (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-8 py-3 font-label-caps text-label-caps bg-secondary text-on-secondary font-bold rounded-lg hover:brightness-105 active:scale-95 transition-all shadow-lg cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px] block">download</span>
                DOWNLOAD VIDEO
              </button>
            ) : (
              <button
                onClick={handleStartExport}
                disabled={exportingState === 'exporting' || ffmpegHealth?.available === false}
                className="flex items-center gap-2 px-8 py-3 font-label-caps text-label-caps bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px] block">bolt</span>
                {exportingState === 'exporting'
                  ? 'EXPORTING...'
                  : exportingState === 'failed'
                  ? 'RETRY EXPORT'
                  : 'START EXPORT'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
