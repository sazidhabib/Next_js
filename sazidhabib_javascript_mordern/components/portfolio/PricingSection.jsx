"use client";

import { FiCheck, FiArrowRight } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio.config";

export default function PricingSection() {
  const { pricing } = portfolioConfig;

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 30,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="pricing" className="py-20 border-t border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-medium">
            05 · Engagement Models
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Predictable, Value-Driven Pricing
          </h2>
          <p className="text-sm text-zinc-400 mt-2 font-normal">
            No surprise fees. Clear timelines, production deliverables, and guaranteed support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricing.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                tier.isPopular
                  ? "bg-zinc-900/80 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-950/30 -translate-y-1"
                  : "bg-zinc-900/40 border border-white/5 hover:border-white/15"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500 text-zinc-950 shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{tier.title}</h3>
                  <span className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5">
                    {tier.duration}
                  </span>
                </div>

                <div className="mt-4 mb-3">
                  <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                    {tier.price}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 min-h-[40px] leading-relaxed">
                  {tier.bestFor}
                </p>

                {/* Checklist */}
                <div className="pt-6 mt-6 border-t border-white/5 space-y-3">
                  <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
                    Included in this plan:
                  </div>
                  {tier.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                      <FiCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={scrollToContact}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    tier.isPopular
                      ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10 active:scale-[0.98]"
                  }`}
                >
                  <span>Select & Discuss</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

