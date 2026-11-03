"use client";

import { FiArrowUp } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio.config";

export default function Footer() {
  const { profile } = portfolioConfig;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="py-12 border-t border-white/5 bg-[#050508] relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-sm font-bold text-white tracking-wide">
            {profile.name}
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {profile.role} · {profile.location}
          </div>
        </div>

        <div className="text-xs text-zinc-600 font-mono text-center">
          Designed with high taste · Inspired by hridoy.pro aesthetic
        </div>

        <div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

