"use client";

import { portfolioConfig } from "@/config/portfolio.config";

export default function AboutSection() {
  const { about } = portfolioConfig;

  return (
    <section id="about" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-medium">
            01 · About
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Background & Engineering Philosophy
          </h2>
        </div>

        {/* 3-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {about.map((card, idx) => (
            <div
              key={idx}
              className="group relative p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-6">
                  <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-cyan-400 transition-colors">
                    {card.num} — {card.subtitle}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-4">
                  {card.headline[0]} <br className="hidden sm:inline" />
                  <span className="text-zinc-400">{card.headline[1]}</span>
                </h3>

                <p
                  className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: card.body }}
                />
              </div>

              {/* Tags / Badges */}
              <div className="flex flex-wrap gap-2 pt-8 mt-4 border-t border-white/5">
                {card.highlights.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-white/5 text-zinc-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

