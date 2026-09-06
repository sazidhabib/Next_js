'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewspaperCanvas({
  page,
  hotspots = [],
  activeArticleId,
  onSelectArticle,
  onPrevPage,
  onNextPage,
  hasPrevPage,
  hasNextPage,
}) {
  const [hoveredHotspot, setHoveredHotspot] = useState(null);

  return (
    <div className="relative bg-white rounded-lg border border-slate-200 shadow-xs p-3 flex flex-col items-center justify-center h-full overflow-hidden">
      
      {/* Newspaper Page Container */}
      <div className="relative w-full max-w-full h-full max-h-[85vh] flex items-center justify-center">
        
        {/* Newspaper Page Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={page?.imageUrl || '/sample-epaper/page_1.svg'}
          alt={page?.pageTitle || 'Newspaper Scan'}
          className="w-auto h-full max-h-[85vh] object-contain rounded shadow-xs border border-slate-200 pointer-events-none select-none"
        />

        {/* Interactive Hotspot Coordinate Overlay */}
        <div className="absolute inset-0 max-w-full max-h-[85vh] m-auto flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            {hotspots.map((hotspot) => {
              const isHovered = hoveredHotspot?.id === hotspot.id;
              const isActive = activeArticleId === hotspot.articleId;

              return (
                <div
                  key={hotspot.id}
                  onClick={() => {
                    if (onSelectArticle) {
                      onSelectArticle(hotspot.article || { id: hotspot.articleId });
                    }
                  }}
                  onMouseEnter={() => setHoveredHotspot(hotspot)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    width: `${hotspot.width}%`,
                    height: `${hotspot.height}%`,
                  }}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-150 rounded-xs ${
                    isActive
                      ? 'bg-[#008374]/20 ring-2 ring-[#008374] shadow-xs'
                      : isHovered
                      ? 'bg-[#008374]/15 ring-2 ring-[#008374]/80'
                      : 'hover:bg-[#008374]/10 ring-1 ring-transparent hover:ring-[#008374]/50'
                  }`}
                  title={hotspot.article?.title || 'ক্লিক করে সম্পূর্ণ সংবাদ পড়ুন'}
                />
              );
            })}
          </div>
        </div>

        {/* Left Arrow Floating Button */}
        {hasPrevPage && (
          <button
            onClick={onPrevPage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#008374]/80 hover:bg-[#008374] text-white flex items-center justify-center shadow-md transition z-20"
            title="পূর্ববর্তী পৃষ্ঠা"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Floating Button (Matches Teal Circular Arrow in Screenshot) */}
        {hasNextPage && (
          <button
            onClick={onNextPage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#008374]/80 hover:bg-[#008374] text-white flex items-center justify-center shadow-md transition z-20"
            title="পরবর্তী পৃষ্ঠা"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

      </div>

    </div>
  );
}
