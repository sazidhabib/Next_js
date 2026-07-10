"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// ─── Data ────────────────────────────────────────────────────────────────────

const throughputData = [
  { t: "00:00", rps: 1240, latency: 12 },
  { t: "02:00", rps: 1890, latency: 9 },
  { t: "04:00", rps: 1420, latency: 14 },
  { t: "06:00", rps: 2340, latency: 7 },
  { t: "08:00", rps: 3120, latency: 6 },
  { t: "10:00", rps: 2780, latency: 8 },
  { t: "12:00", rps: 3540, latency: 5 },
  { t: "14:00", rps: 4210, latency: 4 },
  { t: "16:00", rps: 3890, latency: 6 },
  { t: "18:00", rps: 4620, latency: 4 },
  { t: "20:00", rps: 5010, latency: 3 },
  { t: "22:00", rps: 4780, latency: 4 },
];

const ingestionRows = [
  { id: "src_001", source: "Postgres · analytics_db", type: "RDBMS", records: "2.4M", status: "Completed", confidence: "99.4%", updated: "12s ago" },
  { id: "src_002", source: "S3 · raw-logs-prod", type: "Object Store", records: "18.7M", status: "Structuring", confidence: "97.1%", updated: "Now" },
  { id: "src_003", source: "Kafka · events.stream", type: "Stream", records: "∞", status: "Structuring", confidence: "98.8%", updated: "Now" },
  { id: "src_004", source: "Snowflake · dw_main", type: "Warehouse", records: "841K", status: "Completed", confidence: "99.9%", updated: "4m ago" },
  { id: "src_005", source: "REST · payments-api", type: "API", records: "126K", status: "Completed", confidence: "96.3%", updated: "9m ago" },
  { id: "src_006", source: "Webhook · stripe.events", type: "Webhook", records: "44K", status: "Structuring", confidence: "99.1%", updated: "Now" },
  { id: "src_007", source: "BigQuery · ml_features", type: "Warehouse", records: "5.2M", status: "Completed", confidence: "98.5%", updated: "22m ago" },
];

const navItems = [
  { label: "Overview", icon: GridIcon },
  { label: "Ingestion", icon: IngestIcon },
  { label: "Automations", icon: AutoIcon },
  { label: "Analytics", icon: ChartIcon },
  { label: "Settings", icon: GearIcon },
];

// ─── Icon primitives ──────────────────────────────────────────────────────────

function GridIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IngestIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12 10l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AutoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 12l4-4 3 2 5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GearIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.41 1.41M11.37 11.37l1.41 1.41M3.22 12.78l1.41-1.41M11.37 4.63l1.41-1.41" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XaiLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 border border-[#52525B] flex items-center justify-center">
        <div className="w-3 h-3 border border-[#A1A1AA] rotate-45" />
      </div>
      <span className="text-[13px] font-semibold tracking-[0.12em] text-white uppercase">Xai</span>
    </div>
  );
}

