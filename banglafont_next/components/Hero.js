"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IconSparkles,
  IconSearch,
  IconArrowRight,
  IconSlidersHorizontal,
  IconDiamond,
  IconCpu,
  IconMonitor,
  IconShield
} from "./Icons";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState("dark");

  const darkSlides = [
    "/slider/slider1.png",
    "/slider/slider2.png",
    "/slider/slider3.png",
    "/slider/slider4.png",
    "/slider/slider5.png",
  ];

  const lightSlides = [
    "/slider/lightslide1.png",
    "/slider/lightslide2.png",
    "/slider/lightslide3.png",
    "/slider/lightslide4.png",
    "/slider/lightslide5.jpeg",
  ];

  const slides = theme === "light" ? lightSlides : darkSlides;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("light") ? "light" : "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const categories = [
    { label: "All Fonts", active: true },
    { label: "Sans-Serif" },
    { label: "Serif" },
    { label: "Display" },
    { label: "Handwritten" },
    { label: "Monospace" },
  ];

  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-surface via-surface-card to-background border border-border p-4 sm:p-6 md:p-10 overflow-hidden shadow-2xl">
      {/* Glow orb in background */}
      <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-[#00e599]/10 blur-[80px] sm:blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/3 w-40 sm:w-80 h-40 sm:h-80 bg-purple-600/10 blur-[60px] sm:blur-[100px] pointer-events-none rounded-full" />

      {/* Absolute Background Slider */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[100%] pointer-events-none z-0 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Smooth black gradient fade on the left to merge under text */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-surface via-surface-card/80 to-transparent z-10 hidden lg:block" />

          {slides.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-right transition-opacity duration-1000 ${index === currentSlide ? "opacity-60" : "opacity-0"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Column: Heading & Controls */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border text-[10px] sm:text-xs text-[#00e599] font-medium">
              <IconSparkles />
              <span>Next Generation Typography</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              বাংলা ফন্ট <br />
              <span className="bg-gradient-to-r from-[#00e599] via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                টাইপোগ্রাফির নতুন দিগন্ত
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-text-muted max-w-xl leading-relaxed">
              প্রিমিয়াম বাংলা ফন্টের বিশাল সংগ্রহ। ডিজাইন, ব্র্যান্ডিং, প্রকাশনা এবং ব্যক্তিগত ব্যবহারের জন্য সেরা টাইপোগ্রাফি সমাধান।
            </p>

            {/* Hero Search Box */}
            <div className="relative max-w-xl">
              <div className="flex items-center justify-between gap-2 sm:gap-4 bg-surface/80 border border-border rounded-xl sm:rounded-2xl pl-3 sm:pl-4 pr-2 py-2 focus-within:border-[#00e599]/60 transition-all shadow-inner">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <IconSearch className="text-text-muted text-base sm:text-lg shrink-0" />
                  <input
                    type="text"
                    placeholder="Search fonts, foundry or styles..."
                    className="bg-transparent text-xs sm:text-sm text-foreground placeholder-text-muted/65 outline-none w-full min-w-0"
                  />
                </div>
                <Link
                  href="/free-fonts"
                  className="flex items-center gap-1.5 sm:gap-2.5 hover:text-[#00e599] transition-all text-[10px] sm:text-xs font-semibold text-text-muted shrink-0"
                >
                  <span className="hidden sm:inline">Browse All Fonts</span>
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00e599] hover:bg-[#00c784] text-gray-955 flex items-center justify-center transition-all">
                    <IconArrowRight className="text-xs sm:text-sm" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 overflow-x-auto">
              {categories.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium border transition-all cursor-pointer shrink-0 ${c.active
                      ? "bg-[#00e599] text-gray-955 border-[#00e599] font-semibold"
                      : "bg-surface text-text-muted border-border hover:text-foreground hover:bg-surface-card"
                    }`}
                >
                  {c.label}
                </button>
              ))}
              <button
                type="button"
                className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium border bg-transparent border-border text-text-muted hover:text-foreground hover:bg-surface-card transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <IconSlidersHorizontal className="text-xs sm:text-sm" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Right Column: Empty spacer to reserve space for background visual on desktop & contain dots */}
          <div className="lg:col-span-4 relative h-20 sm:h-48 lg:h-[340px] flex items-end justify-center lg:justify-end">
            {/* Slider Indicators (Dots) */}
            <div className="flex justify-center items-center gap-1.5 bg-surface/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50 z-20 pointer-events-auto">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
                      ? "bg-[#00e599] w-3"
                      : "bg-foreground/30 hover:bg-foreground/50"
                    }`}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights Footer Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-border">
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-surface-card border border-border/50">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#00e599]/10 text-[#00e599] flex items-center justify-center text-sm sm:text-base shrink-0">
              <IconDiamond />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-foreground truncate">Premium Quality</div>
              <div className="text-[8px] sm:text-[10px] text-text-muted truncate">Handcrafted by expert type designers</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-surface-card border border-border/50">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm sm:text-base shrink-0">
              <IconCpu />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-foreground truncate">OpenType Features</div>
              <div className="text-[8px] sm:text-[10px] text-text-muted truncate">Ligatures, stylistic sets, and more</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-surface-card border border-border/50">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm sm:text-base shrink-0">
              <IconMonitor />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-foreground truncate">Multi-Platform</div>
              <div className="text-[8px] sm:text-[10px] text-text-muted truncate">Works on all devices and platforms</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-surface-card border border-border/50">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-sm sm:text-base shrink-0">
              <IconShield />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-bold text-foreground truncate">Secure & Licensed</div>
              <div className="text-[8px] sm:text-[10px] text-text-muted truncate">100% secure and licensed fonts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
