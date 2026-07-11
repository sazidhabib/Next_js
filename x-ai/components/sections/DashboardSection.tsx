"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";
import {
  XaiLogo, GridIcon, IngestIcon, AutoIcon, ChartIcon,
  GearIcon, SearchIcon, UserIcon, ChevronDown,
} from "@/components/icons";

// ─── Data ─────────────────────────────────────────────────────────────────────

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

const metrics = [
  { label: "Active Sources", value: "24", delta: "+3", up: true },
  { label: "Records Today", value: "8.4M", delta: "+12%", up: true },
  { label: "Avg Confidence", value: "98.7%", delta: "+0.2", up: true },
  { label: "Queue Depth", value: "1,240", delta: "-840", up: false },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181B] border border-[#27272A] px-3 py-2">
      <div className="font-mono text-[10px] text-[#52525B] mb-1">{label}</div>
      <div className="font-mono text-[12px] text-white">{payload[0]?.value?.toLocaleString()} rps</div>
    </div>
  );
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const frameVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const sidebarItemVariant = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const tableRowVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// ─── Dashboard Section ────────────────────────────────────────────────────────

export default function DashboardSection() {
  const [activeNav, setActiveNav] = useState("Ingestion");
  const [activeRange, setActiveRange] = useState("24H");

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
      <motion.div
        className="mx-8 lg:mx-12 my-8 border border-[#27272A] bg-[#09090B] overflow-hidden"
        variants={frameVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
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
              <motion.div
                className="flex items-center justify-between px-2 py-1.5 hover:bg-[#18181B] cursor-pointer rounded-sm"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div>
                  <div className="text-[12px] font-medium text-white">Acme Corp</div>
                  <div className="font-mono text-[9px] text-[#52525B]">Pro · 5 seats</div>
                </div>
                <ChevronDown />
              </motion.div>
            </div>

            {/* Nav */}
            <motion.nav
              className="flex-1 px-3 py-4 space-y-0.5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {navItems.map(({ label, icon: Icon }) => (
                <motion.button
                  key={label}
                  variants={sidebarItemVariant}
                  onClick={() => setActiveNav(label)}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left text-[12px] transition-colors duration-100 rounded-sm ${
                    activeNav === label
                      ? "bg-[#27272A] text-white"
                      : "text-[#71717A] hover:text-[#A1A1AA] hover:bg-[#18181B]"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </motion.button>
              ))}
            </motion.nav>

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
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeNav}
                    className="text-[#A1A1AA]"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeNav}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-3">
                {/* Command palette */}
                <motion.div
                  className="flex items-center gap-2 border border-[#27272A] px-3 py-1.5 bg-[#18181B] min-w-[220px] cursor-pointer transition-colors"
                  whileHover={{ borderColor: "#3F3F46" }}
                >
                  <SearchIcon />
                  <span className="font-mono text-[10px] text-[#52525B] flex-1">Press ⌘K to search...</span>
                  <kbd className="font-mono text-[8px] text-[#3F3F46] border border-[#27272A] px-1 py-0.5">⌘K</kbd>
                </motion.div>
                <div className="w-6 h-6 bg-[#27272A] flex items-center justify-center">
                  <UserIcon />
                </div>
              </div>
            </header>

            {/* Dashboard grid */}
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {/* Metrics row */}
              <motion.div
                className="grid grid-cols-4 gap-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {metrics.map((m) => (
                  <motion.div
                    key={m.label}
                    variants={cardVariant}
                    whileHover={{ y: -2, borderColor: "#3F3F46" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="border border-[#27272A] bg-[#18181B] px-4 py-3 cursor-default"
                  >
                    <div className="font-mono text-[9px] text-[#52525B] uppercase tracking-widest mb-2">
                      {m.label}
                    </div>
                    <div className="text-[20px] font-bold text-white tracking-tight">{m.value}</div>
                    <div className={`font-mono text-[9px] mt-1 ${m.up ? "text-emerald-500" : "text-red-400"}`}>
                      {m.delta} vs yesterday
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Chart */}
              <motion.div
                className="border border-[#27272A] bg-[#18181B]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="px-5 py-3 border-b border-[#27272A] flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-white">Processing Throughput</div>
                    <div className="font-mono text-[9px] text-[#52525B] mt-0.5">Records per second · last 24h</div>
                  </div>
                  <div className="flex items-center gap-2 relative">
                    {["1H", "6H", "24H", "7D"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setActiveRange(r)}
                        className={`relative font-mono text-[9px] px-2 py-1 border transition-colors ${
                          activeRange === r
                            ? "border-[#52525B] text-white"
                            : "border-[#27272A] text-[#52525B] hover:text-[#A1A1AA]"
                        }`}
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
              </motion.div>

              {/* Ingestion table */}
              <motion.div
                className="border border-[#27272A] bg-[#18181B]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="px-5 py-3 border-b border-[#27272A] flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-white">Live Ingestion Streams</div>
                    <div className="font-mono text-[9px] text-[#52525B] mt-0.5">
                      {ingestionRows.length} active sources
                    </div>
                  </div>
                  <motion.button
                    className="font-mono text-[9px] text-[#52525B] border border-[#27272A] px-3 py-1.5 hover:text-white hover:border-[#3F3F46] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    + Add source
                  </motion.button>
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
                  <motion.tbody
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {ingestionRows.map((row, i) => (
                      <motion.tr
                        key={row.id}
                        variants={tableRowVariant}
                        className={`border-b border-[#1F1F23] hover:bg-[#1C1C1F] transition-colors cursor-pointer ${
                          i === ingestionRows.length - 1 ? "border-b-0" : ""
                        }`}
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
                              className={`w-1 h-1 rounded-full ${
                                row.status === "Structuring" ? "bg-amber-400" : "bg-emerald-500"
                              }`}
                            />
                            <span
                              className={`font-mono text-[9px] ${
                                row.status === "Structuring" ? "text-amber-400" : "text-emerald-500"
                              }`}
                            >
                              {row.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-2.5 font-mono text-[11px] text-white">{row.confidence}</td>
                        <td className="px-5 py-2.5 font-mono text-[9px] text-[#52525B]">{row.updated}</td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
