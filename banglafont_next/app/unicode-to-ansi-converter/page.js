"use client";

import { useState, useEffect } from "react";
import { unicodeToAnsi, ansiToUnicode } from "../../lib/banglaConverter";

export default function ConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("unicode-to-ansi");
  const [copied, setCopied] = useState(false);

  // Perform automatic real-time conversion as the user types
  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }
    runConversion();
  }, [input, mode]);

  function runConversion() {
    if (mode === "unicode-to-ansi") {
      setOutput(unicodeToAnsi(input));
    } else {
      setOutput(ansiToUnicode(input));
    }
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="text-center sm:text-left space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Unicode to ANSI কনভার্টার
          </h1>
          <span className="hidden sm:inline-block w-2.5 h-2.5 rounded-full bg-[#00e599] mt-2 animate-pulse" />
        </div>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
          ইউনিকোড টেক্সটকে সহজে ANSI (বিজয়) ফরম্যাটে এবং ANSI টেক্সটকে ইউনিকোড ফরম্যাটে কনভার্ট করুন। সম্পূর্ণ রিয়েল-টাইম এবং অফলাইন।
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#12141f] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
        {/* Toolbar & Mode Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex bg-[#161824] p-1 rounded-xl border border-white/10 self-start">
            <button
              onClick={() => { setMode("unicode-to-ansi"); setOutput(""); }}
              className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                mode === "unicode-to-ansi"
                  ? "bg-[#00e599] text-gray-950 shadow-lg shadow-[#00e599]/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Unicode → ANSI
            </button>
            <button
              onClick={() => { setMode("ansi-to-unicode"); setOutput(""); }}
              className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all ${
                mode === "ansi-to-unicode"
                  ? "bg-[#00e599] text-gray-950 shadow-lg shadow-[#00e599]/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              ANSI → Unicode
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              ক্লিয়ার করুন
            </button>
          </div>
        </div>

        {/* Workspace: Input & Output Side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Box */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs sm:text-sm font-bold text-gray-300 tracking-wide uppercase">
                {mode === "unicode-to-ansi" ? "ইউনিকোড টেক্সট (Input)" : "ANSI টেক্সট (Input)"}
              </label>
              <span className="text-[10px] text-gray-500">টাইপ করলেই অটো কনভার্ট হবে</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              className="w-full bg-[#161824] border border-white/10 rounded-2xl p-4 text-sm sm:text-base text-white focus:outline-none focus:border-[#00e599] focus:ring-1 focus:ring-[#00e599]/30 placeholder-gray-600 resize-y transition-all"
              placeholder="আপনার টেক্সট এখানে পেস্ট বা টাইপ করুন..."
            />
          </div>

          {/* Output Box */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs sm:text-sm font-bold text-gray-300 tracking-wide uppercase">
                {mode === "unicode-to-ansi" ? "ANSI টেক্সট (Output)" : "ইউনিকোড টেক্সট (Output)"}
              </label>
              {output && (
                <button
                  onClick={copyOutput}
                  className="px-3 py-1 bg-[#1d2030] border border-[#00e599]/30 hover:border-[#00e599] rounded-lg text-xs font-semibold text-[#00e599] hover:bg-[#00e599]/10 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                  </svg>
                  <span>{copied ? "কপি করা হয়েছে!" : "কপি করুন"}</span>
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              className={`w-full border rounded-2xl p-4 text-sm sm:text-base text-white placeholder-gray-700 resize-y cursor-default transition-all ${
                output 
                  ? "bg-[#161824] border-[#00e599]/35" 
                  : "bg-[#161824]/40 border-white/5"
              }`}
              placeholder="কনভার্ট করা ফলাফল এখানে দেখতে পাবেন..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
