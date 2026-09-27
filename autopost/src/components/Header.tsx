'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Radio, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  isScrapingActive: boolean;
  isSyncingActive: boolean;
}

export function Header({ isScrapingActive, isSyncingActive }: HeaderProps) {
  const isBusy = isScrapingActive || isSyncingActive;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight">AutoPost Agent</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO AUTOMATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Product Scraping & Playwright Admin Ingestion System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isScrapingActive
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
                : isSyncingActive
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/30 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
            <span>
              {isScrapingActive
                ? 'Scraping Target...'
                : isSyncingActive
                ? 'Bot Auto-Posting to Admin...'
                : 'Agent Ready'}
            </span>
          </div>

          {/* Quick link to Built-in Mock Admin */}
          <Link
            href="/mock-admin/products"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition-colors"
            title="Inspect products submitted to the built-in mock admin"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mock Admin Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
        </div>
      </div>
    </header>
  );
}
