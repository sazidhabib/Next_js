'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Crosshair,
  FileText,
  FolderTree,
  Settings,
  ExternalLink,
  Sparkles,
  Layers,
  X,
  RefreshCw,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
    exact: true,
  },
  {
    name: 'Editions',
    href: '/admin/editions',
    icon: Newspaper,
    badge: 'Live',
    exact: false,
  },
  {
    name: 'Hotspot Studio',
    href: '/admin/map/1',
    icon: Crosshair,
    badge: 'Canvas',
    exact: false,
  },
  {
    name: 'Article Newsroom',
    href: '/admin/articles',
    icon: FileText,
    badge: null,
    exact: false,
  },
  {
    name: 'Sections & Categories',
    href: '/admin/categories',
    icon: FolderTree,
    badge: null,
    exact: false,
  },
  {
    name: 'Settings & System',
    href: '/admin/settings',
    icon: Settings,
    badge: null,
    exact: false,
  },
];

export default function AdminSidebar({ mobileOpen, onCloseMobile, onResetSeed }) {
  const pathname = usePathname();

  const isLinkActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                E-Paper Studio
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Publishing &amp; Mapping Suite</p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          {/* Main Menu */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Publishing Workspace
            </div>
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      active
                        ? 'bg-gradient-to-r from-amber-500/15 to-rose-500/10 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          active
                            ? 'text-amber-400'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          active
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Mapping Shortlist */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Quick Page Canvas</span>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="grid grid-cols-5 gap-1.5 px-2">
              {[1, 2, 3, 4, 5].map((pNum) => {
                const isCurrent = pathname === `/admin/map/${pNum}`;
                return (
                  <Link
                    key={pNum}
                    href={`/admin/map/${pNum}`}
                    onClick={onCloseMobile}
                    className={`h-9 flex flex-col items-center justify-center rounded-lg text-xs font-semibold border transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:border-amber-500/40 hover:text-amber-300'
                    }`}
                    title={`Open Page ${pNum} Hotspot Studio`}
                  >
                    P.{pNum}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 space-y-2">
          {/* Back to Reader link */}
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700/60 hover:border-slate-600 transition-all group shadow-sm"
          >
            <span>Open Public Reader</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          {/* Seed reset button if handler provided */}
          {onResetSeed && (
            <button
              onClick={onResetSeed}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo DB</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
