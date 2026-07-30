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
  "স": "Ï", "হ": "Ð", "ড়": "Ñ", "ঢ়": "Ò", "য়": "Ó",
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Unicode to ANSI কনভার্টার</h1>
      <p className="text-gray-500 mb-8">
        ইউনিকোড টেক্সটকে ANSI (বিজয়) ফরম্যাটে এবং ANSI টেক্সটকে ইউনিকোড ফরম্যাটে কনভার্ট করুন।
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { setMode("unicode-to-ansi"); setOutput(""); }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === "unicode-to-ansi"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Unicode → ANSI
        </button>
        <button
          onClick={() => { setMode("ansi-to-unicode"); setOutput(""); }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            mode === "ansi-to-unicode"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ANSI → Unicode
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === "unicode-to-ansi" ? "ইউনিকোড টেক্সট" : "ANSI টেক্সট"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="w-full border border-border rounded-xl p-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="আপনার টেক্সট এখানে লিখুন..."
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={convert}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            কনভার্ট করুন
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-3 border border-border text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            ক্লিয়ার
          </button>
        </div>

        {output && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === "unicode-to-ansi" ? "ANSI টেক্সট" : "ইউনিকোড টেক্সট"}
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                rows={6}
                className="w-full border border-border rounded-xl p-4 text-lg bg-gray-50"
              />
              <button
                onClick={copyOutput}
                className="absolute top-3 right-3 px-4 py-1.5 bg-white border border-border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
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
