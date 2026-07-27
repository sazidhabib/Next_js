"use client";

import { useState } from "react";

export default function HeroSection({ onResult, onLoading, onError }) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setUrl(text);
    } catch {
      // Clipboard API may fail in some browsers
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20 sm:py-28">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImVudmVsb3BlIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Download Videos
          <span className="block text-blue-200">in HD, 2K & 4K Quality</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100 sm:mt-6 sm:text-xl">
          Save videos from Facebook, YouTube, Instagram, TikTok &amp; Twitter/X. Free, fast, and works on all devices.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 sm:mt-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste video link here..."
                className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-5 py-4 text-white placeholder-blue-200 backdrop-blur-sm transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/15 px-3 py-1.5 text-sm text-blue-100 transition-colors hover:bg-white/25"
              >
                Paste
              </button>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
            >
              Download
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-blue-200/80">
          Supports: YouTube, Facebook, Instagram, TikTok, Twitter/X &amp; more
        </p>
      </div>
    </section>
  );
}
