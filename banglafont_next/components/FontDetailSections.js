"use client";

import { useState } from "react";

export function FontPreviews() {
  return (
    <div className="bg-white border border-border rounded-2xl p-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* 16px Preview */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">১৬ পিক্সেল প্রিভিউ</h3>
          <p className="text-[16px] leading-relaxed text-gray-800 font-normal">
            তোমাদের মধ্যে যারা মর্যাদা ও প্রাচুর্যের অধিকারী তারা যেন শপথ না করে যে, তারা আত্মীয়-স্বজন, মিসকীন এবং আল্লাহর পথে হিজরতকারীদেরকে সাহায্য করবে না। তারা যেন তাদেরকে ক্ষমা করে ও তাদের ত্রুটি-বিচ্যুতি উপেক্ষা করে। তোমরা কি পছন্দ কর না যে, আল্লাহ তোমাদেরকে ক্ষমা করে দিন? আল্লাহ বড়ই ক্ষমাশীল, বড়ই দয়ালু।
          </p>
        </div>

        {/* 32px Preview */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">৩২ পিক্সেল প্রিভিউ</h3>
          <p className="text-[32px] leading-snug text-gray-900 font-normal">
            তারা ছাড়া, যারা তাওবা করেছে, শুধরে নিয়েছে এবং স্পষ্টভাবে বর্ণনা করেছে। অতএব, আমি তাদের তাওবা কবুল করব। আর আমি তাওবা কবুলকারী, পরম দয়ালু।
          </p>
        </div>
      </div>

      {/* 72px Preview */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-sm font-bold text-gray-800 mb-3">৭২ পিক্সেল প্রিভিউ</h3>
        <p className="text-[40px] sm:text-[56px] md:text-[72px] leading-tight text-gray-900 font-normal break-words">
          নিশ্চয় তোমার প্রতিপালক মহা পরাক্রমশালী, অতি দয়ালু।
        </p>
      </div>
    </div>
  );
}

export function TypeTesterInteractive({ fontName }) {
  const [text, setText] = useState("বাংলা লিখুন...");
  const [fontSize, setFontSize] = useState(32);
  const [theme, setTheme] = useState("light"); // "light" | "dark" | "custom"
  const [customBg, setCustomBg] = useState("#ffffff");
  const [customText, setCustomText] = useState("#111827");

  const getContainerStyle = () => {
    if (theme === "dark") {
      return { backgroundColor: "#0f0f11", color: "#ffffff", borderColor: "#1f2937" };
    }
    if (theme === "light") {
      return { backgroundColor: "#f9fafb", color: "#111827", borderColor: "#e5e7eb" };
    }
    return { backgroundColor: customBg, color: customText };
  };

  return (
    <div className="bg-white text-gray-900 border border-border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
      {/* Header / Title */}
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
        <span className="text-primary font-bold">T</span>
        <span>টাইপ টেস্টার</span>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Input box */}
        <div className="flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="বাংলা লিখুন..."
            className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary transition-colors text-sm"
          />
        </div>

        {/* Font size slider */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="16"
            max="96"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-32 accent-primary cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
          />
          <span className="text-xs text-gray-500 font-mono w-8">{fontSize}px</span>
        </div>
      </div>

      {/* Theme selector */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs text-gray-500 font-medium">Background:</span>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            theme === "dark"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
          }`}
        >
          <span>🌙</span> Dark
        </button>
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            theme === "light"
              ? "bg-primary text-white border-primary"
              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
          }`}
        >
          <span>☀️</span> Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("custom")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            theme === "custom"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
          }`}
        >
          <span>🎨</span> Custom
        </button>

        {theme === "custom" && (
          <div className="flex items-center gap-3 ml-2 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
            <label className="flex items-center gap-1 text-xs text-gray-600">
              Bg:
              <input
                type="color"
                value={customBg}
                onChange={(e) => setCustomBg(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-600">
              Text:
              <input
                type="color"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>
          </div>
        )}
      </div>

      {/* Dynamic Preview Area */}
      <div
        className="rounded-xl p-8 border min-h-[160px] flex items-center transition-all duration-200 overflow-x-auto"
        style={getContainerStyle()}
      >
        <p
          className="leading-snug break-words w-full"
          style={{ fontSize: `${fontSize}px` }}
        >
          {text || "বাংলা লিখুন..."}
        </p>
      </div>
    </div>
  );
}
