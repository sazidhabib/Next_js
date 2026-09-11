"use client";

import { useState, useRef } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import Features from "./Features";
import SupportedPlatforms from "./SupportedPlatforms";
import HowItWorks from "./HowItWorks";
import SEOContent from "./SEOContent";
import Footer from "./Footer";

export default function PlatformPageClient({ platformName }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleHeaderPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (inputRef.current) {
        inputRef.current.value = text;
        inputRef.current.focus();
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header onPasteUrl={handleHeaderPaste} />
      <main className="flex-1">
        <HeroSection
          inputRef={inputRef}
          result={result}
          loading={loading}
          error={error}
          onClose={() => setResult(null)}
          onResult={setResult}
          onLoading={setLoading}
          onError={setError}
          platformName={platformName}
        />

        <Features />
        <SupportedPlatforms />
        <HowItWorks />
        <SEOContent platformName={platformName} />
      </main>
      <Footer />
    </div>
  );
}

