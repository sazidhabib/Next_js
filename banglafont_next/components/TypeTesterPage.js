"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { IconEdit3, IconArrowRight, IconDownload, IconType, IconZap, IconCrown } from "./Icons";

const CATEGORIES = [
  { value: "ALL", label: "সকল" },
  { value: "PARAGRAPH", label: "প্যারাগ্রাফ" },
  { value: "HEADING", label: "হেডিং" },
  { value: "GENERAL", label: "টাইপোগ্রাফি" },
  { value: "STYLISH", label: "স্টাইলিশ" },
  { value: "HANDWRITING", label: "হ্যান্ডরাইটিং" },
];

const SAMPLE_TEXTS = [
  { label: "নমুনা টেক্সট", value: "এখানে আপনার পছন্দের টেক্সট লিখুন..." },
  { label: "আমার সোনার বাংলা", value: "আমার সোনার বাংলা, আমি তোমায় ভালোবাসি। চিরদিন তোমার আকাশ, তোমার বাতাস, আমার প্রাণে বাজায় বাঁশি।" },
  { label: "বিদ্রোহী", value: "বল বীর, বল উন্নত মম শির! শির নেহারি আমারি নতশির ওই শিখর হিমাদ্রির!" },
  { label: "সবকটি জানালা", value: "সবকটি জানালা খুলে দাও না, আমি গাইব গাইব বিজয়ের গান। সবকটি জানালা খুলে দাও না।" },
  { label: "বাংলাদেশ", value: "বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি। বিনামূল্যে বাংলা ফন্ট ডাউনলোড করুন।" },
  { label: "প্যারাগ্রাফ", value: "বাংলা ভাষা দক্ষিণ এশিয়ার বঙ্গ অঞ্চলের মানুষের মাতৃভাষা। এই ভাষা বাংলাদেশ ও ভারতের পশ্চিমবঙ্গ, ত্রিপুরা ও আসামের বরাক উপত্যকার সরকারি ভাষা। বাংলা ভাষার লিপি হলো বাংলা লিপি। এই ভাষায় বহু বিশ্বসাহিত্যের মাস্টারপিস রচিত হয়েছে। রবীন্দ্রনাথ ঠাকুর, কাজী নজরুল ইসলাম, জীবনানন্দ দাশ, মাইকেল মধুসূদন দত্ত, শরৎচন্দ্র চট্টোপাধ্যায় প্রমুখ বিখ্যাত সাহিত্যিক বাংলা ভাষায় অমূল্য সাহিত্যকর্ম রেখে গেছেন।" },
];

const WATERFALL_SIZES = [16, 24, 32, 48, 64, 80];

