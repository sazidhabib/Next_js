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

  const slides = [
    "/slider/slider1.png",
    "/slider/slider2.png",
    "/slider/slider3.png",
    "/slider/slider4.png",
    "/slider/slider5.png",
  ];

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
    <div className="relative rounded-3xl bg-gradient-to-br from-[#121422] via-[#0f111a] to-[#090a0f] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
      {/* Glow orb in background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e599]/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Absolute Background Slider */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[65%] pointer-events-none z-0 overflow-hidden">
        <div className="relative w-full h-full">
          {/* Smooth black gradient fade on the left to merge under text */}
          <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#121422] via-[#0f111a]/80 to-transparent z-10 hidden lg:block" />
          
          {slides.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-right transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-60" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Controls */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#00e599] font-medium">
              <IconSparkles />
              <span>Next Generation Typography</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              বাংলা ফন্ট <br />
              <span className="bg-gradient-to-r from-[#00e599] via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                টাইপোগ্রাফির নতুন দিগন্ত
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              প্রিমিয়াম বাংলা ফন্টের বিশাল সংগ্রহ। ডিজাইন, ব্র্যান্ডিং, প্রকাশনা এবং ব্যক্তিগত ব্যবহারের জন্য সেরা টাইপোগ্রাফি সমাধান।
            </p>

            {/* Hero Search Box */}
            <div className="relative max-w-xl">
              <div className="flex items-center justify-between gap-4 bg-[#131520]/80 border border-white/10 rounded-2xl pl-4 pr-2 py-2 focus-within:border-[#00e599]/60 transition-all shadow-inner">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <IconSearch className="text-gray-400 text-lg shrink-0" />
                  <input
                    type="text"
                    placeholder="Search fonts, foundry or styles..."
                    className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
                  />
                </div>
                <Link
                  href="/free-fonts"
                  className="flex items-center gap-2.5 hover:text-[#00e599] transition-all text-xs font-semibold text-gray-300 shrink-0"
                >
                  <span>Browse All Fonts</span>
                  <span className="w-8 h-8 rounded-full bg-[#00e599] hover:bg-[#00c784] text-gray-950 flex items-center justify-center transition-all">
                    <IconArrowRight className="text-sm" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {categories.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    c.active
                      ? "bg-[#00e599] text-gray-950 border-[#00e599] font-semibold"
                      : "bg-[#161824] text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium border bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <IconSlidersHorizontal className="text-sm" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Right Column: Empty spacer to reserve space for background visual on desktop & contain dots */}
          <div className="lg:col-span-4 relative h-32 sm:h-48 lg:h-[340px] flex items-end justify-center lg:justify-end">
            {/* Slider Indicators (Dots) */}
            <div className="flex justify-center items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 z-20 pointer-events-auto">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide
                      ? "bg-[#00e599] w-3"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  title={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Feature Highlights Footer Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-[#00e599]/10 text-[#00e599] flex items-center justify-center text-base">
              <IconDiamond />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Premium Quality</div>
              <div className="text-[10px] text-gray-400">Handcrafted by expert type designers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-base">
              <IconCpu />
            </div>
            <div>
              <div className="text-xs font-bold text-white">OpenType Features</div>
              <div className="text-[10px] text-gray-400">Ligatures, stylistic sets, and more</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-base">
              <IconMonitor />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Multi-Platform</div>
              <div className="text-[10px] text-gray-400">Works on all devices and platforms</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-base">
              <IconShield />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Secure & Licensed</div>
              <div className="text-[10px] text-gray-400">100% secure and licensed fonts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