// ─── Section 1: Hero ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="min-h-screen border-b border-[#27272A] flex flex-col">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-12 py-5 border-b border-[#27272A]">
        <XaiLogo />
        <div className="hidden lg:flex items-center gap-8">
          {["Platform", "Docs", "Pricing", "Enterprise"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors duration-150 tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors px-3 py-1.5">
            Sign in
          </button>
          <button className="text-[13px] bg-white text-[#09090B] px-4 py-1.5 hover:bg-[#E4E4E7] transition-colors font-medium">
            Get early access
          </button>
        </div>
      </nav>

      {/* Hero body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left: typography block */}
        <div className="flex flex-col justify-center px-12 py-20 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#27272A]">
          <div className="font-mono text-[11px] text-[#52525B] tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-[#52525B]" />
            Intelligence Workspace · v0.9 Beta
          </div>

          <h1 className="text-[56px] lg:text-[64px] font-bold leading-[1.0] tracking-[-0.03em] text-white mb-8">
            Raw data to<br />
            <span className="text-[#52525B]">actionable</span><br />
            intent.
          </h1>

          <p className="text-[15px] text-[#A1A1AA] leading-[1.7] max-w-[380px] mb-10">
            Xai ingests any structured or unstructured source, applies transformer-based extraction pipelines, and surfaces decision-grade intelligence — continuously, at scale.
          </p>

          <div className="flex items-center gap-4">
            <button className="group flex items-center gap-2 text-[13px] bg-white text-[#09090B] px-5 py-2.5 hover:bg-[#E4E4E7] transition-colors font-medium">
              Request workspace access
              <ArrowRight size={13} />
            </button>
            <button className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors px-2 py-2.5">
              View architecture →
            </button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-0 border border-[#27272A]">
            {[
              { val: "5.2B", label: "Records processed" },
              { val: "99.4%", label: "Avg. confidence" },
              { val: "<4ms", label: "Median latency" },
            ].map((stat, i) => (
              <div key={i} className={`px-6 py-5 ${i < 2 ? "border-r border-[#27272A]" : ""}`}>
                <div className="text-[22px] font-bold text-white tracking-tight">{stat.val}</div>
                <div className="text-[11px] text-[#52525B] mt-1 font-mono uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Three.js canvas placeholder */}
        <div className="relative flex flex-col">
          {/* Corner marks */}
          <CornerMarks />

          <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[480px] lg:min-h-0">
            <div className="relative w-full h-full border border-[#27272A] flex flex-col items-center justify-center min-h-[400px]">
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Center reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="w-32 h-32 border border-[#27272A]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-[#3F3F46]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#52525B]" />
                  {/* Cross hairs */}
                  <div className="absolute top-1/2 left-0 w-full h-px bg-[#27272A]" style={{ transform: "translateY(-50%)" }} />
                  <div className="absolute left-1/2 top-0 h-full w-px bg-[#27272A]" style={{ transform: "translateX(-50%)" }} />
                </div>
              </div>

              {/* Label */}
              <div className="relative z-10 text-center">
                <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.3em] uppercase mb-3">
                  ╔════════════════════╗
                </div>
                <div className="font-mono text-[11px] text-[#52525B] tracking-[0.2em] uppercase">
                  Three.js Canvas Placeholder
                </div>
                <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.15em] mt-1">
                  Particle Cloud · Interactive 3D
                </div>
                <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.3em] uppercase mt-3">
                  ╚════════════════════╝
                </div>
              </div>

              {/* Corner labels */}
              <span className="absolute top-3 left-3 font-mono text-[9px] text-[#3F3F46] tracking-widest">x:0 y:0 z:0</span>
              <span className="absolute top-3 right-3 font-mono text-[9px] text-[#3F3F46] tracking-widest">1440×900</span>
              <span className="absolute bottom-3 left-3 font-mono text-[9px] text-[#3F3F46] tracking-widest">WebGL 2.0</span>
              <span className="absolute bottom-3 right-3 font-mono text-[9px] text-[#3F3F46] tracking-widest">60 FPS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerMarks() {
  const cls = "absolute w-3 h-3";
  return (
    <>
      <span className={`${cls} top-0 left-0 border-t border-l border-[#3F3F46]`} />
      <span className={`${cls} top-0 right-0 border-t border-r border-[#3F3F46]`} />
      <span className={`${cls} bottom-0 left-0 border-b border-l border-[#3F3F46]`} />
      <span className={`${cls} bottom-0 right-0 border-b border-r border-[#3F3F46]`} />
    </>
  );
}

// ─── Section 2: Pipeline Flow ─────────────────────────────────────────────────

function PipelineSection() {
  const stages = [
    {
      num: "01",
      label: "Ingest Data",
      desc: "Connect any source — databases, streams, APIs, object stores — via native connectors or the universal schema adapter. Zero-copy ingestion preserves fidelity.",
      detail: "Connectors · Schema Inference · CDC · Batch",
      nodes: [
        { x: 20, y: 50 }, { x: 50, y: 20 }, { x: 80, y: 50 }, { x: 50, y: 80 }, { x: 50, y: 50 },
      ],
      edges: [[0, 4], [1, 4], [2, 4], [3, 4]],
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
      edges: [[0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [7, 4]],
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
      edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]],
    },
  ];

  return (
    <section className="border-b border-[#27272A]">
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
            className={`relative flex flex-col ${i < 2 ? "lg:border-r border-b lg:border-b-0" : ""} border-[#27272A] hover:bg-[#0F0F11] transition-colors duration-200`}
          >
            {/* Top bar with number */}
            <div className="px-8 pt-8 pb-6 border-b border-[#27272A] flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.25em] mb-3">{stage.num} /</div>
                <h3 className="text-[18px] font-semibold text-white tracking-[-0.01em]">{stage.label}</h3>
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
                    x1={stage.nodes[a].x}
                    y1={stage.nodes[a].y}
                    x2={stage.nodes[b].x}
                    y2={stage.nodes[b].y}
                    stroke="#27272A"
                    strokeWidth="0.8"
                  />
                ))}
                {stage.nodes.map((n, ni) => (
                  <g key={ni}>
                    <rect
                      x={n.x - 2.5}
                      y={n.y - 2.5}
                      width="5"
                      height="5"
                      fill={ni === 0 ? "#52525B" : "#27272A"}
                      stroke={ni === 0 ? "#71717A" : "#3F3F46"}
                      strokeWidth="0.6"
                    />
                  </g>
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

// ─── Section 3: Dashboard Preview ────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181B] border border-[#27272A] px-3 py-2">
      <div className="font-mono text-[10px] text-[#52525B] mb-1">{label}</div>
      <div className="font-mono text-[12px] text-white">{payload[0]?.value?.toLocaleString()} rps</div>
    </div>
  );
};

function DashboardSection() {
  const [activeNav, setActiveNav] = useState("Ingestion");

  return (
    <section className="border-b border-[#27272A]">
      {/* Section label */}
      <div className="px-12 py-10 border-b border-[#27272A]">
        <div className="font-mono text-[10px] text-[#52525B] tracking-[0.2em] uppercase mb-2 flex items-center gap-2">
          <span className="w-4 h-px bg-[#52525B]" />
          Workspace Preview · Live interface
        </div>
        <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white">
          Intelligence workspace
        </h2>
      </div>

      {/* App frame */}
      <div className="mx-8 lg:mx-12 my-8 border border-[#27272A] bg-[#09090B] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272A] bg-[#0F0F11]">
          <div className="w-3 h-3 rounded-full bg-[#27272A]" />
          <div className="w-3 h-3 rounded-full bg-[#27272A]" />
          <div className="w-3 h-3 rounded-full bg-[#27272A]" />
          <div className="flex-1 mx-6">
            <div className="mx-auto max-w-[360px] bg-[#18181B] border border-[#27272A] rounded-sm px-3 py-1 font-mono text-[10px] text-[#52525B] text-center">
              app.xai.ai/workspace
            </div>
          </div>
        </div>

        {/* App shell */}
        <div className="flex" style={{ height: "640px" }}>
          {/* Sidebar */}
          <aside className="w-[220px] border-r border-[#27272A] flex flex-col shrink-0">
            {/* Brand */}
            <div className="px-5 py-4 border-b border-[#27272A]">
              <XaiLogo />
            </div>

            {/* Workspace selector */}
            <div className="px-4 py-3 border-b border-[#27272A]">
              <div className="flex items-center justify-between px-2 py-1.5 hover:bg-[#18181B] cursor-pointer rounded-sm">
                <div>
                  <div className="text-[12px] font-medium text-white">Acme Corp</div>
                  <div className="font-mono text-[9px] text-[#52525B]">Pro · 5 seats</div>
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-[#52525B]">
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveNav(label)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left text-[12px] transition-colors duration-100 rounded-sm ${
                    activeNav === label
                      ? "bg-[#27272A] text-white"
                      : "text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#18181B]"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>

            {/* Bottom status */}
            <div className="px-4 py-4 border-t border-[#27272A]">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[9px] text-[#52525B]">All systems nominal</span>
              </div>
              <div className="mt-2 flex items-center gap-2 px-2 py-1.5 hover:bg-[#18181B] cursor-pointer rounded-sm">
                <div className="w-5 h-5 bg-[#27272A] flex items-center justify-center text-[8px] font-bold text-white">
                  MC
                </div>
                <div>
                  <div className="text-[11px] text-white">M. Chen</div>
                  <div className="font-mono text-[9px] text-[#52525B]">admin</div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-[#27272A] shrink-0">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#52525B]">
                <span>Workspace</span>
                <span className="text-[#3F3F46]">/</span>
                <span className="text-[#A1A1AA]">{activeNav}</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Command palette */}
                <div className="flex items-center gap-2 border border-[#27272A] px-3 py-1.5 bg-[#18181B] min-w-[220px] cursor-pointer hover:border-[#3F3F46] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#52525B]">
                    <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="font-mono text-[10px] text-[#52525B] flex-1">Press ⌘K to search...</span>
                  <kbd className="font-mono text-[8px] text-[#3F3F46] border border-[#27272A] px-1 py-0.5">⌘K</kbd>
                </div>
                <div className="w-6 h-6 bg-[#27272A] flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#71717A]">
                    <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.1" />
                    <path d="M1 11c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </header>

            {/* Dashboard grid */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {/* Metrics row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Active Sources", value: "24", delta: "+3", up: true },
                  { label: "Records Today", value: "8.4M", delta: "+12%", up: true },
                  { label: "Avg Confidence", value: "98.7%", delta: "+0.2", up: true },
                  { label: "Queue Depth", value: "1,240", delta: "-840", up: false },
                ].map((m) => (
                  <div key={m.label} className="border border-[#27272A] bg-[#18181B] px-4 py-3">
                    <div className="font-mono text-[9px] text-[#52525B] uppercase tracking-widest mb-2">{m.label}</div>
                    <div className="text-[20px] font-bold text-white tracking-tight">{m.value}</div>
                    <div className={`font-mono text-[9px] mt-1 ${m.up ? "text-emerald-500" : "text-red-400"}`}>
                      {m.delta} vs yesterday
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="border border-[#27272A] bg-[#18181B]">
                <div className="px-5 py-3 border-b border-[#27272A] flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-white">Processing Throughput</div>
                    <div className="font-mono text-[9px] text-[#52525B] mt-0.5">Records per second · last 24h</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {["1H", "6H", "24H", "7D"].map((r, i) => (
                      <button
                        key={r}
                        className={`font-mono text-[9px] px-2 py-1 border ${i === 2 ? "border-[#52525B] text-white" : "border-[#27272A] text-[#52525B] hover:text-[#A1A1AA]"} transition-colors`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4" style={{ height: "160px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={throughputData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#52525B" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#52525B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="2 4" stroke="#1F1F23" vertical={false} />
                      <XAxis
                        dataKey="t"
                        tick={{ fontFamily: "JetBrains Mono", fontSize: 8, fill: "#52525B" }}
                        axisLine={false}
                        tickLine={false}
                        interval={2}
                      />
                      <YAxis
                        tick={{ fontFamily: "JetBrains Mono", fontSize: 8, fill: "#52525B" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="rps"
                        stroke="#71717A"
                        strokeWidth={1.5}
                        fill="url(#throughputGrad)"
                        dot={false}
                        activeDot={{ r: 3, fill: "#A1A1AA", strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ingestion table */}
              <div className="border border-[#27272A] bg-[#18181B]">
                <div className="px-5 py-3 border-b border-[#27272A] flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-white">Live Ingestion Streams</div>
                    <div className="font-mono text-[9px] text-[#52525B] mt-0.5">{ingestionRows.length} active sources</div>
                  </div>
                  <button className="font-mono text-[9px] text-[#52525B] border border-[#27272A] px-3 py-1.5 hover:text-white hover:border-[#3F3F46] transition-colors">
                    + Add source
                  </button>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#27272A]">
                      {["Source", "Type", "Records", "Status", "Confidence", "Updated"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-2.5 text-left font-mono text-[9px] text-[#52525B] uppercase tracking-widest font-normal"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ingestionRows.map((row, i) => (
                      <tr
                        key={row.id}
                        className={`border-b border-[#1F1F23] hover:bg-[#1C1C1F] transition-colors cursor-pointer ${i === ingestionRows.length - 1 ? "border-b-0" : ""}`}
                      >
                        <td className="px-5 py-2.5">
                          <div className="text-[11px] font-medium text-white">{row.source}</div>
                          <div className="font-mono text-[9px] text-[#3F3F46]">{row.id}</div>
                        </td>
                        <td className="px-5 py-2.5">
                          <span className="font-mono text-[9px] text-[#52525B] border border-[#27272A] px-1.5 py-0.5">
                            {row.type}
                          </span>
                        </td>
                        <td className="px-5 py-2.5 font-mono text-[11px] text-[#A1A1AA]">{row.records}</td>
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-1 h-1 rounded-full ${row.status === "Structuring" ? "bg-amber-400" : "bg-emerald-500"}`}
                            />
                            <span
                              className={`font-mono text-[9px] ${row.status === "Structuring" ? "text-amber-400" : "text-emerald-500"}`}
                            >
                              {row.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-2.5 font-mono text-[11px] text-white">{row.confidence}</td>
                        <td className="px-5 py-2.5 font-mono text-[9px] text-[#52525B]">{row.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Signature / Math Engine ──────────────────────────────────────

function SignatureSection() {
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

  return (
    <section className="border-b border-[#27272A]">
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
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left: equation panel */}
        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-[#27272A] flex flex-col">
          <div className="px-8 py-6 border-b border-[#27272A]">
            <p className="text-[13px] text-[#A1A1AA] leading-[1.65]">
              Xai{"'"}s core inference layer runs multi-head attention over tokenized entity sequences. Confidence scores are derived from normalized Shannon entropy across the prediction distribution.
            </p>
          </div>

          <div className="px-8 py-6 space-y-0 flex-1">
            {equations.map((eq, i) => (
              <div
                key={i}
                className={`py-4 ${i < equations.length - 1 ? "border-b border-[#1F1F23]" : ""}`}
              >
                <div className="font-mono text-[9px] text-[#3F3F46] tracking-[0.2em] uppercase mb-2">{eq.label}</div>
                <div className="font-mono text-[11px] text-[#71717A] leading-[1.5]">{eq.eq}</div>
              </div>
            ))}
          </div>

          {/* Model specs */}
          <div className="px-8 py-6 border-t border-[#27272A]">
            <div className="font-mono text-[9px] text-[#3F3F46] tracking-[0.2em] uppercase mb-4">Model Specs</div>
            <div className="space-y-2">
              {[
                ["Architecture", "Transformer-XL"],
                ["Parameters", "7.4B"],
                ["Context window", "128K tokens"],
                ["Quantization", "INT8 / FP16"],
                ["Inference", "Triton · 4×H100"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#52525B]">{k}</span>
                  <span className="font-mono text-[10px] text-[#A1A1AA]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: canvas placeholder */}
        <div className="lg:col-span-2 relative min-h-[480px] lg:min-h-0">
          <div className="absolute inset-0 flex flex-col">
            {/* Telemetry labels */}
            <div className="relative flex-1">
              {telemetry.map((t) => (
                <div key={t.label} className={`absolute ${t.pos} font-mono text-[9px] text-[#2D2D31]`}>
                  <div className="text-[#3F3F46] tracking-widest">{t.label}</div>
                  <div className="text-[#52525B]">{t.value}</div>
                </div>
              ))}

              {/* Canvas frame */}
              <div className="absolute inset-8 border border-[#27272A] flex flex-col items-center justify-center">
                <CornerMarks />

                {/* Background grid */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Decorative mesh lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="meshGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#52525B" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#52525B" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const x = 50 + 45 * Math.cos(angle);
                    const y = 50 + 45 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={`${x}%`}
                        y2={`${y}%`}
                        stroke="#52525B"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                  {[10, 20, 30, 40].map((r, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={`${r}%`}
                      fill="none"
                      stroke="#27272A"
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>

                {/* Label */}
                <div className="relative z-10 text-center px-6">
                  <div className="font-mono text-[9px] text-[#3F3F46] tracking-[0.3em] uppercase mb-4">
                    ╔══════════════════════════════╗
                  </div>
                  <div className="font-mono text-[12px] text-[#52525B] tracking-[0.2em] uppercase">
                    Interactive R3F Particle Mesh
                  </div>
                  <div className="font-mono text-[10px] text-[#3F3F46] tracking-[0.15em] mt-1">
                    Transformation Canvas
                  </div>
                  <div className="font-mono text-[9px] text-[#2D2D31] mt-2">
                    React Three Fiber · WebGPU · 200K particles
                  </div>
                  <div className="font-mono text-[9px] text-[#3F3F46] tracking-[0.3em] uppercase mt-4">
                    ╚══════════════════════════════╝
                  </div>
                </div>

                {/* Axis labels */}
                <span className="absolute top-3 left-3 font-mono text-[8px] text-[#2D2D31]">α: 0.00</span>
                <span className="absolute top-3 right-3 font-mono text-[8px] text-[#2D2D31]">β: 1.00</span>
                <span className="absolute bottom-3 left-3 font-mono text-[8px] text-[#2D2D31]">t: 0.000s</span>
                <span className="absolute bottom-3 right-3 font-mono text-[8px] text-[#2D2D31]">n: 200K pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-12 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        <XaiLogo />
        <p className="font-mono text-[10px] text-[#3F3F46] mt-3 tracking-wide">
          Intelligence infrastructure for the enterprise.
        </p>
      </div>
      <div className="flex items-center gap-8">
        {["Privacy", "Terms", "Security", "Status", "Docs"].map((l) => (
          <a key={l} href="#" className="font-mono text-[10px] text-[#52525B] hover:text-[#A1A1AA] transition-colors tracking-wide">
            {l}
          </a>
        ))}
      </div>
      <div className="font-mono text-[9px] text-[#2D2D31] tracking-wide">
        © 2025 Xai Systems, Inc.
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen bg-[#09090B] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <HeroSection />
      <PipelineSection />
      <DashboardSection />
      <SignatureSection />
      <Footer />
    </div>
  );
}
