'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAdminTheme } from '@/lib/adminThemeContext';

export default function AdminThemeToggler({ className = '', compact = false }) {
  const { theme, toggleTheme, mounted } = useAdminTheme();

  if (!mounted) {
    return (
      <div className={`h-8 w-16 bg-slate-800/40 rounded-full animate-pulse ${className}`} />
    );
  }

  const isLight = theme === 'light';

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle Dark/Light Mode"
        title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
          isLight
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 shadow-2xs'
            : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 shadow-2xs'
        } ${className}`}
      >
        {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Mode"
      className={`relative inline-flex items-center justify-between p-1 rounded-full w-full max-w-[160px] text-xs font-bold transition-all cursor-pointer select-none ${
        isLight
          ? 'bg-slate-200/90 text-slate-800 border border-slate-300 shadow-2xs'
          : 'bg-slate-950 text-slate-200 border border-slate-800 shadow-2xs'
      } ${className}`}
    >
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
          isLight
            ? 'bg-white text-orange-600 shadow-xs font-extrabold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="text-[11px]">Light</span>
      </div>

      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
          !isLight
            ? 'bg-slate-800 text-orange-400 shadow-xs font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="text-[11px]">Dark</span>
      </div>
    </button>
  );
}
