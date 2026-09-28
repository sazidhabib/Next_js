'use client'

import { useState, useRef } from 'react'

export default function AnimatedConversionSvg({
  from = 'INPUT',
  to = 'OUTPUT',
  status = 'idle',
  progress = 0,
  className = '',
}) {
  const containerRef = useRef(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16
    setMouseOffset({ x, y })
  }

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 })
  }

  const isConverting = status === 'uploading' || status === 'converting'
  const isCompleted = status === 'completed'

  const displayFrom = (from || 'FILE').toUpperCase()
  const displayTo = (to || 'FORMAT').toUpperCase()

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-4/3 max-w-[540px] rounded-3xl overflow-hidden border border-border/70 bg-gradient-to-br from-surface via-background to-surface/80 shadow-lg select-none flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${className}`}
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 geometric-grid-bg opacity-35 dark:opacity-20 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px, 0)`,
        }}
      />

      {/* Central Ambient Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[70px] pointer-events-none transition-all duration-700 ${
          isCompleted
            ? 'bg-emerald-500/25 scale-125'
            : isConverting
            ? 'bg-primary/30 scale-110'
            : 'bg-primary/15'
        }`}
      />

      {/* Floating Background Format Tags */}
      <div className="absolute top-4 left-6 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-red-500/30 text-red-500/80 bg-red-500/5 animate-float-gentle">
        PDF
      </div>
      <div className="absolute top-4 right-6 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-blue-500/30 text-blue-500/80 bg-blue-500/5 animate-float-delayed">
        MP4
      </div>
      <div className="absolute bottom-4 left-6 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-amber-500/30 text-amber-500/80 bg-amber-500/5 animate-float-delayed">
        DOCX
      </div>
      <div className="absolute bottom-4 right-6 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-purple-500/30 text-purple-500/80 bg-purple-500/5 animate-float-gentle">
        WEBP
      </div>

      {/* Main Vector Conversion Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px, 0)`,
        }}
      >
        <svg
          className="w-full h-full max-w-[460px] max-h-[340px] overflow-visible"
          viewBox="0 0 500 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* High-Tech Gradients */}
            <linearGradient id="mainLaserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="50%" stopColor={isCompleted ? '#10b981' : 'var(--primary)'} stopOpacity="1" />
              <stop offset="100%" stopColor={isCompleted ? '#10b981' : 'var(--primary)'} stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="var(--primary-hover)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="nodeGlowFrom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="nodeGlowTo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isCompleted ? '#10b981' : 'var(--primary)'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isCompleted ? '#10b981' : 'var(--primary)'} stopOpacity="0" />
            </radialGradient>

            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Radar Expansion Ring */}
          <circle
            cx="250"
            cy="180"
            r="80"
            stroke={isCompleted ? '#10b981' : 'var(--primary)'}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            className="animate-radar-ping origin-center"
          />

          {/* Central Rotating Orbital Astrolabe */}
          <g
            className={`origin-center ${
              isConverting ? 'animate-spin' : 'animate-spin-slow'
            }`}
            style={{ transformOrigin: '250px 180px' }}
          >
            {/* Outer Tick Circle */}
            <circle
              cx="250"
              cy="180"
              r="115"
              stroke="currentColor"
              className="text-border"
              strokeWidth="1"
              strokeDasharray="4 8"
              opacity="0.6"
            />
            {/* Satellites */}
            <circle cx="250" cy="65" r="3.5" fill="var(--primary)" opacity="0.8" />
            <circle cx="250" cy="295" r="3.5" fill="var(--primary)" opacity="0.8" />
            <polygon points="135,180 138,183 135,186 132,183" fill="var(--primary)" opacity="0.8" />
            <polygon points="365,180 368,183 365,186 362,183" fill="var(--primary)" opacity="0.8" />
          </g>

          {/* Reverse Rotating Middle Ring */}
          <g
            className={`origin-center ${
              isConverting ? 'animate-spin-reverse-slow' : 'animate-spin-reverse-slow'
            }`}
            style={{ transformOrigin: '250px 180px' }}
          >
            <circle
              cx="250"
              cy="180"
              r="85"
              stroke="url(#orbitGlow)"
              strokeWidth="1.5"
              strokeDasharray="25 15 8 15"
              opacity="0.75"
            />
            <line x1="250" y1="105" x2="250" y2="120" stroke="var(--primary)" strokeWidth="1" opacity="0.6" />
            <line x1="250" y1="240" x2="250" y2="255" stroke="var(--primary)" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Inner Pulsing Core Ring */}
          <circle
            cx="250"
            cy="180"
            r="48"
            stroke={isCompleted ? '#10b981' : 'var(--primary)'}
            strokeWidth="1.5"
            strokeDasharray="6 4"
            className="animate-glow-breathe origin-center"
            style={{ transformOrigin: '250px 180px' }}
            opacity="0.85"
          />

          {/* Curved Circuit Data Channels (Top & Bottom Streams) */}
          <path
            d="M 120 150 Q 250 95 380 150"
            stroke="url(#mainLaserGradient)"
            strokeWidth="1.5"
            fill="none"
            className={isConverting ? 'animate-pulse-beam-fast' : 'animate-pulse-beam'}
            opacity="0.6"
          />
          <path
            d="M 120 210 Q 250 265 380 210"
            stroke="url(#mainLaserGradient)"
            strokeWidth="1.5"
            fill="none"
            className={isConverting ? 'animate-pulse-beam-fast' : 'animate-pulse-beam'}
            opacity="0.6"
          />

          {/* Main Central Laser Beam (Horizontal Conversion Conduit) */}
          <line
            x1="80"
            y1="180"
            x2="420"
            y2="180"
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Animated Pulsing Laser Stream */}
          <line
            x1="120"
            y1="180"
            x2="380"
            y2="180"
            stroke="url(#mainLaserGradient)"
            strokeWidth={isConverting ? '3.5' : '2.5'}
            filter="url(#laserGlow)"
            className={isConverting ? 'animate-pulse-beam-fast' : 'animate-pulse-beam'}
          />

          {/* Central Reactor Transformation Core Node */}
          <circle
            cx="250"
            cy="180"
            r="28"
            fill="var(--background)"
            stroke={isCompleted ? '#10b981' : 'var(--primary)'}
            strokeWidth="2"
            className="shadow-sm"
          />

          {/* Transformation Core Icon */}
          {isCompleted ? (
            <path
              d="M 242 180 L 248 186 L 259 174"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : isConverting ? (
            <g className="animate-spin origin-center" style={{ transformOrigin: '250px 180px' }}>
              <path
                d="M 244 172 A 9 9 0 0 1 258 180"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 256 188 A 9 9 0 0 1 242 180"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              <path
                d="M 243 175 L 257 175 M 253 171 L 257 175 L 253 179"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 257 185 L 243 185 M 247 181 L 243 185 L 247 189"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* ======================================================== */}
          {/* SOURCE FORMAT NODE (LEFT)                                */}
          {/* ======================================================== */}
          <g transform="translate(100, 180)">
            <circle cx="0" cy="0" r="50" fill="url(#nodeGlowFrom)" />
            <circle
              cx="0"
              cy="0"
              r="34"
              fill="var(--background)"
              stroke="var(--border)"
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <circle
              cx="0"
              cy="0"
              r="30"
              fill="var(--surface)"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeDasharray="4 2"
              className="animate-spin-slow origin-center"
            />
            {/* File Icon */}
            <path
              d="M -7 -14 L 3 -14 L 7 -10 L 7 12 L -7 12 Z"
              fill="none"
              stroke="currentColor"
              className="text-foreground"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M 3 -14 L 3 -10 L 7 -10" fill="none" stroke="currentColor" className="text-foreground" strokeWidth="1.2" />
          </g>

          {/* ======================================================== */}
          {/* TARGET FORMAT NODE (RIGHT)                               */}
          {/* ======================================================== */}
          <g transform="translate(400, 180)">
            <circle cx="0" cy="0" r="50" fill="url(#nodeGlowTo)" />
            <circle
              cx="0"
              cy="0"
              r="34"
              fill="var(--background)"
              stroke={isCompleted ? '#10b981' : 'var(--border)'}
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <circle
              cx="0"
              cy="0"
              r="30"
              fill="var(--surface)"
              stroke={isCompleted ? '#10b981' : 'var(--primary)'}
              strokeWidth="1"
              strokeDasharray="4 2"
              className="animate-spin-reverse-slow origin-center"
            />
            {/* Target File Icon */}
            <path
              d="M -7 -14 L 3 -14 L 7 -10 L 7 12 L -7 12 Z"
              fill={isCompleted ? '#10b981' : 'var(--primary)'}
              fillOpacity="0.15"
              stroke={isCompleted ? '#10b981' : 'var(--primary)'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M 3 -14 L 3 -10 L 7 -10"
              fill="none"
              stroke={isCompleted ? '#10b981' : 'var(--primary)'}
              strokeWidth="1.2"
            />
          </g>
        </svg>

        {/* DOM HTML Badges overlaid cleanly above SVG nodes */}
        {/* Source Badge */}
        <div
          className="absolute left-[8%] sm:left-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
        >
          <div className="px-3 py-1 rounded-xl bg-surface/90 border border-border/80 shadow-md backdrop-blur-md flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {displayFrom}
          </div>
          <span className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">
            Source
          </span>
        </div>

        {/* Target Badge */}
        <div
          className="absolute right-[8%] sm:right-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
        >
          <div
            className={`px-3 py-1 rounded-xl shadow-md backdrop-blur-md flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold transition-all duration-300 ${
              isCompleted
                ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-500'
                : 'bg-surface/90 border border-border/80 text-foreground'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCompleted ? 'bg-emerald-500' : 'bg-primary'
              } animate-ping`}
            />
            {displayTo}
          </div>
          <span className="text-[10px] text-muted font-medium mt-1 uppercase tracking-wider">
            Target
          </span>
        </div>

        {/* Live Transformation Status Banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <div
            className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold border backdrop-blur-md transition-all duration-300 flex items-center gap-2 ${
              isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/10'
                : isConverting
                ? 'bg-primary/10 border-primary/30 text-primary animate-pulse shadow-primary/10'
                : 'bg-surface/80 border-border/70 text-muted'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isCompleted ? 'bg-emerald-500' : isConverting ? 'bg-primary' : 'bg-muted'
              }`}
            />
            {isCompleted
              ? 'CONVERSION COMPLETE'
              : isConverting
              ? `PROCESSING STREAM · ${Math.round(progress)}%`
              : `${displayFrom} → ${displayTo} READY`}
          </div>
        </div>
      </div>
    </div>
  )
}
