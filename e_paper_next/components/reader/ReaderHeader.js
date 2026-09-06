'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ChevronDown,
  Settings
} from 'lucide-react';

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBengaliNumber = (num) => {
  return String(num).split('').map(d => bengaliDigits[parseInt(d, 10)] || d).join('');
};

const EDITIONS = [
  'ঢাকা সিটি',
  'জাতীয় সংস্করণ',
  'চট্টগ্রাম',
  'সিলেট',
  'রাজশাহী',
  'খুলনা',
  'বরিশাল',
  'রংপুর',
  'ময়মনসিংহ'
];

export default function ReaderHeader({
  edition,
  selectedCity = 'ঢাকা সিটি',
  onSelectCity,
  currentPageNumber = 1,
  totalPages = 12,
  onSelectPage,
  onPrevPage,
  onNextPage,
  currentDate = '২০২৪-০৮-০৬',
  onSelectDate,
}) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: City / Edition Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition shadow-xs"
          >
            <span>{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {isCityDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50 animate-in fade-in">
              {EDITIONS.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    if (onSelectCity) onSelectCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs sm:text-sm transition ${
                    selectedCity === city
                      ? 'bg-[#008374]/10 text-[#008374] font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center: Pagination with Bengali Numerals & Arrow Navigation */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1 no-scrollbar">
          {/* Previous Arrow */}
          <button
            onClick={onPrevPage}
            disabled={currentPageNumber <= 1}
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition text-xs"
            title="পূর্ববর্তী পৃষ্ঠা"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Bengali Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            const isActive = pageNum === currentPageNumber;
            return (
              <button
                key={pageNum}
                onClick={() => onSelectPage(pageNum)}
                className={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 flex items-center justify-center rounded text-xs sm:text-sm font-semibold transition border ${
                  isActive
                    ? 'bg-[#008374] text-white border-[#008374] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                {toBengaliNumber(pageNum)}
              </button>
            );
          })}

          {/* Next Arrow */}
          <button
            onClick={onNextPage}
            disabled={currentPageNumber >= totalPages}
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition text-xs"
            title="পরবর্তী পৃষ্ঠা"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Date Picker & Admin shortcut */}
        <div className="flex items-center space-x-2">
          {/* Date Selector */}
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition shadow-xs"
          >
            <Calendar className="w-4 h-4 text-slate-700" />
            <span className="font-mono">{currentDate}</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            title="এডমিন প্যানেল"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}
