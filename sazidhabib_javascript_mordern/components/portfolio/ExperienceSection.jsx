"use client";

import { useState } from "react";
import { FiCheckCircle, FiTrendingUp } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio.config";

export default function ExperienceSection() {
  const { experience } = portfolioConfig;
  const [viewMode, setViewMode] = useState("impact"); // 'standard' | 'impact'

  return (
    <section id="exp" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-medium">
              02 · Career Path
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Work Experience & Impact
            </h2>
          </div>

          {/* Toggle pill */}
          <div className="inline-flex p-1 rounded-full bg-zinc-900 border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setViewMode("standard")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                viewMode === "standard"
                  ? "bg-white text-zinc-900 shadow font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setViewMode("impact")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                viewMode === "impact"
                  ? "bg-cyan-500 text-zinc-950 shadow font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <FiTrendingUp className="w-3.5 h-3.5" />
              <span>Key Impact</span>
            </button>
          </div>
        </div>

        {/* Timeline rows */}
        <div className="space-y-4">
          {experience.map((item, idx) => (
            <div
              key={idx}
              className="group p-6 sm:p-7 rounded-2xl bg-zinc-900/35 border border-white/5 hover:border-white/15 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-sm font-mono text-zinc-400">{item.period}</span>
                  <span className="text-zinc-600">·</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.company}
                  </h3>
                  {item.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Current
                    </span>
                  )}
                </div>

                <div className="text-sm text-zinc-300 font-medium">
                  {item.role}
                </div>

                {/* Animated content switch */}
                <div className="pt-2">
                  {viewMode === "standard" ? (
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.summary}
                    </p>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-200 text-xs sm:text-sm font-medium">
                      <FiCheckCircle className="text-cyan-400 w-4 h-4 shrink-0" />
                      <span>{item.metric}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden md:block text-right font-mono text-xs text-zinc-500 group-hover:text-zinc-400">
                0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

