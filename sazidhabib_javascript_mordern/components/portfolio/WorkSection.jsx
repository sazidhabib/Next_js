"use client";

import { FiExternalLink, FiGithub, FiArrowUpRight } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio.config";

export default function WorkSection() {
  const { projects } = portfolioConfig;

  return (
    <section id="work" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-medium">
              03 · Selected Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Featured Web Engineering
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm font-mono">
            Full-stack platforms, scalable CMS systems, and conversion-focused web products.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between overflow-hidden p-5 sm:p-6"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-[16/10] w-full rounded-xl bg-zinc-950/80 border border-white/5 overflow-hidden mb-6 flex items-center justify-center">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}

                {/* Overlay Accent Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundColor: project.accent,
                  }}
                />

                {/* Year & Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-black/70 text-white backdrop-blur-md border border-white/10">
                    {project.category}
                  </span>
                  <span className="px-2 py-1 rounded-full text-[11px] font-mono text-zinc-400 bg-black/70 backdrop-blur-md border border-white/10">
                    {project.year}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                    <span>{project.title}</span>
                    <FiArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cyan-400" />
                  </h3>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Key Metric Badge */}
                {project.metrics && (
                  <div className="pt-1">
                    <span className="inline-block text-xs font-mono text-emerald-400 bg-emerald-950/30 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      ⚡ {project.metrics}
                    </span>
                  </div>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-300 bg-white/5 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/5">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>Live Product</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 border border-white/10 transition-colors"
                  >
                    <FiGithub className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

