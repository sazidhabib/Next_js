"use client";

import { useState } from "react";
import Link from "next/link";

export default function DarkFontDetailPage({ font }) {
  const [activeTab, setActiveTab] = useState("Preview");
  const [previewText, setPreviewText] = useState("বাংলা ডিজাইন মানেই নান্দনিকতার ছোঁয়া");
  const [fontSize, setFontSize] = useState(64);
  const [selectedWeight, setSelectedWeight] = useState("Bold");

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
    { code: "dlig", label: "Discretionary Ligatures", desc: "Stylistic connected forms" },
    { code: "ksh", label: "Contextual Alternates", desc: "Smart contextual glyphs" },
    { code: "ss01", label: "Stylistic Set 01", desc: "Alternate character set 1" },
    { code: "ss02", label: "Stylistic Set 02", desc: "Alternate character set 2" },
    { code: "frac", label: "Fractions", desc: "Mathematical fraction glyphs" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>&rsaquo;</span>
        <Link href="/free-fonts" className="hover:text-white">Fonts</Link>
        <span>&rsaquo;</span>
        <span className="text-[#00e599] font-medium">{font.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Section */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Hero Header Card */}
          <div className="bg-[#121420] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                  {isPro ? "Pro" : "Free"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs border border-white/10">
                  {font.style || "Display"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-400">
                <span>⭐ 4.9</span>
                <span className="text-gray-500">(128 reviews)</span>
              </div>
            </div>

            {/* Giant Font Title Display */}
            <div className="py-6 border-y border-white/10 my-4 text-center sm:text-left">
              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
                বাংলা টাইপোগ্রাফি <br />
                <span className="bg-gradient-to-r from-teal-300 via-[#00e599] to-emerald-400 bg-clip-text text-transparent">
                  একটি শিল্পময় অভিজ্ঞতা
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-4 max-w-xl leading-relaxed">
                {font.description || `${font.name} একটি আধুনিক ও নান্দনিক বাংলা টাইপফেস। ডিজাইনে রয়েছে শক্তিশালী গঠন, ভারসাম্যপূর্ণ স্ট্রোক এবং চমৎকার পাঠযোগ্যতা।`}
              </p>
            </div>

            {/* Designer By Line */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00e599] to-teal-500 flex items-center justify-center text-gray-950 font-bold text-base">
                  {font.designer?.name?.charAt(0) || "B"}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{font.designer?.name || "BanglaType Foundry"}</span>
                    <span className="text-[#00e599] text-xs">✓</span>
                  </div>
                  <div className="text-[10px] text-gray-500">by Solaiman Studios</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white">
                  🤍
                </button>
                <button type="button" className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white">
                  🔗
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Preview, Glyphs, Features, License, Details) */}
          <div className="border-b border-white/10 flex gap-6 text-sm font-semibold text-gray-400">
            {["Preview", "Glyphs", "Features", "License", "Details"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 transition-all relative ${
                  activeTab === tab
                    ? "text-[#00e599] font-bold"
                    : "hover:text-white"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00e599] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Live Type Preview Controls */}
          <div className="bg-[#121420] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full sm:flex-1 bg-[#181a28] text-sm text-white placeholder-gray-500 px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#00e599]"
              />

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-32 accent-[#00e599] cursor-pointer h-1.5 bg-gray-700 rounded-lg appearance-none"
                />
                <span className="text-xs font-mono text-gray-400 w-10">{fontSize}px</span>
              </div>
            </div>

            {/* Weights Selector Cards */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Font Weights</div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {fontWeights.map((w) => (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => setSelectedWeight(w.label)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedWeight === w.label
                        ? "border-[#00e599] bg-[#00e599]/10 text-white font-bold"
                        : "border-white/5 bg-[#181a28] text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-1">{w.sample}</div>
                    <div className="text-[10px] truncate">{w.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Large Preview Canvas */}
            <div className="bg-[#171a28] rounded-xl p-8 border border-white/5 min-h-[160px] flex items-center overflow-x-auto">
              <p
                className="text-white leading-tight break-words w-full"
                style={{ fontSize: `${fontSize}px` }}
              >
                {previewText || font.name}
              </p>
            </div>
          </div>

          {/* Glyphs Character Map Section */}
          <div className="bg-[#121420] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Character Map</h3>
              <span className="text-xs text-gray-400">Explore all characters in this font</span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {glyphChars.map((ch) => (
                <div
                  key={ch}
                  className="aspect-square flex items-center justify-center bg-[#181a28] border border-white/5 rounded-xl text-xl text-gray-200 hover:border-[#00e599] hover:text-[#00e599] transition-all cursor-pointer"
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>

          {/* OpenType Features Grid */}
          <div className="bg-[#121420] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">OpenType Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {opentypeFeatures.map((f) => (
                <div key={f.code} className="p-3 bg-[#181a28] border border-white/5 rounded-xl">
                  <div className="text-xs font-bold text-[#00e599] font-mono">{f.code}</div>
                  <div className="text-xs font-medium text-gray-200 mt-1">{f.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Purchase & Sidebar matching Screenshot 2 & 5 */}
        <div className="lg:col-span-4 space-y-6">
          {/* License & Purchase Card */}
          <div className="bg-[#121420] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-gray-400 block">Select License</span>
                <span className="text-2xl font-bold text-white">{priceDisplay}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
                {isPro ? "Pro License" : "Free License"}
              </span>
            </div>

            {/* License Features List */}
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-center gap-2 text-[#00e599]">
                ✓ <span>Lifetime Usage</span>
              </li>
              <li className="flex items-center gap-2 text-[#00e599]">
                ✓ <span>1 User License</span>
              </li>
              <li className="flex items-center gap-2 text-[#00e599]">
                ✓ <span>Desktop & Webfont Included</span>
              </li>
            </ul>

            {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              {isPro ? (
                <Link
                  href={`/checkout?font=${font.slug}`}
                  className="block w-full py-3.5 bg-[#00e599] text-gray-950 font-bold text-sm text-center rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/20"
                >
                  🛒 Add to Cart
                </Link>
              ) : (
                <a
                  href={font.fontFileUrl}
                  download
                  className="block w-full py-3.5 bg-[#00e599] text-gray-950 font-bold text-sm text-center rounded-xl hover:bg-[#00c784] transition-colors shadow-lg shadow-[#00e599]/20"
                >
                  📥 Download Free Font
                </a>
              )}

              <button
                type="button"
                className="w-full py-3 bg-[#181a28] text-white font-semibold text-xs rounded-xl border border-white/10 hover:border-white/30 transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Additional Font Info Metadata */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Designer:</span>
                <span className="text-gray-200 font-medium">{font.designer?.name || "BanglaType"}</span>
              </div>
              <div className="flex justify-between">
                <span>Released:</span>
                <span className="text-gray-200 font-medium">May 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="text-gray-200 font-medium">OTF, TTF, WOFF2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
