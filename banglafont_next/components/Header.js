"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IconSearch, IconShoppingCart, IconUser } from "./Icons";

export default function Header({ onMenuClick }) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const [designer, setDesigner] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/designer/profile");
        const data = await res.json();
        if (res.ok && data.success) {
          setDesigner(data.designer);
        } else {
          setDesigner(null);
        }
      } catch (err) {
        setDesigner(null);
      }
    }
    checkAuth();
  }, [pathname]);

  return (
    <header className="border-b border-white/10 bg-[#0d0e14]/90 backdrop-blur-md sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={onMenuClick}
          className="p-2 sm:p-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#00e599] to-emerald-400 flex items-center justify-center text-gray-950 font-black text-base sm:text-lg shadow-[0_0_15px_rgba(0,229,153,0.3)]">
            অ
          </div>
          <span className="text-sm sm:text-lg font-bold tracking-tight text-white group-hover:text-[#00e599] transition-colors">
            Next<span className="text-[#00e599]">Type</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <IconSearch className="absolute left-3.5 text-gray-400 text-sm" />
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
          <Link href="/designer/dashboard?tab=upload" className="hover:text-[#00e599] transition-colors">
            Upload Font
          </Link>
          <Link href="/about-us" className="hover:text-[#00e599] transition-colors">
            About
          </Link>
        </nav>

        {/* Right Actions (Cart / Profile / Sign In / Sign Up) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!designer && (
            <>
              <Link
                href="/checkout"
                className="relative p-1.5 sm:p-2 text-gray-300 hover:text-white bg-[#161822] rounded-lg sm:rounded-xl border border-white/10 transition-colors"
                title="Cart"
              >
                <IconShoppingCart className="text-sm sm:text-base" />
                <span className="absolute -top-1 -right-1 bg-[#00e599] text-gray-950 text-[9px] sm:text-[10px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>

              <Link
                href="/designer/login"
                className="text-[10px] sm:text-xs font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#161822] text-gray-200 rounded-lg sm:rounded-xl border border-white/10 hover:border-white/30 transition-all flex items-center gap-1 sm:gap-1.5"
              >
                <IconUser className="text-xs sm:text-sm" />
                <span>Sign In</span>
              </Link>

              <Link
                href="/designer/register"
                className="text-[10px] sm:text-xs font-bold px-2.5 sm:px-4 py-1.5 sm:py-2 bg-[#00e599] text-gray-955 rounded-lg sm:rounded-xl hover:bg-[#00c784] transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          {designer && (
            <Link
              href="/designer/dashboard"
              className="w-8 h-8 rounded-full overflow-hidden border border-[#00e599]/30 hover:border-[#00e599] transition-all flex items-center justify-center bg-[#161822]"
              title="Dashboard"
            >
              {designer.photo ? (
                <img src={designer.photo} alt={designer.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#00e599] to-emerald-400 flex items-center justify-center text-gray-955 font-bold text-xs">
                  {designer.name.charAt(0)}
                </div>
              )}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
