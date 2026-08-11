"use client";

import { useState } from "react";

const UNICODE_TO_ANSI = {
  "অ": "¤", "আ": "¦", "ই": "§", "ঈ": "¨", "উ": "©", "ঊ": "ª",
  "ঋ": "«", "এ": "¬", "ঐ": "®", "ও": "¯", "ঔ": "°",
  "ক": "±", "খ": "²", "গ": "³", "ঘ": "´", "ঙ": "µ",
  "চ": "¶", "ছ": "·", "জ": "¸", "ঝ": "¹", "ঞ": "º",
  "ট": "»", "ঠ": "¼", "ড": "½", "ঢ": "¾", "ণ": "¿",
  "ত": "À", "থ": "Á", "দ": "Â", "ধ": "Ã", "ন": "Ä",
  "প": "Å", "ফ": "Æ", "ব": "Ç", "ভ": "È", "ম": "É",
  "য": "Ê", "র": "Ë", "ল": "Ì", "শ": "Í", "ষ": "Î",
  "স": "Ï", "হ": "Ð", "ড়": "Ñ", "ঢ়": "Ò", "য়": "Ó",
  "ৎ": "Ô", "ং": "Õ", "ঃ": "Ö", "ঁ": "×",
  "া": "Ø", "ি": "Ù", "ী": "Ú", "ু": "Û", "ূ": "Ü",
  "ৃ": "Ý", "ে": "Þ", "ৈ": "ß", "ো": "à", "ৌ": "á",
  "্": "â", "্য": "ã", "্র": "ä", "্র্য": "å",
  "১": "æ", "২": "ç", "৩": "è", "৪": "é", "৫": "ê",
  "৬": "ë", "৭": "ì", "৮": "í", "৯": "î", "০": "ï",
};

export default function ConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("unicode-to-ansi");

  function convert() {
    if (mode === "unicode-to-ansi") {
      let result = "";
      for (const ch of input) {
        result += UNICODE_TO_ANSI[ch] || ch;
      }
      setOutput(result);
    } else {
      const reverseMap = {};
      for (const [key, val] of Object.entries(UNICODE_TO_ANSI)) {
        reverseMap[val] = key;
      }
      let result = "";
      for (const ch of input) {
        result += reverseMap[ch] || ch;
      }
      setOutput(result);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = output;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Unicode to ANSI কনভার্টার</h1>
      <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
        ইউনিকোড টেক্সটকে ANSI (বিজয়) ফরম্যাটে এবং ANSI টেক্সটকে ইউনিকোড ফরম্যাটে কনভার্ট করুন।
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
        <button
          onClick={() => { setMode("unicode-to-ansi"); setOutput(""); }}
          className={`px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors ${mode === "unicode-to-ansi"
              ? "bg-[#00e599] text-gray-950"
              : "bg-[#161824] text-gray-400 border border-white/10 hover:text-white"
            }`}
        >
          Unicode → ANSI
        </button>
        <button
          onClick={() => { setMode("ansi-to-unicode"); setOutput(""); }}
          className={`px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors ${mode === "ansi-to-unicode"
              ? "bg-[#00e599] text-gray-950"
              : "bg-[#161824] text-gray-400 border border-white/10 hover:text-white"
            }`}
        >
          ANSI → Unicode
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
            {mode === "unicode-to-ansi" ? "ইউনিকোড টেক্সট" : "ANSI টেক্সট"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            className="w-full bg-[#161824] border border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-white focus:outline-none focus:border-[#00e599]/60 placeholder-gray-500"
            placeholder="আপনার টেক্সট এখানে লিখুন..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={convert}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#00e599] text-gray-950 rounded-xl font-semibold hover:bg-[#00c784] transition-colors text-sm"
          >
            কনভার্ট করুন
          </button>
          <button
            onClick={clearAll}
            className="px-4 sm:px-6 py-2.5 sm:py-3 border border-white/10 text-gray-400 rounded-xl font-medium hover:bg-white/5 hover:text-white transition-colors text-sm"
          >
            ক্লিয়ার
          </button>
        </div>

        {output && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              {mode === "unicode-to-ansi" ? "ANSI টেক্সট" : "ইউনিকোড টেক্সট"}
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                rows={5}
                className="w-full bg-[#161824] border border-white/10 rounded-xl p-3 sm:p-4 text-sm sm:text-base text-white"
              />
              <button
                onClick={copyOutput}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-[#1d2030] border border-white/10 rounded-lg text-[10px] sm:text-xs text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                কপি
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
