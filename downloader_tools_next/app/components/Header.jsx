"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header({ onPasteUrl }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="w-full border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg className="h-5 w-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Media<span className="text-indigo-600">Drop</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="relative font-semibold text-slate-900 transition-colors hover:text-indigo-600 after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full">
            Home
          </Link>
          <a href="#platforms" className="hover:text-indigo-600 transition-colors">
            Platforms
          </a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
            How It Works
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            FAQ
          </a>
          <a href="#api" className="hover:text-indigo-600 transition-colors">
            API
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Pill */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle Theme"
            className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 px-2.5 py-1.5 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100"
          >
            <span className={!isDark ? "opacity-100" : "opacity-40"}>☀️</span>
            <span className={isDark ? "opacity-100" : "opacity-40"}>🌙</span>
          </button>

          {/* Paste URL Button */}
          <button
            onClick={onPasteUrl}
            type="button"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-all hover:bg-indigo-700 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span>Paste URL</span>
          </button>
        </div>
      </div>
    </header>
  );
}
