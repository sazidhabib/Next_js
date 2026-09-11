"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DownloadResult from "./DownloadResult";
import {
  FacebookIcon, YouTubeIcon, InstagramIcon, TikTokIcon, TwitterIcon,
  LinkedInIcon, PinterestIcon, DouyinIcon, KuaishouIcon, DiscordIcon,
  QuoraIcon, QQIcon, ReelsIcon, ShortsIcon
} from "./SupportedPlatforms";

const PLATFORM_ITEMS = [
  { name: "YouTube", path: "/youtube", icon: YouTubeIcon, color: "text-[#FF0000]" },
  { name: "YouTube Shorts", path: "/shorts", icon: ShortsIcon, color: "text-[#FF0000]" },
  { name: "TikTok", path: "/tiktok", icon: TikTokIcon, color: "text-[#000000]" },
  { name: "Instagram", path: "/instagram", icon: InstagramIcon, color: "text-[#E1306C]" },
  { name: "Reels", path: "/reels", icon: ReelsIcon, color: "text-[#C13584]" },
  { name: "Facebook", path: "/facebook", icon: FacebookIcon, color: "text-[#1877F2]" },
  { name: "Twitter/X", path: "/twitter", icon: TwitterIcon, color: "text-[#0f1419]" },
  { name: "Pinterest", path: "/pinterest", icon: PinterestIcon, color: "text-[#BD081C]" },
  { name: "LinkedIn", path: "/linkedin", icon: LinkedInIcon, color: "text-[#0A66C2]" },
  { name: "Douyin", path: "/douyin", icon: DouyinIcon, color: "text-[#000000]" },
  { name: "Kuaishou", path: "/kuaishou", icon: KuaishouIcon, color: "text-[#FF5000]" },
  { name: "Discord", path: "/discord", icon: DiscordIcon, color: "text-[#5865F2]" },
  { name: "Quora", path: "/quora", icon: QuoraIcon, color: "text-[#B92B27]" },
  { name: "QQ", path: "/tencent", icon: QQIcon, color: "text-[#12B7F5]" },
];

export default function HeroSection({
  result,
  loading,
  error,
  onClose,
  onResult,
  onLoading,
  onError,
  platformName,
  inputRef,
}) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    onLoading(true);
    onError(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error || "Something went wrong");
        onLoading(false);
        return;
      }

      onResult(data);
    } catch {
      onError("Network error. Please check your connection and try again.");
    } finally {
      onLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      // Clipboard API fallback
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-blue-50/25 to-white pt-12 pb-16 md:pt-16 md:pb-24">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-indigo-200/40 via-blue-100/30 to-purple-100/20 blur-3xl -z-10 rounded-full" />

      {/* Floating Left Graphic (left.png) */}
      <div className="hidden lg:block absolute left-2 xl:left-8 2xl:left-14 top-1/2 -translate-y-[58%] w-60 xl:w-72 2xl:w-100 pointer-events-none select-none drop-shadow-2xl animate-float-slow z-0">
        <Image
          src="/left.png"
          alt="Video Downloader Preview"
          width={400}
          height={400}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Floating Right Graphic (right.png) */}
      <div className="hidden lg:block absolute right-2 xl:right-8 2xl:right-14 top-1/2 -translate-y-[58%] w-60 xl:w-72 2xl:w-100 pointer-events-none select-none drop-shadow-2xl animate-float-delayed z-0">
        <Image
          src="/right.png"
          alt="Quality Download Options"
          width={400}
          height={400}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center z-10">
        {/* Fast • Free • No Watermark Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/90 px-4 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm transition-transform hover:scale-105">
          <svg className="h-3.5 w-3.5 fill-current text-indigo-500" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span>Fast • Free • No Watermark</span>
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black tracking-tight text-slate-900 leading-[1.12]">
          Download Media <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            {platformName ? `From ${platformName}` : "From Anywhere"}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
          Save videos, audio, and images from your favorite platforms in high quality.
        </p>

        {/* Search & Download Bar */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 sm:mt-10 max-w-2xl">
          <div className="relative flex items-center rounded-2xl bg-white p-2 sm:p-2.5 shadow-xl shadow-indigo-100/70 border border-slate-200/80 ring-4 ring-indigo-50/50 focus-within:border-indigo-400 focus-within:ring-indigo-100 transition-all">
            {/* Link Icon */}
            <div className="pl-3 pr-2 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your media link here..."
              className="w-full bg-transparent px-2 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none"
            />

            {/* Paste Button */}
            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 mr-2 transition-colors"
              >
                Paste
              </button>
            )}

            {/* Download Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 px-6 sm:px-8 py-3 text-sm sm:text-base font-bold text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 shrink-0 disabled:opacity-75"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <span>Download Now</span>
              )}
            </button>
          </div>
        </form>

        {/* Loading Spinner directly below Search Bar */}
        {loading && (
          <div className="mx-auto mt-6 max-w-2xl text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-xl shadow-indigo-100/60 border border-slate-100 ring-1 ring-slate-100">
              <svg className="h-5 w-5 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm font-semibold text-slate-700">Fetching media download links...</span>
            </div>
          </div>
        )}

        {/* Error Alert directly below Search Bar */}
        {error && !loading && (
          <div className="mx-auto mt-6 max-w-2xl text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-rose-50 px-6 py-4 shadow-sm border border-rose-100">
              <svg className="h-5 w-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="text-sm font-medium text-rose-700">{error}</span>
            </div>
          </div>
        )}

        {/* Download Result Table Card directly below Search Bar */}
        {result && !loading && (
          <div className="mx-auto mt-6 max-w-2xl text-left animate-fade-in">
            <DownloadResult result={result} onClose={onClose} />
          </div>
        )}

        {/* Platform Icons Row */}
        <div className="mt-12 sm:mt-14 max-w-4xl mx-auto">
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-2 sm:gap-3 items-center justify-center">
            {PLATFORM_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="group flex flex-col items-center gap-1.5 transition-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-white p-2.5 shadow-sm border border-slate-100 ring-1 ring-slate-100/80 transition-all group-hover:shadow-md group-hover:scale-105 group-hover:border-indigo-100">
                  <div className={`w-6 h-6 flex items-center justify-center ${item.color}`}>
                    <item.icon className="h-full w-full" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 transition-colors group-hover:text-indigo-600 truncate max-w-[70px] text-center">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
