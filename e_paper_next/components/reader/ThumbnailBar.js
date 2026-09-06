'use client';

import React from 'react';
import { Layers } from 'lucide-react';

export default function ThumbnailBar({ pages = [], activePageNumber, onSelectPage }) {
  if (!pages || pages.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 py-2.5 px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Label */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>EDITION PAGES</span>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex items-center space-x-3 overflow-x-auto py-1 px-2 mx-auto no-scrollbar">
          {pages.map((p) => {
            const isActive = p.pageNumber === activePageNumber;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPage(p.pageNumber)}
                className={`group relative flex flex-col items-center flex-shrink-0 transition-all duration-200 ${
                  isActive ? 'scale-105' : 'opacity-70 hover:opacity-100 hover:scale-100'
                }`}
              >
                <div
                  className={`w-14 h-18 sm:w-16 sm:h-20 rounded border overflow-hidden bg-slate-900 shadow-md ${
                    isActive
                      ? 'border-amber-400 ring-2 ring-amber-400/50'
                      : 'border-slate-700 group-hover:border-slate-500'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.thumbUrl || p.imageUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
                <span
                  className={`mt-1 text-[11px] font-bold ${
                    isActive ? 'text-amber-300 font-extrabold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  Page {p.pageNumber}
                </span>
              </button>
            );
          })}
        </div>

        {/* Total Count */}
        <div className="hidden sm:block text-xs font-medium text-slate-400">
          {pages.length} Pages
        </div>
      </div>
    </div>
  );
}
