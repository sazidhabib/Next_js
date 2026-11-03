"use client";

import { FiClock, FiCheck } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio.config";

export default function ServicesSection() {
  const { services } = portfolioConfig;

  return (
    <section id="services" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-medium">
            04 · Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Engineering Services & Capabilities
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mt-2 font-normal">
            From greenfield architecture to high-performance conversions, tailored for startups and fast-moving teams.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {service.num}
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-zinc-400 bg-white/5 border border-white/5">
                    <FiClock className="w-3 h-3 text-cyan-400" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5">
                  {service.title}
                </h3>

                <p className="text-sm text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Deliverables tags */}
              <div className="pt-6 mt-6 border-t border-white/5">
                <div className="text-[11px] font-mono uppercase text-zinc-500 mb-2.5 tracking-wider">
                  Key Deliverables
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.deliverables.map((item, dIdx) => (
                    <span
                      key={dIdx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800/60 text-zinc-300 border border-white/5"
                    >
                      <FiCheck className="w-3 h-3 text-cyan-400" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

