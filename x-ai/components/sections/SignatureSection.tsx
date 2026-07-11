"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import dynamic from "next/dynamic";
import { CornerMarks } from "@/components/icons";

const SignatureScene = dynamic(() => import("@/components/three/DataMesh"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.2em] animate-pulse">
        Loading 3D mesh...
      </div>
    </div>
  ),
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const telemetry = [
  { label: "Δ_entropy", value: "0.0041", pos: "top-8 left-8" },
  { label: "σ_confidence", value: "0.0023", pos: "top-8 right-8" },
  { label: "λ_latent_dim", value: "768", pos: "bottom-8 left-8" },
  { label: "ρ_sparsity", value: "0.94", pos: "bottom-8 right-8" },
  { label: "∇_loss", value: "0.00012", pos: "top-1/3 left-6" },
  { label: "τ_temp", value: "0.72", pos: "top-2/3 right-6" },
];

const equations = [
  { label: "Attention", eq: "Attn(Q,K,V) = softmax(QKᵀ / √dₖ)·V" },
  { label: "Confidence", eq: "conf(x) = 1 − H(p(y|x)) / log|Y|" },
  { label: "Extraction", eq: "ê = argmax_{e∈E} P(e|x; θ)" },
  { label: "Embedding", eq: "z = Enc(x) ∈ ℝ^{d_model}" },
];

const modelSpecs = [
  ["Architecture", "Transformer-XL"],
  ["Parameters", "7.4B"],
  ["Context window", "128K tokens"],
  ["Quantization", "INT8 / FP16"],
  ["Inference", "Triton · 4×H100"],
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const equationVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

const specVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

// ─── Signature Section ────────────────────────────────────────────────────────

export default function SignatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Maps [0, 0.95] scroll progress to 0 to 3 active index, leaving a small buffer at the end
    const segment = Math.min(Math.floor(latest / 0.2375), 3);
    setActiveIndex(segment);
  });

  const morphProgress = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  return (
    <section ref={sectionRef} className="h-[250vh] border-b border-[#27272A] relative">
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-12 py-10 border-b border-[#27272A]">
          <div className="font-mono text-[10px] text-[#52525B] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-[#52525B]" />
            Math engine · Transformer inference
          </div>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white">
            The architecture beneath
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          {/* Left: equation panel */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-[#27272A] flex flex-col justify-between h-full overflow-hidden bg-[#09090B] z-10">
            <div className="px-8 py-6 border-b border-[#27272A]">
              <motion.p
                className="text-[13px] text-[#A1A1AA] leading-[1.65]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Xai{"'"}s core inference layer runs multi-head attention over tokenized entity
                sequences. Confidence scores are derived from normalized Shannon entropy across the
                prediction distribution.
              </motion.p>
            </div>

            <div className="px-4 py-4 space-y-1 flex-1 overflow-y-auto">
              {equations.map((eq, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={equationVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`px-4 py-3 transition-all duration-300 rounded ${
                    activeIndex === i
                      ? "bg-[#18181B] border-l-2 border-white pl-6"
                      : "border-l-2 border-transparent pl-4"
                  } ${i < equations.length - 1 ? "border-b border-[#1F1F23]" : ""}`}
                >
                  <div
                    className={`font-mono text-[9px] tracking-[0.2em] uppercase mb-1.5 transition-colors duration-300 ${
                      activeIndex === i ? "text-white" : "text-[#3F3F46]"
                    }`}
                  >
                    {eq.label}
                  </div>
                  <div
                    className={`font-mono text-[11px] leading-[1.5] transition-colors duration-300 ${
                      activeIndex === i ? "text-[#A1A1AA]" : "text-[#71717A]"
                    }`}
                  >
                    {eq.eq}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Model specs */}
            <div className="px-8 py-6 border-t border-[#27272A]">
              <div className="font-mono text-[9px] text-[#3F3F46] tracking-[0.2em] uppercase mb-4">
                Model Specs
              </div>
              <div className="space-y-2">
                {modelSpecs.map(([k, v], i) => (
                  <motion.div
                    key={k}
                    custom={i}
                    variants={specVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex items-center justify-between"
                  >
                    <span className="font-mono text-[10px] text-[#52525B]">{k}</span>
                    <span className="font-mono text-[10px] text-[#A1A1AA]">{v}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: interactive 3D canvas */}
          <div className="lg:col-span-2 relative min-h-[480px] lg:min-h-0 h-full">
            <div className="absolute inset-0 flex flex-col">
              {/* Telemetry labels */}
              <div className="relative flex-1 h-full">
                {telemetry.map((t) => (
                  <motion.div
                    key={t.label}
                    className={`absolute ${t.pos} font-mono text-[9px] text-[#2D2D31]`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <div className="text-[#3F3F46] tracking-widest">{t.label}</div>
                    <div className="text-[#52525B]">{t.value}</div>
                  </motion.div>
                ))}

                {/* Canvas frame */}
                <div className="absolute inset-8 border border-[#27272A] overflow-hidden">
                  <CornerMarks />

                  {/* Background grid */}
                  <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {/* 3D Scene */}
                  <SignatureScene scrollProgress={morphProgress} />

                  {/* Axis labels */}
                  <span className="absolute top-3 left-3 font-mono text-[8px] text-[#2D2D31] z-10">
                    α: {(1 - scrollYProgress.get() * 0.5).toFixed(2)}
                  </span>
                  <span className="absolute top-3 right-3 font-mono text-[8px] text-[#2D2D31] z-10">
                    β: {(scrollYProgress.get() * 1.0).toFixed(2)}
                  </span>
                  <span className="absolute bottom-3 left-3 font-mono text-[8px] text-[#2D2D31] z-10">
                    t: {(scrollYProgress.get() * 4.0).toFixed(3)}s
                  </span>
                  <span className="absolute bottom-3 right-3 font-mono text-[8px] text-[#2D2D31] z-10">
                    n: 200 pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
