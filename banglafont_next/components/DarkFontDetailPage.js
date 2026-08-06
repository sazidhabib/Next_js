"use client";

import { useState, Suspense } from "react";
import Link from "next/link"; // Wait, Next.js import is "next/link", not "next/next"! Let's fix that.
import { useSearchParams } from "next/navigation";
import {
  IconStar,
  IconCheck,
  IconHeart,
  IconShare2,
  IconShoppingCart,
  IconDownload,
  IconArrowLeft,
  IconCrown,
  IconHelpCircle
} from "./Icons";

function FontDetailPageContent({ font, relatedFonts = [] }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams ? (searchParams.get("tab") || "Overview") : "Overview";
  const [previewText, setPreviewText] = useState("সুন্দর এবং পাঠযোগ্য বাংলা টাইপফেস");
  const [fontSize, setFontSize] = useState(64);
  const [selectedGlyph, setSelectedGlyph] = useState("অ");
  const [textMode, setTextMode] = useState("custom"); // "custom", "sample1", "sample2"

  const sampleText1 = `বিপদে মোরে রক্ষা করো এ নহে মোর প্রার্থনা–
বিপদে আমি না যেন করি ভয়।
দুঃখতাপে ব্যথিত চিতে নাই-বা দিলে সান্ত্বনা,
দুঃখে যেন করিতে পারি জয়॥
সহায় মোর না যদি জুটে নিজের বল না যেন টুটে,
সংসারেতে ঘটিলে ক্ষতি, লভিলে শুধু বঞ্চনা
নিজের মনে না যেন মানি ক্ষয়।
আমারে তুমি করিবে ত্রাণ এ নহে মোর প্রার্থনা–
তরিতে পারি শকতি যেন রয়।
আমার ভার লাঘব করি নাই-বা দিলে সান্ত্বনা,
বহিতে পারি এমনি যেন হয়।
নম্রশিরে সুখের দিনে তোমারি মুখ লইব চিনে–
দুখের রাতে নিখিল ধরা যেদিন করে বঞ্চনা
তোমারে যেন না করি সংশয়।`;
  const sampleText2 = "বাংলা টাইপোগ্রাফি ও ফন্ট ডিজাইনের ক্ষেত্রে এখন এক নতুন বিপ্লব চলছে। প্রযুক্তির অগ্রগতির সাথে সাথে ইন্টারনেটে ও বিভিন্ন ডিজিটাল প্ল্যাটফর্মে নান্দনিক বাংলা ফন্টের চাহিদা দিন দিন বৃদ্ধি পাচ্ছে। একটি মানসম্মত ফন্ট কেবল লেখাকে পড়ার যোগ্যই করে না, বরং পুরো ডিজাইনের সৌন্দর্য ও প্রকাশভঙ্গিকে এক নতুন উচ্চতায় নিয়ে যায়। আধুনিক ডিজাইনাররা প্রতিনিয়ত নতুন নতুন স্টাইল ও বৈচিত্র্য নিয়ে কাজ করছেন।";

  const getDisplayText = () => {
    if (textMode === "sample1") return sampleText1;
    if (textMode === "sample2") return sampleText2;
    return previewText || font.name;
  };

  const weightMap = {
    "ExtraLight": 200,
    "Light": 300,
    "Regular": 400,
    "Medium": 500,
    "SemiBold": 600,
    "Bold": 700,
    "ExtraBold": 800,
    "Black": 900
  };

  const [selectedWeight, setSelectedWeight] = useState(
    font.variants && font.variants.length > 0 ? font.variants[0].weight : "Regular"
  );

  const fontFam = `font-detail-preview-${font.id}`;
  const encodings = JSON.parse(font.encoding || "[]");
  const isPro = font.fontType === "PREMIUM";
  const priceDisplay = font.price ? `৳ ${font.price.toLocaleString("bn-BD")}` : "Free";

  const fontWeights = [
    { label: "ExtraLight", weight: 200, sample: "অ" },
    { label: "Light", weight: 300, sample: "অ" },
    { label: "Regular", weight: 400, sample: "অ" },
    { label: "Medium", weight: 500, sample: "অ" },
    { label: "SemiBold", weight: 600, sample: "অ" },
    { label: "Bold", weight: 700, sample: "অ" },
    { label: "ExtraBold", weight: 800, sample: "অ" },
    { label: "Black", weight: 900, sample: "অ" },
  ];

  const activeWeights = font.variants && font.variants.length > 0
    ? font.variants.map((v) => ({
      label: v.weight,
      weight: weightMap[v.weight] || 400,
      sample: "তা"
    }))
    : fontWeights;

  const glyphChars = [
    "অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ",
    "ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ",
    "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন",
    "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ", "স", "হ",
    "ড়", "ঢ়", "য়", "ৎ", "ং", "ঃ", "ঁ",
    "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "০",
  ];

  const opentypeFeatures = [
    { code: "liga", label: "Standard Ligatures", desc: "Automatic letter joins" },
    { code: "clig", label: "Contextual Ligatures", desc: "Smart contextual connections" },
    { code: "dlig", label: "Discretionary Ligatures", desc: "Stylistic connected forms" },
    { code: "ss01", label: "Stylistic Set 01", desc: "Alternate character set 1" },
    { code: "salt", label: "Stylistic Alternates", desc: "Alternate character set 2" },
    { code: "kern", label: "Kerning", desc: "Spacing adjustment between letters" },
  ];

  const previewFontUrl = font.previewImageUrl || font.fontFileUrl;
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-[#090a0f] text-gray-100 min-h-screen">
      {/* Load Fonts */}
      {font.variants && font.variants.length > 0 ? (
        <style dangerouslySetInnerHTML={{
          __html: font.variants.map((v) => `
          @font-face {
            font-family: '${fontFam}';
            src: url('${v.fileUrl}');
            font-weight: ${weightMap[v.weight] || 400};
            font-style: normal;
            font-display: swap;
          }
        `).join('\n')
        }} />
      ) : (
        previewFontUrl && (
          <style dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: '${fontFam}';
              src: url('${previewFontUrl}');
              font-display: swap;
            }
          `}} />
        )
      )}

      {/* Main Grid: 10 Columns (Left Sidebar is at global level) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">

        {/* ================= MIDDLE CONTENT PANEL (lg:col-span-7) ================= */}
        <div className="lg:col-span-7 space-y-8">

          {/* Main Hero Header Card */}
          <div className="bg-[#121420]/60 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-stretch gap-6">
            {/* Left side details */}
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>{font.designer?.name || "BanglaType"} Foundry</span>
                    <span className="text-emerald-400">✓</span>
                  </span>
                </div>

                <h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight"
                  style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit', fontWeight: weightMap[selectedWeight] || 400 }}
                >
                  {font.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
                  {font.detailsDescription || font.description}
                </p>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium text-gray-400">
                  {font.style || "Sans-Serif"}
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium text-gray-400">
                  {font.variants?.length || 1} Styles
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium text-gray-400">
                  {glyphChars.length} Glyphs
                </span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-medium text-gray-400">
                  OTF, TTF, WOFF2
                </span>
                <button type="button" className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors ml-auto">
                  <IconHeart className="text-xs" />
                </button>
              </div>
            </div>

            {/* Right side: Glowing 3D letter block */}
            <div className="w-full md:w-44 flex items-center justify-center shrink-0">
              <div className="w-full aspect-square md:h-full rounded-2xl bg-gradient-to-br from-[#1b2536] via-[#101321] to-[#0a0c16] border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                {/* 3D Glowing Orb Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-teal-500/20 opacity-70 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#00e599]/10 blur-2xl rounded-full" />
                <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-purple-500/10 blur-2xl rounded-full" />

                {/* Translucent Backdrop Layer */}
                <div className="absolute inset-2 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md" />

                {/* Giant Glyph Display */}
                <span
                  className="text-7xl font-bold bg-gradient-to-br from-teal-300 via-[#00e599] to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,229,153,0.3)] z-10 font-sans group-hover:scale-105 transition-transform duration-300 select-none"
                  style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit' }}
                >
                  হ
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Weight Preview & Type Tester (Shown on Overview or active weight selector) */}
          {(activeTab === "Overview" || activeTab === "Details") && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-6 space-y-6">
              {/* Type Tester Input Controls & Mode Selection */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => setTextMode("custom")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${textMode === "custom"
                      ? "bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20"
                      : "text-gray-400 hover:text-white border border-transparent"
                      }`}
                  >
                    Type Tester
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTextMode("sample1");
                      setFontSize(24);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${textMode === "sample1"
                      ? "bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20"
                      : "text-gray-400 hover:text-white border border-transparent"
                      }`}
                  >
                    Classical Prose (Tagore)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTextMode("sample2");
                      setFontSize(24);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${textMode === "sample2"
                      ? "bg-[#00e599]/10 text-[#00e599] border border-[#00e599]/20"
                      : "text-gray-400 hover:text-white border border-transparent"
                      }`}
                  >
                    Modern Typography
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {textMode === "custom" ? (
                    <input
                      type="text"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                      className="w-full sm:flex-1 bg-[#181a28]/80 text-xs text-white placeholder-gray-500 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#00e599] transition-colors"
                      placeholder="এখানে আপনার টেক্সট লিখুন..."
                    />
                  ) : (
                    <div className="text-[10px] text-gray-500 italic select-none sm:flex-1 py-2">
                      Long prose sample preview active. Adjust font size and weight below.
                    </div>
                  )}

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-24 accent-[#00e599] cursor-pointer h-1 bg-gray-800 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono text-gray-400 w-10">{fontSize}px</span>
                  </div>
                </div>
              </div>

              {/* Weight Preview grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weight Preview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {activeWeights.map((w) => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setSelectedWeight(w.label)}
                      className={`p-3 rounded-xl border text-center transition-all duration-200 ${selectedWeight === w.label
                        ? "border-[#00e599] bg-[#00e599]/10 text-white font-bold"
                        : "border-white/5 bg-[#181a28]/60 text-gray-400 hover:border-white/20"
                        }`}
                    >
                      <div className="text-3xl mb-1 select-none" style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit', fontWeight: w.weight }}>{w.sample}</div>
                      <div className="text-[9px] text-gray-500 font-mono truncate">{w.weight} {w.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Large Preview Canvas */}
              <div className="bg-[#171a28]/60 rounded-xl p-8 border border-white/5 min-h-[160px] flex items-center overflow-x-auto">
                <p
                  className="text-white leading-relaxed break-words w-full whitespace-pre-wrap"
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit',
                    fontWeight: weightMap[selectedWeight] || 400
                  }}
                >
                  {getDisplayText()}
                </p>
              </div>
            </div>
          )}

          {/* ================= TABBED SECTIONS ================= */}

          {/* 1. Character Map (Glyphs) */}
          {(activeTab === "Overview" || activeTab === "Glyphs") && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Character Map</h3>
                  <p className="text-[10px] text-gray-500">Explore all characters in this font</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Left Preview Box */}
                <div className="md:col-span-4 flex items-center justify-center bg-dark hover:bg-dark/80 rounded-2xl p-8 min-h-[220px] transition-all border border-white/10 shadow-lg relative group overflow-hidden">
                  <div className="absolute top-2 left-3 text-[9px] font-bold text-gray-400 font-mono select-none">
                    PREVIEW
                  </div>
                  <span
                    className="text-8xl text-white font-normal select-none transition-transform duration-200 group-hover:scale-105"
                    style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit', fontWeight: weightMap[selectedWeight] || 400 }}
                  >
                    {selectedGlyph}
                  </span>
                </div>

                {/* Right Characters Grid */}
                <div className="md:col-span-8">
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {glyphChars.map((ch) => {
                      const active = selectedGlyph === ch;
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setSelectedGlyph(ch)}
                          className={`aspect-square flex items-center justify-center border rounded-xl text-lg transition-all duration-200 select-none ${active
                            ? "bg-[#00e599] text-gray-950 border-[#00e599] font-bold"
                            : "bg-[#181a28]/40 border-white/5 text-gray-300 hover:border-[#00e599] hover:text-[#00e599]"
                            }`}
                          style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit' }}
                        >
                          {ch}
                        </button>
                      );
                    })}
                    <div className="aspect-square flex flex-col items-center justify-center bg-[#181a28]/60 border border-white/5 hover:border-white/10 rounded-xl text-[10px] text-gray-500 font-bold transition-all cursor-pointer">
                      <span>+ More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. OpenType Features */}
          {(activeTab === "Overview" || activeTab === "Features") && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">OpenType Features</h3>
                <p className="text-[10px] text-gray-500">Smart features supported by this font file</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {opentypeFeatures.map((f) => (
                  <div key={f.code} className="p-3.5 bg-[#181a28]/50 border border-white/5 rounded-xl space-y-1">
                    <div className="text-xs font-bold text-[#00e599] font-mono">{f.code}</div>
                    <div className="text-xs font-medium text-gray-200">{f.label}</div>
                    <div className="text-[9px] text-gray-500 leading-normal">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Details tab */}
          {(activeTab === "Details") && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">About {font.name}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {font.description || `${font.name} একটি চমৎকার আধুনিক বাংলা টাইপফেস। এটি ডিজাইন করা হয়েছে ডিজিটাল ও প্রিন্ট মিডিয়ার চমৎকার ভিজ্যুয়ালের জন্য। এর পরিষ্কার লেটারফর্ম ও সুন্দর ড্রয়িং বাংলা ভাষার শৈল্পিকতাকে আরও ফুটিয়ে তোলে।`}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#181a28]/40 border border-white/5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block">Style</span>
                  <span className="text-xs font-semibold text-white">{font.style || "Display"}</span>
                </div>
                <div className="p-3 bg-[#181a28]/40 border border-white/5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block">Encoding</span>
                  <span className="text-xs font-semibold text-white">{encodings.join(", ") || "Unicode"}</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. License tab */}
          {(activeTab === "License") && (
            <div className="bg-[#121420]/60 border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">License Guidelines</h3>
              <div className="space-y-4 text-xs text-gray-300">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <span className="font-bold text-[#00e599]">General Terms</span>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    By downloading this font, you agree to the conditions defined under standard font delivery licenses. Use in layouts, digital presentations, logo prototypes, and websites is permitted under the personal-use terms unless upgraded to Pro.
                  </p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#00e599] mt-0.5">✓</span>
                    <span>Unlimited personal and commercial use allowed for Pro/Premium licensed fonts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00e599] mt-0.5">✓</span>
                    <span>Embedding in web applications via standard CSS @font-face rules.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✗</span>
                    <span>Reselling, distributing, or modifying font files directly is strictly prohibited.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* 5. Related Fonts tab / section */}
          {(activeTab === "Overview" || activeTab === "Related Fonts") && relatedFonts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Related Fonts</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedFonts.map((item) => {
                  const itemIsPro = item.fontType === "PREMIUM";
                  const itemPrice = item.price ? `৳ ${item.price}` : "Free";
                  return (
                    <Link
                      key={item.id}
                      href={`/free-font/${item.slug}`}
                      className="group p-4 bg-[#121420]/60 hover:bg-[#161826] border border-white/5 hover:border-[#00e599]/30 rounded-2xl flex flex-col justify-between transition-all duration-300"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-mono">{item.style || "Display"}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${itemIsPro ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-[#00e599]'}`}>
                            {itemIsPro ? "Pro" : "Free"}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#00e599] transition-colors">{item.name}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-[10px]">
                        <span className="text-gray-400">{item.designer?.name || "BanglaType"}</span>
                        <span className="text-[#00e599] font-bold">{itemPrice}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT SIDEBAR (lg:col-span-3) ================= */}
        <div className="lg:col-span-3 space-y-6">

          {/* License & Purchase Card */}
          <div className="bg-[#121420]/60 border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Select License</span>
                <span className="text-2xl font-bold text-white">{priceDisplay}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${isPro
                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                : "bg-emerald-500/20 text-[#00e599] border-emerald-500/30"
                }`}>
                {isPro ? "Pro" : "Free"}
              </span>
            </div>

            {/* License Features List */}
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2">
                <IconCheck className="text-[#00e599] text-xs" />
                <span>Lifetime Usage</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="text-[#00e599] text-xs" />
                <span>1 User License</span>
              </li>
              <li className="flex items-center gap-2">
                <IconCheck className="text-[#00e599] text-xs" />
                <span>Desktop & Webfont Included</span>
              </li>
            </ul>

            {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              {isPro ? (
                <Link
                  href={`/checkout?font=${font.slug}`}
                  className="w-full py-3 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/15 flex items-center justify-center gap-2"
                >
                  <IconShoppingCart className="text-sm" />
                  <span>Add to Cart</span>
                </Link>
              ) : (
                <a
                  href={font.fontFileUrl}
                  download
                  className="w-full py-3 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/15 flex items-center justify-center gap-2"
                >
                  <IconDownload className="text-sm" />
                  <span>Download Free Font</span>
                </a>
              )}

              <button
                type="button"
                className="w-full py-2.5 bg-[#181a28]/60 text-white font-semibold text-xs rounded-xl border border-white/5 hover:border-white/10 transition-all"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Font Info Metadata */}
            <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Font Info</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Designer:</span>
                  <span className="text-gray-200 font-medium">{font.designer?.name || "BanglaType"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Foundry:</span>
                  <span className="text-gray-200 font-medium">SutonnyMJ Foundry</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Released:</span>
                  <span className="text-gray-200 font-medium">May 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Version:</span>
                  <span className="text-gray-200 font-medium">1.002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Glyphs:</span>
                  <span className="text-gray-200 font-medium">{glyphChars.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format:</span>
                  <span className="text-gray-200 font-medium">OTF, TTF, WOFF2</span>
                </div>
              </div>
            </div>

            {/* Share Font Block */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Share Font</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-[10px] font-semibold transition-colors"
                >
                  {copySuccess ? "Link Copied!" : "Copy Link"}
                </button>
                <div className="flex items-center gap-1.5">
                  <button className="w-8 h-8 rounded-lg bg-[#181a28]/60 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-xs border border-white/5">
                    FB
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#181a28]/60 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-xs border border-white/5">
                    TW
                  </button>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="border-t border-white/5 pt-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[#00e599] flex items-center justify-center shrink-0">
                <IconHelpCircle className="text-sm" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-[11px] font-bold text-white">Need Help?</h5>
                <p className="text-[9px] text-gray-500 leading-normal">We're here to help you</p>
                <Link href="/contact" className="text-[9px] text-[#00e599] hover:underline font-semibold block pt-0.5">
                  Contact Support
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function DarkFontDetailPage(props) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading details...</div>}>
      <FontDetailPageContent {...props} />
    </Suspense>
  );
}
