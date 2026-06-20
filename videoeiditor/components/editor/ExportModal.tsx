'use client';

import React, { useEffect, useState } from 'react';
import { useEditorStore, editorStore } from '../../store/editorStore';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const exportingState = useEditorStore((state) => state.exportingState);
  const exportProgress = useEditorStore((state) => state.exportProgress);
  const exportConfig = useEditorStore((state) => state.exportConfig);

  const [fileName, setFileName] = useState(exportConfig.fileName);
  const [format, setFormat] = useState(exportConfig.format);
  const [resolution, setResolution] = useState(exportConfig.resolution);
  const [fps, setFps] = useState(exportConfig.fps);
  const [quality, setQuality] = useState(exportConfig.quality);
  const [uploadYouTube, setUploadYouTube] = useState(true);
  const [uploadInstagram, setUploadInstagram] = useState(false);

  // Sync back local states to store when changed
  useEffect(() => {
    editorStore.updateExportConfig({
      fileName,
      format,
      resolution,
      fps,
      quality,
    });
  }, [fileName, format, resolution, fps, quality]);

  // Reactive estimations based on configuration and quality
  const isProRes = format.includes('ProRes');
  const durationSec = 165; // ~2m 45s
  
  // Calculate size in GB: ProRes is huge, MP4 is small, adjusted by quality
  const sizeMult = isProRes ? 0.008 : 0.0015;
  const estimatedSize = (quality * durationSec * sizeMult).toFixed(2);
  const renderTimeMin = Math.round((quality * durationSec * 0.015) / 10) || 1;

  const handleStartExport = () => {
    editorStore.startExport();
  };

  const handleDownload = () => {
    // Generate a dummy video file download
    const dummyContent = `CineFlow Pro Rendered Output\nFile Name: ${fileName}\nFormat: ${format}\nResolution: ${resolution}\nQuality: ${quality}%`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${format.includes('MP4') ? 'mp4' : (format.includes('GIF') ? 'gif' : 'mov')}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px] block">movie_edit</span>
            <h2 className="font-headline-md text-headline-md font-bold">Export Media</h2>
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
                    <span className="text-xs text-outline font-medium">Output Location</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="/Volumes/External_SSD/Projects/Render/"
                        className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-mono-data text-xs text-outline-variant outline-none"
                      />
                      <button className="p-2 border border-outline-variant rounded-lg bg-surface hover:bg-surface-container-highest text-on-surface-variant hover:text-white transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[18px] block">folder_open</span>
                      </button>
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
                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-outline text-xs">
                      <span className="material-symbols-outlined text-[16px] block">aspect_ratio</span>
                      <span className="font-medium">16:9 Wide</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Encoding Quality */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-bold">
                    Encoding Quality
                  </label>
                  <span className="font-mono-data text-primary text-sm font-semibold">{quality}%</span>
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
                  00:04:12:15
                </div>
              </div>
            </div>

            {/* Estimated Output parameters */}
            <div className="space-y-4 bg-surface-container-high p-4 rounded-xl border border-outline-variant">
              <h4 className="font-label-caps text-label-caps text-primary uppercase font-bold">Estimated Output</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">File Size</span>
                  <span className="font-semibold text-sm text-on-surface">{estimatedSize} GB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">Duration</span>
                  <span className="font-semibold text-sm text-on-surface">02:45</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">Peak Bitrate</span>
                  <span className="font-semibold text-sm text-on-surface">{quality * 0.5} Mbps</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-outline mb-0.5">Render Est.</span>
                  <span className="font-semibold text-sm text-on-surface">~{renderTimeMin}m 20s</span>
                </div>
              </div>
            </div>

            {/* Progress bar tracker */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-[10px] font-label-caps text-outline font-bold">
                <span>
                  {exportingState === 'idle' 
                    ? 'READY TO RENDER' 
                    : exportingState === 'exporting' 
                      ? `EXPORTING... (${exportProgress}%)` 
                      : 'EXPORT COMPLETED!'}
                </span>
                <span className={exportingState === 'completed' ? 'text-secondary font-bold' : 'text-[#ffb95f]'}>
                  {exportingState === 'idle' 
                    ? 'SYSTEM IDLE' 
                    : exportingState === 'exporting' 
                      ? 'RENDERING CHANNELS' 
                      : 'SUCCESS'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 ${
                    exportingState === 'completed' ? 'bg-secondary' : 'bg-primary'
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
                disabled={exportingState === 'exporting'}
                className="flex items-center gap-2 px-8 py-3 font-label-caps text-label-caps bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-[18px] block">bolt</span>
                {exportingState === 'exporting' ? 'EXPORTING...' : 'START EXPORT'}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
