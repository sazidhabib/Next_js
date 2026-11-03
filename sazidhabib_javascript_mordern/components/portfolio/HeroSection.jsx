"use client";

import { FiArrowDown, FiMail, FiExternalLink, FiCode } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio.config";

export default function HeroSection() {
  const { profile, stats } = portfolioConfig;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 30,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="top" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Availability pill */}
        <div className="flex items-center justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/20 shadow-inner backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-300 tracking-wide">
              {profile.availability.status === "open"
                ? profile.availability.openLabel
                : profile.availability.busyLabel}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">{profile.location}</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 font-mono">
            <FiCode className="text-cyan-400" />
            <span>{profile.role}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Designing & engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              scalable Next.js
            </span>{" "}
            and full-stack web products.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed pt-2">
            {profile.tagline}
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-8 pb-12">
          <button
            onClick={() => scrollTo("work")}
            className="px-6 py-3 rounded-full text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-200 transition-all duration-200 shadow-lg shadow-white/10 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Explore Selected Work</span>
            <FiArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <FiMail className="w-4 h-4 text-cyan-400" />
            <span>Get in Touch</span>
          </button>
          <a
            href="https://github.com/sazidhabib"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>GitHub Profile</span>
            <FiExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-1 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