export default function TypeTesterPage({ fonts = [], totalFonts = 0 }) {
  // Font selection
  const [selectedFontSlug, setSelectedFontSlug] = useState(fonts[0]?.slug || "");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Typography controls
  const [text, setText] = useState(SAMPLE_TEXTS[0].value);
  const [fontSize, setFontSize] = useState(42);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [textColor, setTextColor] = useState("#f3f4f6");
  const [bgColor, setBgColor] = useState("#161824");

  // Sync background/text colors on theme toggle
  useEffect(() => {
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains("light");
      setTextColor(isLight ? "#111827" : "#f3f4f6");
      setBgColor(isLight ? "#ffffff" : "#161824");
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Modes
  const [waterfallMode, setWaterfallMode] = useState(false);
  const [paragraphMode, setParagraphMode] = useState(false);

  const filteredFonts = useMemo(() => {
    return fonts.filter((f) => {
      const matchesSearch = (f.name + (f.banglaName || "")).toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedCategory === "ALL") return matchesSearch;
      return matchesSearch && f.style === selectedCategory;
    });
  }, [fonts, searchQuery, selectedCategory]);

  const selectedFont = fonts.find((f) => f.slug === selectedFontSlug) || fonts[0];

  const fontFamily = (selectedFont?.previewImageUrl || selectedFont?.fontFileUrl)
    ? `'font-tester-${selectedFont.slug}', sans-serif`
    : "inherit";

  const sharedTextStyle = {
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
    wordSpacing: `${wordSpacing}px`,
    textAlign: textAlign,
    fontWeight: isBold ? "bold" : "normal",
    fontFamily: fontFamily,
    color: textColor,
  };

  const displayText = paragraphMode ? SAMPLE_TEXTS[5].value : text;

  const uniqueStyles = useMemo(() => {
    const set = new Set(fonts.map(f => f.style));
    return set.size;
  }, [fonts]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Dynamic @font-face rules */}
      {fonts.map((f) => {
        const url = f.previewImageUrl || f.fontFileUrl;
        return url ? (
          <style key={f.slug} dangerouslySetInnerHTML={{ __html: `
            @font-face {
              font-family: 'font-tester-${f.slug}';
              src: url('${url}');
              font-display: swap;
            }
          `}} />
        ) : null;
      })}
      {/* ① Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00e599] to-emerald-400 flex items-center justify-center text-gray-955 shadow-[0_0_20px_rgba(0,229,153,0.25)]">
              <IconEdit3 className="text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                টাইপ টেস্টার
                <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                আপনার পছন্দের ফন্ট নির্বাচন করুন এবং রিয়েল-টাইমে টেস্ট করুন
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-full bg-surface-card text-[#00e599] border border-border font-medium">
            {totalFonts.toLocaleString()} ফন্ট উপলব্ধ
          </span>
        </div>
      </div>

      {/* ② Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Main Type Tester Board */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Panel */}
          <div className="bg-surface-card border border-border rounded-2xl p-4 sm:p-5">
            {/* Row 1: Preset + Mode Toggles */}
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border">
              <select
                value={text}
                onChange={(e) => { setText(e.target.value); setParagraphMode(false); }}
                className="bg-surface text-foreground border border-border rounded-xl px-3 py-2 focus:outline-none focus:border-[#00e599]/60 text-xs cursor-pointer flex-shrink-0"
              >
                {SAMPLE_TEXTS.map((s) => (
                  <option key={s.label} value={s.value}>{s.label}</option>
                ))}
              </select>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => { setWaterfallMode(!waterfallMode); setParagraphMode(false); }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    waterfallMode
                      ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                      : "bg-surface text-text-muted border-border hover:text-foreground hover:bg-surface-card"
                  }`}
                >
                  ওয়াটারফল
                </button>
                <button
                  type="button"
                  onClick={() => { setParagraphMode(!paragraphMode); setWaterfallMode(false); }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    paragraphMode
                      ? "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                      : "bg-surface text-text-muted border-border hover:text-foreground hover:bg-surface-card"
                  }`}
                >
                  প্যারাগ্রাফ
                </button>
              </div>
            </div>

            {/* Row 2: Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-3 pt-4 pb-4 border-b border-border">
              {/* Font Size */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>সাইজ</span>
                  <span className="text-[#00e599] font-semibold">{fontSize}px</span>
                </div>
                <input
                  type="range" min="12" max="120" value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-[#00e599] cursor-pointer h-1.5 bg-surface rounded-lg appearance-none"
                />
              </div>

              {/* Letter Spacing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>স্পেসিং</span>
                  <span className="text-[#00e599] font-semibold">{letterSpacing}px</span>
                </div>
                <input
                  type="range" min="-5" max="30" value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-[#00e599] cursor-pointer h-1.5 bg-surface rounded-lg appearance-none"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>লাইন</span>
                  <span className="text-[#00e599] font-semibold">{lineHeight}</span>
                </div>
                <input
                  type="range" min="0.8" max="3" step="0.1" value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                  className="w-full accent-[#00e599] cursor-pointer h-1.5 bg-surface rounded-lg appearance-none"
                />
              </div>

              {/* Word Spacing */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-text-muted">
                  <span>শব্দ ফাঁক</span>
                  <span className="text-[#00e599] font-semibold">{wordSpacing}px</span>
                </div>
                <input
                  type="range" min="0" max="20" value={wordSpacing}
                  onChange={(e) => setWordSpacing(Number(e.target.value))}
                  className="w-full accent-[#00e599] cursor-pointer h-1.5 bg-surface rounded-lg appearance-none"
                />
              </div>
            </div>

            {/* Row 3: Alignment, Bold, Colors */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* Alignment Buttons */}
              <div className="flex items-center gap-1 bg-[#1d2030] border border-white/10 p-1 rounded-xl">
                {[
                  { val: "left", icon: "⫷" },
                  { val: "center", icon: "⫸" },
                  { val: "right", icon: "⫸" },
                  { val: "justify", icon: "☰" },
                ].map((a) => (
                  <button
                    key={a.val}
                    type="button"
                    onClick={() => setTextAlign(a.val)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      textAlign === a.val
                        ? "bg-[#00e599] text-gray-950 font-bold shadow-md shadow-[#00e599]/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    title={a.val}
                  >
                    {a.val === "left" && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2" rx="0.5"/><rect x="1" y="7" width="10" height="2" rx="0.5"/><rect x="1" y="12" width="14" height="2" rx="0.5"/></svg>
                    )}
                    {a.val === "center" && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2" rx="0.5"/><rect x="3" y="7" width="10" height="2" rx="0.5"/><rect x="1" y="12" width="14" height="2" rx="0.5"/></svg>
                    )}
                    {a.val === "right" && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2" rx="0.5"/><rect x="5" y="7" width="10" height="2" rx="0.5"/><rect x="1" y="12" width="14" height="2" rx="0.5"/></svg>
                    )}
                    {a.val === "justify" && (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2" rx="0.5"/><rect x="1" y="7" width="14" height="2" rx="0.5"/><rect x="1" y="12" width="14" height="2" rx="0.5"/></svg>
                    )}
                  </button>
                ))}
              </div>

              {/* Bold Toggle */}
              <button
                type="button"
                onClick={() => setIsBold(!isBold)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isBold
                    ? "bg-[#00e599] text-gray-950 border-[#00e599] shadow-md shadow-[#00e599]/20"
                    : "bg-[#1d2030] text-gray-400 border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                B
              </button>

              <div className="flex-1" />

              {/* Color Pickers */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-[11px] text-text-muted cursor-pointer">
                  <span>টেক্সট</span>
                  <div className="relative">
                    <div
                      className="w-7 h-7 rounded-lg border-2 border-border shadow-inner"
                      style={{ backgroundColor: textColor }}
                    />
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </label>

                <label className="flex items-center gap-2 text-[11px] text-text-muted cursor-pointer">
                  <span>ব্যাকগ্রাউন্ড</span>
                  <div className="relative">
                    <div
                      className="w-7 h-7 rounded-lg border-2 border-border shadow-inner"
                      style={{ backgroundColor: bgColor }}
                    />
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div
            className="border border-border rounded-2xl p-5 sm:p-8 min-h-[400px] transition-colors duration-300"
            style={{ backgroundColor: bgColor }}
          >
            {waterfallMode ? (
              /* Waterfall Mode */
              <div className="space-y-6">
                {WATERFALL_SIZES.map((size) => (
                  <div key={size} className="border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
                    <span className="text-[10px] text-text-muted font-mono mb-1 block">{size}px</span>
                    <p
                      style={{ ...sharedTextStyle, fontSize: `${size}px` }}
                      className="break-words"
                    >
                      {displayText}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              /* Normal / Paragraph Mode */
              <textarea
                value={displayText}
                onChange={(e) => { if (!paragraphMode) setText(e.target.value); }}
                readOnly={paragraphMode}
                placeholder="এখানে আপনার পছন্দের টেক্সট লিখুন..."
                className="w-full min-h-[350px] resize-none border-none outline-none focus:outline-none placeholder-gray-600 bg-transparent"
                style={{ ...sharedTextStyle, fontSize: `${fontSize}px` }}
              />
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-[#12141f] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedFont && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e599]/20 to-emerald-500/10 flex items-center justify-center">
                    <IconType className="text-sm text-[#00e599]" />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium text-white"
                      style={{ fontFamily }}
                    >
                      {selectedFont.banglaName || selectedFont.name}
                    </p>
                    <p className="text-[10px] text-gray-500">{selectedFont.style || "General"}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={selectedFont ? `/free-font/${selectedFont.slug}` : "#"}
                className="px-4 py-2 bg-[#1d2030] text-gray-300 text-xs font-medium rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all"
              >
                বিস্তারিত দেখুন
              </Link>
              {selectedFont && (
                <a
                  href={selectedFont.fontFileUrl || `/free-font/${selectedFont.slug}`}
                  download
                  className="px-5 py-2 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/15 flex items-center gap-2"
                >
                  <IconDownload className="text-sm" />
                  ডাউনলোড
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Font Selector Panel */}
        <div className="lg:col-span-4 bg-surface-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]">
          {/* Search */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ফন্ট খুঁজুন..."
              className="w-full bg-surface border border-border text-foreground text-xs pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#00e599]/60 placeholder-text-muted/60 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-border/50">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? "bg-[#00e599] text-gray-955 font-bold shadow-md shadow-[#00e599]/15"
                    : "bg-surface text-text-muted hover:text-foreground hover:bg-surface-card border border-border/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Font Count */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] text-text-muted">{filteredFonts.length} ফন্ট পাওয়া গেছে</span>
          </div>

          {/* Font List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[300px] max-h-[500px] lg:max-h-none">
            {filteredFonts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                  <IconType className="text-lg text-text-muted" />
                </div>
                <p className="text-xs text-text-muted">কোনো ফন্ট পাওয়া যায়নি।</p>
              </div>
            ) : (
              filteredFonts.map((f) => {
                const fUrl = f.previewImageUrl || f.fontFileUrl;
                const fFamily = fUrl ? `'font-tester-${f.slug}', sans-serif` : "inherit";
                const isActive = selectedFontSlug === f.slug;

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFontSlug(f.slug)}
                    className={`group/item p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "border-[#00e599]/60 bg-[#00e599]/10 shadow-[0_0_15px_rgba(0,229,153,0.08)]"
                        : "border-border bg-surface hover:bg-surface-card hover:border-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-sm font-medium truncate block ${isActive ? "text-[#00e599] font-semibold" : "text-foreground"}`}
                          style={{ fontFamily: fFamily }}
                        >
                          {f.banglaName || f.name}
                        </span>
                        <span className="text-[10px] text-text-muted mt-0.5 block">{f.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-[#00e599]/20 text-[#00e599]"
                            : "bg-surface text-text-muted border border-border"
                        }`}>
                          {f.style || "GENERAL"}
                        </span>
                        <Link
                          href={`/free-font/${f.slug}`}
                          className="text-[10px] text-[#00e599] hover:underline flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconArrowRight className="text-xs" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ④ Bottom Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Total Fonts Card */}
        <div className="bg-surface-card border border-border rounded-2xl p-5 text-center relative overflow-hidden group hover:border-[#00e599]/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00e599]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#00e599]/10 flex items-center justify-center mx-auto mb-3">
              <IconType className="text-lg text-[#00e599]" />
            </div>
            <p className="text-2xl font-bold text-foreground">{totalFonts.toLocaleString()}</p>
            <p className="text-[11px] text-text-muted mt-1">মোট ফন্ট সংগ্রহ</p>
          </div>
        </div>

        {/* Styles Card */}
        <div className="bg-surface-card border border-border rounded-2xl p-5 text-center relative overflow-hidden group hover:border-purple-500/20 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
              <IconZap className="text-lg text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">{uniqueStyles}</p>
            <p className="text-[11px] text-text-muted mt-1">ফন্ট স্টাইল উপলব্ধ</p>
          </div>
        </div>

        {/* Pro CTA Card */}
        <Link
          href="/premium-font"
          className="bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-surface-card border border-purple-500/20 rounded-2xl p-5 text-center relative overflow-hidden group hover:border-purple-500/30 transition-all block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <IconCrown className="text-lg text-purple-400" />
            </div>
            <p className="text-sm font-bold text-foreground">প্রো ফন্ট ট্রাই করুন</p>
            <p className="text-[11px] text-text-muted mt-1 flex items-center justify-center gap-1">
              প্রিমিয়াম কালেকশন দেখুন <IconArrowRight className="text-xs text-purple-400" />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
