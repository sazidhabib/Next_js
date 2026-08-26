"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconEdit3, IconArrowRight } from "./Icons";
import { resolveFontUrl } from "../lib/fontUtils";

const CATEGORIES = [
  { value: "ALL", label: "সকল" },
  { value: "PARAGRAPH", label: "প্যারাগ্রাফ" },
  { value: "HEADING", label: "হেডিং" },
  { value: "TYPOGRAPHY", label: "টাইপোগ্রাফি" },
  { value: "STYLISH", label: "স্টাইলিশ" },
  { value: "HANDWRITING", label: "হ্যান্ডরাইটিং" },
];

export default function HomeTypeTester({ fonts = [] }) {
  const [selectedFontSlug, setSelectedFontSlug] = useState(fonts[0]?.slug || "");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [text, setText] = useState("এখানে লিখুন...");

  const [fontSize, setFontSize] = useState(32);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [textAlign, setTextAlign] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredFonts = fonts.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === "ALL") return matchesSearch;
    if (selectedCategory === "TYPOGRAPHY") return matchesSearch && f.style === "GENERAL";
    if (selectedCategory === "PARAGRAPH") return matchesSearch && (f.style === "PARAGRAPH" || f.style === "GENERAL");
    if (selectedCategory === "HEADING") return matchesSearch && f.style === "HEADING";
    if (selectedCategory === "STYLISH") return matchesSearch && f.style === "STYLISH";
    if (selectedCategory === "HANDWRITING") return matchesSearch && f.style === "HANDWRITING";
    return matchesSearch;
  });

  const selectedFont = fonts.find((f) => f.slug === selectedFontSlug) || fonts[0];

  return (
    <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
      {/* Dynamic @font-face rules for all fonts in type tester */}
      {fonts.map((f) => {
        const previewFontUrl = resolveFontUrl(f.previewImageUrl || f.fontFileUrl);
        return previewFontUrl && (
          <style key={f.slug} dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: 'font-tester-${f.slug}';
              src: url('${previewFontUrl}');
              font-display: swap;
            }
          `}} />
        );
      })}

      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <IconEdit3 className="text-lg sm:text-xl text-[#00e599]" />
        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">Interactive Type Tester</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Left Side: Main Type Tester Board */}
        <div className="lg:col-span-8 bg-surface-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col justify-between min-h-[300px] sm:min-h-[460px]">
          <div>
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-border text-xs text-text-muted">
              <div className="flex items-center w-full sm:w-auto">
                <select
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-surface text-foreground border border-border rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 focus:outline-none focus:border-[#00e599] text-[10px] sm:text-xs cursor-pointer w-full sm:w-auto"
                >
                  <option value="এখানে লিখুন...">নমুনা টেক্সট</option>
                  <option value="আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।">আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।</option>
                  <option value="বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি।">বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি।</option>
                  <option value="সবকটি জানালা খুলে দাও না, আমি গাইব গাইব বিজয়ের গান।">সবকটি জানালা খুলে দাও না...</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs">সাইজ: {fontSize}px</span>
                <input
                  type="range"
                  min="16"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20 sm:w-24 md:w-28 accent-[#00e599] cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs">স্পেসিং: {letterSpacing}px</span>
                <input
                  type="range"
                  min="-2"
                  max="20"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-20 sm:w-24 md:w-28 accent-[#00e599] cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs">লাইন: {lineHeight}</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-[#00e599] cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Editable Text Area */}
            <div className="py-4 sm:py-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="এখানে লিখুন..."
                rows={5}
                className="w-full resize-none border-none outline-none focus:outline-none text-foreground placeholder-text-muted/50 bg-transparent"
                style={{
                  fontSize: `${Math.min(fontSize, isMobile ? 48 : 96)}px`,
                  letterSpacing: `${letterSpacing}px`,
                  lineHeight: lineHeight,
                  textAlign: textAlign,
                  fontWeight: isBold ? "bold" : "normal",
                  fontFamily: (selectedFont?.previewImageUrl || selectedFont?.fontFileUrl) ? `'font-tester-${selectedFont.slug}', sans-serif` : 'inherit'
                }}
              />
            </div>
          </div>

          {/* Bottom Toolbar & Action */}
          <div className="pt-3 sm:pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-lg sm:rounded-xl">
              <button
                type="button"
                onClick={() => setTextAlign("left")}
                className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs font-semibold ${textAlign === "left" ? "bg-[#00e599] text-gray-955 font-bold" : "text-text-muted hover:text-foreground"}`}
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("center")}
                className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs font-semibold ${textAlign === "center" ? "bg-[#00e599] text-gray-955 font-bold" : "text-text-muted hover:text-foreground"}`}
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("right")}
                className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs font-semibold ${textAlign === "right" ? "bg-[#00e599] text-gray-955 font-bold" : "text-text-muted hover:text-foreground"}`}
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
                className={`px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg text-xs font-bold ${isBold ? "bg-[#00e599] text-gray-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                B
              </button>
            </div>

            {selectedFont ? (
              <a
                href={resolveFontUrl(selectedFont.fontFileUrl) || `/free-font/${selectedFont.slug}`}
                download
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#00e599] text-gray-950 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/10"
              >
                <span className="hidden sm:inline">ডাউনলোড ফন্ট (</span>
                <span className="sm:hidden">ডাউনলোড</span>
                <span
                  className="hidden sm:inline"
                  style={{
                    fontFamily: (selectedFont.previewImageUrl || selectedFont.fontFileUrl)
                      ? `'font-tester-${selectedFont.slug}', sans-serif`
                      : 'inherit',
                    fontWeight: 'normal'
                  }}
                >
                  {selectedFont.banglaName || selectedFont.name}
                </span>
                <span className="hidden sm:inline">)</span>
              </a>
            ) : (
              <span className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-800 text-gray-500 font-medium text-xs rounded-lg sm:rounded-xl">
                ডাউনলোড ফন্ট
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Font Selector & Search List */}
        <div className="lg:col-span-4 bg-surface-card border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 min-h-[300px] sm:min-h-[460px] flex flex-col">
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ফন্ট খুঁজুন..."
              className="w-full bg-surface border border-border text-foreground text-xs px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl focus:outline-none focus:border-[#00e599] placeholder-text-muted/60"
            />
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 border-b border-border/50 pb-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors ${selectedCategory === cat.value
                    ? "bg-[#00e599] text-gray-955 font-bold"
                    : "bg-surface text-text-muted hover:text-foreground border border-border/50"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[240px] sm:max-h-[340px] space-y-2 pr-1 custom-scrollbar">
            {filteredFonts.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-8">কোনো ফন্ট পাওয়া যায়নি।</p>
            ) : (
              filteredFonts.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFontSlug(f.slug)}
                  className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${selectedFontSlug === f.slug
                      ? "border-[#00e599] bg-[#00e599]/10 text-foreground"
                      : "border-border bg-surface hover:bg-surface-card text-text-muted hover:text-foreground"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs sm:text-sm font-medium truncate"
                      style={{ fontFamily: (f.previewImageUrl || f.fontFileUrl) ? `'font-tester-${f.slug}', sans-serif` : 'inherit' }}
                    >
                      {f.banglaName || f.name}
                    </span>
                    <Link
                      href={`/free-font/${f.slug}`}
                      className="text-[9px] sm:text-[10px] text-[#00e599] hover:underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>বিস্তারিত</span>
                      <IconArrowRight />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
