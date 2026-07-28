"use client";

import { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import DownloadResult from "./DownloadResult";
import SupportedPlatforms from "./SupportedPlatforms";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import SEOContent from "./SEOContent";
import Footer from "./Footer";

export default function PlatformPageClient({ platformName }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection
          onResult={setResult}
          onLoading={setLoading}
          onError={setError}
          platformName={platformName}
        />

        {/* Loading State */}
        {loading && (
          <section className="bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg ring-1 ring-gray-100">
                <svg className="h-5 w-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Fetching video information...</span>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="bg-gradient-to-b from-blue-50 to-white py-12">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-red-50 px-6 py-4 shadow-sm ring-1 ring-red-100">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="text-sm font-medium text-red-700">{error}</span>
              </div>
            </div>
          </section>
        )}

        {/* Download Result */}
        {result && !loading && (
          <DownloadResult result={result} onClose={() => setResult(null)} />
        )}

        <SupportedPlatforms />
        <HowItWorks />
        <Features />
        <SEOContent platformName={platformName} />
      </main>
      <Footer />
    </div>
  );
}
