'use client'

import { useEffect, useState, useRef } from 'react'

export default function GeometricCanvas({ fromFormat, toFormat }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  // Floating format badges orbiting gently around
  const floatingTags = [
    { label: 'PDF', top: '12%', left: '16%', color: 'from-red-500/20 to-orange-500/10 text-red-500 border-red-500/30', anim: 'animate-float-gentle', delay: '0s' },
    { label: 'MP4', top: '15%', right: '14%', color: 'from-blue-500/20 to-cyan-500/10 text-blue-500 border-blue-500/30', anim: 'animate-float-delayed', delay: '1s' },
    { label: 'WEBP', bottom: '16%', left: '18%', color: 'from-emerald-500/20 to-teal-500/10 text-emerald-500 border-emerald-500/30', anim: 'animate-float-delayed', delay: '2s' },
    { label: 'DOCX', bottom: '14%', right: '16%', color: 'from-indigo-500/20 to-purple-500/10 text-indigo-500 border-indigo-500/30', anim: 'animate-float-gentle', delay: '0.5s' },
    { label: 'ZIP', top: '48%', left: '6%', color: 'from-amber-500/20 to-yellow-500/10 text-amber-500 border-amber-500/30', anim: 'animate-float-gentle', delay: '1.5s' },
    { label: 'SVG', top: '48%', right: '6%', color: 'from-fuchsia-500/20 to-pink-500/10 text-fuchsia-500 border-fuchsia-500/30', anim: 'animate-float-delayed', delay: '2.5s' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none select-none"
    >
      {/* Dynamic Background Mesh Grid */}
      <div
        className="absolute inset-0 geometric-grid-bg opacity-30 dark:opacity-20 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
        }}
      />

      {/* Central Ambient Glow Breathing Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-primary/10 blur-[60px] animate-glow-breathe" />

      {/* Radar Expansion Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-primary/20 animate-radar-ping" />

      {/* Complex Geometric SVG Astrolabe & Data Flow Lines */}
      <svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] max-w-none text-primary transition-transform duration-500 ease-out"
        style={{
          transform: `translate(-50%, -50%) translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`,
        }}
        viewBox="0 0 400 400"
        fill="none"
      >
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
          </linearGradient>

          <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--primary-hover)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer Rotating Gear Ring with Tick Marks */}
        <g className="animate-spin-slow origin-center">
          <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 8" opacity="0.25" />
          <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 12" opacity="0.3" />
          {/* Diamond satellite markers */}
          <polygon points="200,26 204,30 200,34 196,30" fill="currentColor" opacity="0.6" />
          <polygon points="200,366 204,370 200,374 196,370" fill="currentColor" opacity="0.6" />
          <polygon points="30,200 34,204 38,200 34,196" fill="currentColor" opacity="0.6" />
          <polygon points="362,200 366,204 370,200 366,196" fill="currentColor" opacity="0.6" />
        </g>

        {/* Middle Counter-Rotating Astrolabe Ring with Segment Arcs */}
        <g className="animate-spin-reverse-slow origin-center">
          <circle cx="200" cy="200" r="115" stroke="url(#ringGlow)" strokeWidth="1.2" strokeDasharray="40 25 15 25" opacity="0.5" />
          <circle cx="200" cy="200" r="85" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.3" />
          {/* Crosshair accents */}
          <line x1="200" y1="100" x2="200" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="200" y1="280" x2="200" y2="300" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="100" y1="200" x2="120" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <line x1="280" y1="200" x2="300" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Inner Fast Pulsing Core Ring */}
        <g className="animate-spin-slow origin-center">
          <circle cx="200" cy="200" r="55" stroke="currentColor" strokeWidth="0.75" strokeDasharray="8 6" opacity="0.4" />
          <circle cx="200" cy="200" r="35" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        </g>

        {/* Flowing Laser Data Channels (Horizontal Conversion Flow) */}
        <g>
          {/* Main Laser Axis */}
          <line x1="40" y1="200" x2="360" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.15" />
          {/* Animated Glowing Laser Stream FROM -> TO */}
          <line
            x1="80"
            y1="200"
            x2="320"
            y2="200"
            stroke="url(#beamGradient)"
            strokeWidth="2.5"
            className="animate-pulse-beam"
          />
          {/* Secondary Upper & Lower Curved Circuit Traces */}
          <path
            d="M 90 170 Q 200 130 310 170"
            stroke="url(#beamGradient)"
            strokeWidth="1.2"
            fill="none"
            className="animate-pulse-beam-fast"
            opacity="0.6"
          />
          <path
            d="M 90 230 Q 200 270 310 230"
            stroke="url(#beamGradient)"
            strokeWidth="1.2"
            fill="none"
            className="animate-pulse-beam-fast"
            opacity="0.6"
          />
        </g>
      </svg>

      {/* Floating Animated Format Micro-Pills */}
      {floatingTags.map((tag, idx) => (
        <div
          key={tag.label}
          className={`absolute ${tag.anim} hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border shadow-sm backdrop-blur-md bg-gradient-to-br ${tag.color}`}
          style={{
            top: tag.top,
            bottom: tag.bottom,
            left: tag.left,
            right: tag.right,
            animationDelay: tag.delay,
            transform: `translate3d(${mouseOffset.x * (idx % 2 === 0 ? 0.8 : -0.8)}px, ${mouseOffset.y * 0.8}px, 0)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping opacity-75" />
          {tag.label}
        </div>
      ))}
    </div>
  )
}
