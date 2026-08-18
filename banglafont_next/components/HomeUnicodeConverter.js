"use client";

import { useState, useEffect } from "react";
import { unicodeToAnsi, ansiToUnicode } from "../lib/banglaConverter";

export default function HomeUnicodeConverter() {
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
    <div className="bg-[#12141f] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Unicode to ANSI কনভার্টার</h3>
            <span className="w-2 h-2 rounded-full bg-[#00e599]" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ইউনিকোড টেক্সটকে ANSI (বিজয়) ফরম্যাটে এবং ANSI টেক্সটকে ইউনিকোড ফরম্যাটে কনভার্ট করুন।
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("unicode-to-ansi"); setOutput(""); }}
            className={`px-4 py-1.5 rounded-xl font-medium text-xs transition-colors ${
              mode === "unicode-to-ansi"
                ? "bg-[#00e599] text-gray-950"
                : "bg-[#161824] text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            Unicode → ANSI
          </button>
          <button
            onClick={() => { setMode("ansi-to-unicode"); setOutput(""); }}
            className={`px-4 py-1.5 rounded-xl font-medium text-xs transition-colors ${
              mode === "ansi-to-unicode"
                ? "bg-[#00e599] text-gray-950"
                : "bg-[#161824] text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            ANSI → Unicode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-gray-400">
              {mode === "unicode-to-ansi" ? "ইউনিকোড টেক্সট ইনপুট" : "ANSI টেক্সট ইনপুট"}
            </label>
            <span className="text-[10px] text-gray-500">টাইপ করলেই অটো কনভার্ট হবে</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full bg-[#161824] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00e599]/60 placeholder-gray-500 resize-y"
            placeholder="আপনার টেক্সট এখানে লিখুন..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-gray-400">
              {mode === "unicode-to-ansi" ? "ANSI টেক্সট আউটপুট" : "ইউনিকোড টেক্সট আউটপুট"}
            </label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-[10px] text-[#00e599] hover:underline transition-colors"
              >
                {copied ? "কপি করা হয়েছে!" : "কপি করুন"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            rows={6}
            className={`w-full border rounded-xl p-3 text-sm text-white placeholder-gray-600 resize-y cursor-default transition-all ${
              output 
                ? "bg-[#161824] border-[#00e599]/35" 
                : "bg-[#161824]/40 border-white/5"
            }`}
            placeholder="আউটপুট এখানে দেখা যাবে..."
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={clearAll}
          className="px-4 py-2 border border-white/10 text-gray-400 rounded-xl text-xs font-medium hover:bg-white/5 hover:text-white transition-colors"
        >
          ক্লিয়ার
        </button>
      </div>
    </div>
  );
}
