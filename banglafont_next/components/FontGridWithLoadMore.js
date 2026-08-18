"use client";

import { useState, useEffect } from "react";
import DarkFontCard from "./DarkFontCard";

export default function FontGridWithLoadMore({ initialFonts, totalCount, currentStyle }) {
  const [fontsList, setFontsList] = useState(initialFonts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  // Reset local state when initial server data changes (e.g. user changes style filter)
  useEffect(() => {
    setFontsList(initialFonts);
    setPage(1);
  }, [initialFonts, currentStyle]);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/fonts?type=FREE&style=${currentStyle}&limit=${limit}&page=${nextPage}`);
      if (res.ok) {
        const data = await res.json();
        if (data.fonts && data.fonts.length > 0) {
          setFontsList((prev) => [...prev, ...data.fonts]);
          setPage(nextPage);
        }
      }
    } catch (err) {
      console.error("Error loading more fonts:", err);
    } finally {
      setLoading(false);
    }
  }

  const hasMore = fontsList.length < totalCount;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {fontsList.map((font) => (
          <DarkFontCard key={font.id} font={font} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#12141f] border border-white/10 hover:border-[#00e599]/60 hover:text-white rounded-xl text-xs sm:text-sm font-semibold text-gray-300 transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#00e599]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>লোডিং হচ্ছে...</span>
              </>
            ) : (
              <span>আরও দেখুন (Load More)</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
