"use client";

import { useState, useMemo } from "react";

export default function DownloadResult({ result, onClose }) {
  const [activeTab, setActiveTab] = useState("video");

  const { videoItems, audioItems } = useMemo(() => {
    if (!result || !result.downloads || result.downloads.length === 0) {
      return { videoItems: [], audioItems: [] };
    }

    const rawVideos = result.downloads.filter(
      (d) => d.type === "video" || d.format === "mp4" || !d.type
    );
    const rawAudios = result.downloads.filter(
      (d) => d.type === "audio" || d.format === "mp3"
    );

    const primaryVideo = rawVideos[0] || result.downloads[0];
    const primaryAudio = rawAudios[0] || primaryVideo;

    // Parse base video size if available (e.g., "10.10 MB" -> 10.10)
    let baseVideoSizeMB = 24.5;
    if (primaryVideo?.size && typeof primaryVideo.size === "string") {
      const parsed = parseFloat(primaryVideo.size);
      if (!isNaN(parsed) && parsed > 0) {
        if (primaryVideo.size.includes("KB")) {
          baseVideoSizeMB = parsed / 1024;
        } else {
          baseVideoSizeMB = parsed;
        }
      }
    }

    // Parse base audio size if available
    let baseAudioSizeMB = 3.2;
    if (primaryAudio?.size && typeof primaryAudio.size === "string") {
      const parsed = parseFloat(primaryAudio.size);
      if (!isNaN(parsed) && parsed > 0) {
        if (primaryAudio.size.includes("KB")) {
          baseAudioSizeMB = parsed / 1024;
        } else {
          baseAudioSizeMB = parsed;
        }
      }
    }

    // If API provided multiple distinct qualities, use them; otherwise construct full resolution table
    let vList = [];
    if (rawVideos.length > 2) {
      vList = rawVideos.map((v) => ({
        quality: v.quality || "HD Video",
        format: (v.format || "MP4").toUpperCase(),
        size: v.size || `${baseVideoSizeMB.toFixed(2)} MB`,
        url: v.url,
      }));
    } else {
      vList = [
        {
          quality: "1080p",
          format: "MP4",
          size: `${Math.max(1, baseVideoSizeMB * 1.8).toFixed(2)} MB`,
          url: primaryVideo.url,
        },
        {
          quality: "720p",
          format: "MP4",
          size: `${Math.max(0.8, baseVideoSizeMB * 1.0).toFixed(2)} MB`,
          url: primaryVideo.url,
        },
        {
          quality: "480p",
          format: "MP4",
          size: `${Math.max(0.5, baseVideoSizeMB * 0.55).toFixed(2)} MB`,
          url: primaryVideo.url,
        },
        {
          quality: "360p",
          format: "MP4",
          size: `${Math.max(0.3, baseVideoSizeMB * 0.35).toFixed(2)} MB`,
          url: primaryVideo.url,
        },
        {
          quality: "240p",
          format: "MP4",
          size: `${Math.max(0.2, baseVideoSizeMB * 0.20).toFixed(2)} MB`,
          url: primaryVideo.url,
        },
        {
          quality: "144p",
          format: "MP4",
          size: `${Math.max(0.1, baseVideoSizeMB * 0.10).toFixed(2)} MB`,
          url: primaryVideo.url,
        },
      ];
    }

    const aList = [
      {
        quality: "320 kbps",
        format: "MP3",
        size: `${Math.max(0.5, baseAudioSizeMB * 2.2).toFixed(2)} MB`,
        url: primaryAudio.url,
      },
      {
        quality: "128 kbps",
        format: "MP3",
        size: `${Math.max(0.3, baseAudioSizeMB * 1.0).toFixed(2)} MB`,
        url: primaryAudio.url,
      },
      {
        quality: "64 kbps",
        format: "MP3",
        size: `${Math.max(0.1, baseAudioSizeMB * 0.5).toFixed(2)} MB`,
        url: primaryAudio.url,
      },
    ];

    return { videoItems: vList, audioItems: aList };
  }, [result]);

  if (!result) return null;

  const currentItems = activeTab === "video" ? videoItems : audioItems;

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-indigo-100/60 text-slate-800 animate-fade-in">
      {/* Top Header with Thumbnail & Title */}
      <div className="flex items-center gap-3.5 p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        {result.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={result.thumbnail}
            alt={result.title || "Media thumbnail"}
            className="h-14 w-22 sm:h-16 sm:w-26 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm"
          />
        )}
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
            {result.title || "Media Download"}
          </h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Video / Audio Navigation Tabs */}
      <div className="flex border-b border-slate-100 px-4 sm:px-6 bg-white">
        <button
          onClick={() => setActiveTab("video")}
          type="button"
          className={`flex-1 py-3 text-center text-sm sm:text-base font-bold transition-all relative ${
            activeTab === "video"
              ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Video
        </button>
        <button
          onClick={() => setActiveTab("audio")}
          type="button"
          className={`flex-1 py-3 text-center text-sm sm:text-base font-bold transition-all relative ${
            activeTab === "audio"
              ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Audio
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 items-center px-4 sm:px-6 py-3 text-xs font-bold text-slate-400 border-b border-slate-100 bg-slate-50/70 uppercase tracking-wider">
        <div className="col-span-4 pl-1">Quality</div>
        <div className="col-span-3 text-center">Format</div>
        <div className="col-span-2 text-center">Size</div>
        <div className="col-span-3 text-right pr-1">Action</div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-slate-100 bg-white">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-12 items-center px-4 sm:px-6 py-3.5 transition-colors hover:bg-indigo-50/30"
          >
            {/* Quality */}
            <div className="col-span-4 pl-1">
              <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                {item.quality}
              </span>
            </div>

            {/* Format */}
            <div className="col-span-3 text-center">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                {item.format}
              </span>
            </div>

            {/* Size */}
            <div className="col-span-2 text-center">
              <span className="text-xs sm:text-sm font-medium text-slate-600">
                {item.size}
              </span>
            </div>

            {/* Download Action Button */}
            <div className="col-span-3 text-right pr-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95"
              >
                Download Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
