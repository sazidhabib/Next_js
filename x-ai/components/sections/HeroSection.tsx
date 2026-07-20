"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, CornerMarks } from "@/components/icons";
import dynamic from "next/dynamic";

const SceneWrapper = dynamic(() => import("@/components/three/SceneWrapper"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.2em] animate-pulse">
        Initializing 3D scene...
      </div>
    </div>
  ),
});

// ─── Stat items ───────────────────────────────────────────────────────────────

const stats = [
  { val: "5.2B", label: "Records processed" },
  { val: "99.4%", label: "Avg. confidence" },
  { val: "<4ms", label: "Median latency" },
];

// ─── Animation variants ──────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ─── Hero Section ─────────────────────────────────────────────────────────────

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Pass scroll progress to 3D scene
  // Maps 0 to 800px of scroll progress to 0 to 1 of morphing progress, keeping the shape locked when scrolled past
  const morphProgress = useTransform(scrollY, [0, 800], [0, 1]);

  return (
    <section ref={sectionRef} className="h-[300vh] border-b border-[#27272A] relative">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        {/* Hero body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
          {/* Left: typography block */}
          <motion.div
            className="flex flex-col justify-center px-12 py-20 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#27272A]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUpVariants}
              className="font-mono text-[11px] text-[#52525B] tracking-[0.2em] uppercase mb-8 flex items-center gap-3"
            >
              <span className="inline-block w-6 h-px bg-[#52525B]" />
              Intelligence Workspace · v0.9 Beta
            </motion.div>

            <motion.h1
              variants={fadeUpVariants}
              className="text-[56px] lg:text-[64px] font-bold leading-[1.0] tracking-[-0.03em] text-white mb-8"
            >
              Raw data to<br />
              <span className="text-[#52525B]">actionable</span><br />
              intent.
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              className="text-[15px] text-[#A1A1AA] leading-[1.7] max-w-[380px] mb-10"
            >
              Xai ingests any structured or unstructured source, applies transformer-based extraction
              pipelines, and surfaces decision-grade intelligence — continuously, at scale.
            </motion.p>

            <motion.div variants={fadeUpVariants} className="flex items-center gap-4">
              <button className="group flex items-center gap-2 text-[13px] bg-white text-[#09090B] px-5 py-2.5 hover:bg-[#E4E4E7] transition-colors font-medium">
                Request workspace access
                <ArrowRight size={13} />
              </button>
              <button className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors px-2 py-2.5">
                View architecture →
              </button>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="mt-16 grid grid-cols-3 gap-0 border border-[#27272A]"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  variants={statVariants}
                  className={`px-6 py-5 ${i < 2 ? "border-r border-[#27272A]" : ""}`}
                >
                  <div className="text-[22px] font-bold text-white tracking-tight">{stat.val}</div>
                  <div className="text-[11px] text-[#52525B] mt-1 font-mono uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Three.js canvas */}
          <div className="relative flex flex-col">
            <CornerMarks />
            <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[480px] lg:min-h-0">
              <div className="relative w-full h-full min-h-[400px]">
                <SceneWrapper morphProgress={morphProgress} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
