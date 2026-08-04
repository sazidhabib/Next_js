"use client";

import { useState } from "react";
import Link from "next/link";
import { IconEdit3, IconArrowRight } from "./Icons";

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
    <div className="bg-[#12141f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Dynamic @font-face rules for all fonts in type tester */}
      {fonts.map((f) => {
        const previewFontUrl = f.previewImageUrl || f.fontFileUrl;
        return previewFontUrl && (
          <style key={f.slug} dangerouslySetInnerHTML={{ __html: `
            @font-face {
              font-family: 'font-tester-${f.slug}';
              src: url('${previewFontUrl}');
              font-display: swap;
            }
          `}} />
        );
      })}

      <div className="flex items-center gap-2 mb-6">
        <IconEdit3 className="text-xl text-[#00e599]" />
        <h3 className="text-lg font-bold text-white tracking-tight">Interactive Type Tester</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Main Type Tester Board */}
        <div className="lg:col-span-8 bg-[#161824] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-white/10 text-xs text-gray-300">
              <div className="flex items-center">
                <select
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-[#1e2130] text-gray-200 border border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#00e599] text-xs cursor-pointer"
                >
                  <option value="এখানে লিখুন...">নমুনা টেক্সট</option>
                  <option value="আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।">আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।</option>
                  <option value="বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি।">বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি।</option>
                  <option value="সবকটি জানালা খুলে দাও না, আমি গাইব গাইব বিজয়ের গান।">সবকটি জানালা খুলে দাও না...</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>সাইজ: {fontSize}px</span>
                <input
                  type="range"
                  min="16"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-[#00e599] cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>স্পেসিং: {letterSpacing}px</span>
                <input
                  type="range"
                  min="-2"
                  max="20"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-24 sm:w-28 accent-[#00e599] cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>লাইন: {lineHeight}</span>
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
            <div className="py-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="এখানে লিখুন..."
                rows={7}
                className="w-full resize-none border-none outline-none focus:outline-none text-gray-100 placeholder-gray-600 bg-transparent"
                style={{
                  fontSize: `${fontSize}px`,
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
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-[#1d2030] border border-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTextAlign("left")}
                className={`p-1.5 rounded-lg text-xs font-semibold ${textAlign === "left" ? "bg-[#00e599] text-gray-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("center")}
                className={`p-1.5 rounded-lg text-xs font-semibold ${textAlign === "center" ? "bg-[#00e599] text-gray-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => setTextAlign("right")}
                className={`p-1.5 rounded-lg text-xs font-semibold ${textAlign === "right" ? "bg-[#00e599] text-gray-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                ≡
              </button>
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isBold ? "bg-[#00e599] text-gray-950 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                B
              </button>
            </div>

            {selectedFont ? (
              <a
                href={selectedFont.fontFileUrl || `/free-font/${selectedFont.slug}`}
                download
                className="px-6 py-2.5 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/10"
              >
                ডাউনলোড ফন্ট ({selectedFont.name})
              </a>
            ) : (
              <span className="px-6 py-2.5 bg-gray-800 text-gray-500 font-medium text-xs rounded-xl">
                ডাউনলোড ফন্ট
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Font Selector & Search List */}
        <div className="lg:col-span-4 bg-[#161824] border border-white/10 rounded-2xl p-4 sm:p-5 min-h-[460px] flex flex-col">
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ফন্ট খুঁজুন..."
              className="w-full bg-[#1e2130] border border-white/10 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#00e599] placeholder-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3 border-b border-white/5 pb-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-[#00e599] text-gray-950 font-bold"
                    : "bg-[#1d2030] text-gray-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[340px] space-y-2 pr-1 custom-scrollbar">
            {filteredFonts.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">কোনো ফন্ট পাওয়া যায়নি।</p>
            ) : (
              filteredFonts.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFontSlug(f.slug)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedFontSlug === f.slug
                      ? "border-[#00e599] bg-[#00e599]/10 text-white"
                      : "border-transparent bg-[#1b1e2c] hover:bg-[#222638] text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{f.name}</span>
                    <Link
                      href={`/free-font/${f.slug}`}
                      className="text-[10px] text-[#00e599] hover:underline flex items-center gap-1"
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

