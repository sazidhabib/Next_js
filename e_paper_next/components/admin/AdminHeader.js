'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ExternalLink, Database, Sparkles, ChevronRight, Layers } from 'lucide-react';

const ROUTE_TITLES = {
  '/admin': 'Dashboard Overview',
  '/admin/editions': 'Editions & Issues',
  '/admin/articles': 'Article Newsroom & CMS',
  '/admin/categories': 'Sections & Categories',
  '/admin/settings': 'System Settings & Tools',
};

export default function AdminHeader({ onOpenMobile }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    if (pathname.startsWith('/admin/map/')) {
      const pageId = pathname.split('/').pop();
      return `Page ${pageId} Hotspot Studio`;
    }
    if (pathname.startsWith('/admin/editions/')) {
      return 'Edition Details & Pages';
    }
    return 'Admin Management';
  };

  return (
    <header className="h-16 sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left side: Mobile button + Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs">
          <Link
            href="/admin"
            className="text-slate-400 hover:text-amber-400 font-medium hidden sm:inline"
          >
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <h1 className="text-sm sm:text-base font-semibold text-slate-100 truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right side: Status and Quick Link */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-medium">E-Paper Engine Active</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
        >
          <span>Live Reader</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
