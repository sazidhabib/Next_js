"use client";

import { useState, useEffect } from "react";
import { unicodeToAnsi, ansiToUnicode } from "../lib/banglaConverter";

export default function HomeUnicodeConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("unicode-to-ansi");
  const [copied, setCopied] = useState(false);

  const output = !input
    ? ""
    : mode === "unicode-to-ansi"
    ? unicodeToAnsi(input)
    : ansiToUnicode(input);

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
  }

  return (
    <div className="bg-surface-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-foreground tracking-tight">Unicode to ANSI কনভার্টার</h3>
            <span className="w-2 h-2 rounded-full bg-[#00e599]" />
          </div>
          <p className="text-xs text-text-muted mt-1">
            ইউনিকোড টেক্সটকে ANSI (বিজয়) ফরম্যাটে এবং ANSI টেক্সটকে ইউনিকোড ফরম্যাটে কনভার্ট করুন।
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("unicode-to-ansi")}
            className={`px-4 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
              mode === "unicode-to-ansi"
                ? "bg-[#00e599] text-gray-955 font-bold"
                : "bg-surface text-text-muted border border-border hover:text-foreground hover:bg-surface-card"
            }`}
          >
            Unicode → ANSI
          </button>
          <button
            onClick={() => setMode("ansi-to-unicode")}
            className={`px-4 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
              mode === "ansi-to-unicode"
                ? "bg-[#00e599] text-gray-955 font-bold"
                : "bg-surface text-text-muted border border-border hover:text-foreground hover:bg-surface-card"
            }`}
          >
            ANSI → Unicode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-text-muted">
              {mode === "unicode-to-ansi" ? "ইউনিকোড টেক্সট ইনপুট" : "ANSI টেক্সট ইনপুট"}
            </label>
            <span className="text-[10px] text-text-muted">টাইপ করলেই অটো কনভার্ট হবে</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full bg-surface border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-[#00e599]/60 placeholder-text-muted/60 resize-y"
            placeholder="আপনার টেক্সট এখানে লিখুন..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-medium text-text-muted">
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
            className={`w-full border rounded-xl p-3 text-sm text-foreground placeholder-text-muted/60 resize-y cursor-default transition-all ${
              output 
                ? "bg-surface border-[#00e599]/35" 
                : "bg-surface/50 border-border"
            }`}
            placeholder="আউটপুট এখানে দেখা যাবে..."
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={clearAll}
          className="px-4 py-2 border border-border text-text-muted rounded-xl text-xs font-medium hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
        >
          ক্লিয়ার
        </button>
      </div>
    </div>
  );
}
