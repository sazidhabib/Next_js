"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="border-b border-white/10 bg-[#0d0e14]/90 backdrop-blur-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00e599] to-emerald-400 flex items-center justify-center text-gray-950 font-black text-lg shadow-[0_0_15px_rgba(0,229,153,0.3)]">
            অ
          </div>
          <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#00e599] transition-colors">
            Bangla<span className="text-[#00e599]">Type</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <span className="absolute left-3.5 text-gray-400 text-xs">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts, foundry, styles..."
            className="w-full bg-[#161822] text-xs text-white placeholder-gray-500 pl-9 pr-12 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#00e599]/60 transition-all"
          />
          <kbd className="absolute right-3 bg-[#202330] text-[10px] text-gray-400 px-1.5 py-0.5 rounded border border-white/10">
            Ctrl K
          </kbd>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-gray-300">
          <Link href="/free-fonts" className="hover:text-[#00e599] transition-colors">
            Fonts
          </Link>
          <Link href="/designer" className="hover:text-[#00e599] transition-colors">
            Foundry
          </Link>
          <Link href="/collections" className="hover:text-[#00e599] transition-colors">
            Collections
          </Link>
          <Link href="/developer" className="hover:text-[#00e599] transition-colors">
            Developer
          </Link>
          <Link href="/about-us" className="hover:text-[#00e599] transition-colors">
            About
          </Link>
        </nav>

        {/* Right Actions (Cart / Admin / Sign In) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/checkout"
            className="relative p-2 text-gray-300 hover:text-white bg-[#161822] rounded-xl border border-white/10 transition-colors"
            title="Cart"
          >
            🛒
            <span className="absolute -top-1 -right-1 bg-[#00e599] text-gray-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </Link>

          <Link
            href="/admin"
            className="text-xs font-semibold px-4 py-2 bg-[#161822] text-gray-200 rounded-xl border border-white/10 hover:border-white/30 transition-all flex items-center gap-1.5"
          >
            <span>👤</span>
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
