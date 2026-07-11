"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "@/components/icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stages = [
  {
    num: "01",
    label: "Ingest Data",
    desc: "Connect any source — databases, streams, APIs, object stores — via native connectors or the universal schema adapter. Zero-copy ingestion preserves fidelity.",
    detail: "Connectors · Schema Inference · CDC · Batch",
    nodes: [
      { x: 20, y: 50 }, { x: 50, y: 20 }, { x: 80, y: 50 }, { x: 50, y: 80 }, { x: 50, y: 50 },
    ],
    edges: [[0, 4], [1, 4], [2, 4], [3, 4]] as [number, number][],
  },
  {
    num: "02",
    label: "Analyze with AI",
    desc: "Multi-head transformer models classify, normalize, and extract entities from raw records. Confidence scoring surfaces uncertainty for human review.",
    detail: "Transformer · NER · Classification · Embeddings",
    nodes: [
      { x: 15, y: 50 }, { x: 50, y: 15 }, { x: 85, y: 50 }, { x: 50, y: 85 },
      { x: 35, y: 35 }, { x: 65, y: 35 }, { x: 65, y: 65 }, { x: 35, y: 65 },
    ],
    edges: [[0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [7, 4]] as [number, number][],
  },
  {
    num: "03",
    label: "Generate Insight",
    desc: "Structured intelligence surfaces as queryable facts, decision triggers, and automated workflow inputs — continuously refreshed as new data arrives.",
    detail: "Facts · Triggers · Automations · Exports",
    nodes: [
      { x: 50, y: 50 }, { x: 20, y: 30 }, { x: 80, y: 30 }, { x: 20, y: 70 }, { x: 80, y: 70 },
      { x: 50, y: 20 }, { x: 50, y: 80 },
    ],
    edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]] as [number, number][],
  },
];

// ─── Pipeline Section ─────────────────────────────────────────────────────────

export default function PipelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const edgesRef = useRef<(SVGLineElement | null)[][]>([[], [], []]);
  const nodesRef = useRef<(SVGRectElement | null)[][]>([[], [], []]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each stage card
      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        // Card slides up
        tl.fromTo(
          card,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );

        // Edges draw in (stroke-dashoffset animation)
        const edges = edgesRef.current[i];
        edges.forEach((edge, j) => {
          if (!edge) return;
          const length = edge.getTotalLength();
          gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(
            edge,
            { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" },
            `-=${0.4 - j * 0.05}`
          );
        });

        // Nodes scale in
        const nodes = nodesRef.current[i];
        nodes.forEach((node, j) => {
          if (!node) return;
          tl.fromTo(
            node,
            { scale: 0, transformOrigin: "center" },
            { scale: 1, duration: 0.3, ease: "back.out(2)" },
            `-=${0.3 - j * 0.03}`
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-[#27272A]">
      {/* Section header */}
      <div className="px-12 py-10 border-b border-[#27272A] flex items-baseline justify-between">
        <div>
          <div className="font-mono text-[10px] text-[#52525B] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-[#52525B]" />
            Pipeline · Three-stage processing
          </div>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white">
            Intelligence pipeline
          </h2>
        </div>
        <div className="font-mono text-[10px] text-[#3F3F46] tracking-widest hidden lg:block">
          avg. 3.8ms end-to-end
        </div>
      </div>

      {/* Stage cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {stages.map((stage, i) => (
          <div
            key={stage.num}
            ref={(el) => { cardsRef.current[i] = el; }}
            className={`relative flex flex-col ${
              i < 2 ? "lg:border-r border-b lg:border-b-0" : ""
            } border-[#27272A] hover:bg-[#0F0F11] transition-colors duration-200`}
            style={{ opacity: 0 }}
          >
            {/* Top bar with number */}
            <div className="px-8 pt-8 pb-6 border-b border-[#27272A] flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.25em] mb-3">
                  {stage.num} /
                </div>
                <h3 className="text-[18px] font-semibold text-white tracking-[-0.01em]">
                  {stage.label}
                </h3>
              </div>
              {/* Flow arrow — only between cards */}
              {i < 2 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-[#09090B] border border-[#27272A] items-center justify-center">
                  <ArrowRight size={10} />
                </div>
              )}
            </div>

            {/* Node graph visualization */}
            <div className="px-8 py-6">
              <svg viewBox="0 0 100 100" className="w-full h-24 opacity-60">
                {stage.edges.map(([a, b], ei) => (
                  <line
                    key={ei}
                    ref={(el) => {
                      if (!edgesRef.current[i]) edgesRef.current[i] = [];
                      edgesRef.current[i][ei] = el;
                    }}
                    x1={stage.nodes[a].x}
                    y1={stage.nodes[a].y}
                    x2={stage.nodes[b].x}
                    y2={stage.nodes[b].y}
                    stroke="#52525B"
                    strokeWidth="0.8"
                  />
                ))}
                {stage.nodes.map((n, ni) => (
                  <rect
                    key={ni}
                    ref={(el) => {
                      if (!nodesRef.current[i]) nodesRef.current[i] = [];
                      nodesRef.current[i][ni] = el;
                    }}
                    x={n.x - 2.5}
                    y={n.y - 2.5}
                    width="5"
                    height="5"
                    fill={ni === 0 ? "#52525B" : "#27272A"}
                    stroke={ni === 0 ? "#71717A" : "#3F3F46"}
                    strokeWidth="0.6"
                  />
                ))}
              </svg>
            </div>

            {/* Description */}
            <div className="px-8 pb-8 flex-1 flex flex-col justify-between">
              <p className="text-[13px] text-[#A1A1AA] leading-[1.65]">{stage.desc}</p>
              <div className="mt-6 font-mono text-[10px] text-[#3F3F46] tracking-[0.15em] uppercase border-t border-[#27272A] pt-4">
                {stage.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
