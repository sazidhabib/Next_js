'use client';

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiDownload, FiArrowRight, FiCode, FiCpu, FiCheckCircle } from "react-icons/fi";
import ParticleField from "./canvas/ParticleField";

const Hero = () => {
  const containerRef = useRef(null);

  // --- Normalized Mouse Coordinates (-0.5 to +0.5) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for futuristic fluid momentum
  const springConfig = { damping: 24, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // --- 3D Avatar Tilt & Multi-Layer Parallax ---
  const avatarRotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const avatarRotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const avatarTranslateX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const avatarTranslateY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  // Floating HUD Badge 1 (Top-Right): Opposing fast parallax
  const badge1X = useTransform(smoothX, [-0.5, 0.5], [35, -35]);
  const badge1Y = useTransform(smoothY, [-0.5, 0.5], [25, -25]);

  // Floating HUD Badge 2 (Bottom-Left): Inverted parallax depth
  const badge2X = useTransform(smoothX, [-0.5, 0.5], [-45, 45]);
  const badge2Y = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  // Floating HUD Badge 3 (Top-Left): Status chip counter-shift
  const badge3X = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const badge3Y = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

  // Cyber Ring behind avatar (rotates with mouse)
  const ringRotate = useTransform(smoothX, [-0.5, 0.5], [-25, 25]);
  const ringScale = useTransform(smoothY, [-0.5, 0.5], [0.94, 1.06]);

  // Mouse-following cyber ambient spotlight
  const glowX = useTransform(smoothX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ["30%", "70%"]);

  // --- Scroll-Driven Multi-Layer Parallax ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scrollTextY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const scrollAvatarY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scrollAvatarScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const scrollAvatarRotate = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const scrollGridY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-16 selection:bg-sky-500/30"
    >
      {/* ── Layer 1: Interactive Particle Constellation Matrix ── */}
      <ParticleField
        particleCount={95}
        lineOpacity={0.24}
        repulsionRadius={140}
        repulsionStrength={1.4}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* ── Layer 2: Mouse-following Cyber Spotlight ── */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ opacity: scrollOpacity }}
      >
        <motion.div
          className="absolute w-[650px] h-[650px] rounded-full"
          style={{
            left: glowX,
            top: glowY,
            x: "-50%",
            y: "-50%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(99,102,241,0.12) 35%, rgba(168,85,247,0.04) 60%, transparent 75%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      {/* ── Layer 3: Futuristic 3D Cyber Horizon Grid (Bottom Perspective) ── */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[280px] z-0 overflow-hidden opacity-30"
        style={{ y: scrollGridY, opacity: scrollOpacity }}
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(56, 189, 248, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            transform: "perspective(500px) rotateX(65deg) scale(1.6)",
            transformOrigin: "bottom center",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 15%, transparent 90%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
      </motion.div>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl w-full mx-auto px-6 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* ── Left Column: Futuristic Typography & Action Buttons ── */}
        <motion.div
          className="flex-1 max-w-2xl text-center lg:text-left"
          style={{ y: scrollTextY, opacity: scrollOpacity }}
        >
          {/* Futuristic Cyber Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 dark:border-sky-400/25 backdrop-blur-md mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[12px] font-mono tracking-[0.2em] uppercase font-semibold text-sky-600 dark:text-sky-400">
              SYSTEM ONLINE // FULL-STACK DEVELOPER
            </span>
          </motion.div>

          {/* Heading with Neon Cyber Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--color-text)] font-extrabold text-[clamp(34px,5.5vw,64px)] leading-[1.1] tracking-tight"
          >
            Engineering Next-Gen Web With{" "}
            <span className="relative inline-block mt-1">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-500 dark:to-indigo-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]">
                Modern 3D & Depth
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 opacity-70" />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[var(--color-text-muted)] text-[16px] sm:text-[17px] leading-relaxed mt-6 max-w-[560px] mx-auto lg:mx-0 font-normal"
          >
            Hi, I&apos;m <span className="font-semibold text-[var(--color-text)]">Mahbub Sazid Habib</span>.
            I craft ultra-responsive web experiences, interactive 3D interfaces, and scalable full-stack architectures.
          </motion.p>

          {/* Futuristic Buttons with Glowing Effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-9"
          >
            {/* Primary Action Button */}
            <a
              href="/Mahbub_Sazid_Habib_Resume.pdf"
              download="Mahbub_Sazid_Habib_Resume.pdf"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <FiDownload className="relative text-base transition-transform group-hover:-translate-y-0.5" />
              <span className="relative">Download Resume</span>
            </a>

            {/* Secondary Action Button */}
            <a
              href="#project"
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm text-[var(--color-text)] border border-[var(--color-border)] bg-[var(--color-surface)]/80 hover:bg-[var(--color-pill-hover)] hover:border-sky-400/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Projects</span>
              <FiArrowRight className="text-sm transition-transform group-hover:translate-x-1 text-sky-400" />
            </a>
          </motion.div>

          {/* Quick Stats Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-6 mt-10 pt-6 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] font-mono"
          >
            <div className="flex items-center gap-2">
              <FiCode className="text-sky-400 text-sm" />
              <span>Full-Stack &amp; Next.js</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <FiCpu className="text-indigo-400 text-sm" />
              <span>Three.js &amp; 3D Depth</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Right Column: Futuristic 3D Holographic Parallax Avatar Stage ── */}
        <motion.div
          className="flex-1 flex items-center justify-center relative perspective-[1200px]"
          style={{
            y: scrollAvatarY,
            scale: scrollAvatarScale,
            rotateZ: scrollAvatarRotate,
            opacity: scrollOpacity,
          }}
        >
          {/* Cyber Ring Halo (Rotates & Tilts with Mouse) */}
          <motion.div
            className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full pointer-events-none z-0"
            style={{
              rotate: ringRotate,
              scale: ringScale,
              border: "1px dashed rgba(56, 189, 248, 0.35)",
              boxShadow: "0 0 50px rgba(56, 189, 248, 0.15), inset 0 0 50px rgba(99, 102, 241, 0.1)",
            }}
          />

          {/* Main 3D Tilted Card Stage */}
          <motion.div
            style={{
              rotateX: avatarRotateX,
              rotateY: avatarRotateY,
              x: avatarTranslateX,
              y: avatarTranslateY,
              transformStyle: "preserve-3d",
            }}
            className="relative z-10 cursor-pointer select-none"
          >
            {/* Holographic Glowing Backdrop Glow */}
            <div className="absolute -inset-6 bg-gradient-to-tr from-sky-500/25 via-indigo-500/20 to-purple-500/25 rounded-3xl blur-2xl opacity-75" />

            {/* Cyber Container Frame */}
            <div className="relative w-[280px] h-[320px] sm:w-[340px] sm:h-[390px] rounded-3xl p-2.5 glass-card overflow-hidden">
              
              {/* Futuristic Corner Brackets HUD */}
              <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-sky-500 dark:border-sky-400 pointer-events-none" />
              <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-sky-500 dark:border-sky-400 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-sky-500 dark:border-sky-400 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-sky-500 dark:border-sky-400 pointer-events-none" />

              {/* Top HUD Status Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 border-b border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                  AVATAR_SYS.v2
                </span>
                <span>SEC // 01</span>
              </div>

              {/* Avatar Image Container with Depth & Subtle Scanline */}
              <div className="relative w-full h-[calc(100%-32px)] rounded-2xl overflow-hidden bg-gradient-to-b from-sky-100/70 via-slate-100/80 to-slate-200/70 dark:from-sky-950/40 dark:via-slate-900/60 dark:to-slate-950">
                <img
                  src="/planet/Sazid.webp"
                  alt="Mahbub Sazid Habib"
                  className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.05] transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/creator.png";
                  }}
                />

                {/* Subtle Moving Cyber Scanline */}
                <motion.div
                  className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/80 dark:via-sky-400/80 to-transparent pointer-events-none"
                  animate={{ y: [0, 320, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Bottom Holographic Shadow Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* ── Parallax Floating HUD Chip 1: Top-Right (Full-Stack Architect) ── */}
            <motion.div
              style={{
                x: badge1X,
                y: badge1Y,
                translateZ: "60px",
              }}
              className="absolute -top-5 -right-6 sm:-right-8 px-4 py-2.5 rounded-xl glass-card flex items-center gap-2.5 pointer-events-none z-20"
            >
              <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 text-sm">
                ✦
              </div>
              <div>
                <p className="text-[12px] font-bold text-[var(--color-text)] leading-none">
                  Full-Stack Architect
                </p>
                <p className="text-[10px] text-sky-600 dark:text-sky-400 font-mono mt-0.5 font-semibold">
                  Scalable Web Systems
                </p>
              </div>
            </motion.div>

            {/* ── Parallax Floating HUD Chip 2: Bottom-Left (Tech Stack Chips) ── */}
            <motion.div
              style={{
                x: badge2X,
                y: badge2Y,
                translateZ: "80px",
              }}
              className="absolute -bottom-6 -left-6 sm:-left-10 px-4 py-3 rounded-2xl glass-card pointer-events-none z-20"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <FiCheckCircle className="text-emerald-500 dark:text-emerald-400 text-xs" />
                <span className="text-[11px] font-mono font-semibold text-[var(--color-text)]">
                  Production Stack
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30 dark:border-sky-400/30 font-medium">
                  Next.js 16
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 dark:border-indigo-400/30 font-medium">
                  Three.js
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30 dark:border-purple-400/30 font-medium">
                  Node.js
                </span>
              </div>
            </motion.div>

            {/* ── Parallax Floating HUD Chip 3: Status Beacon ── */}
            <motion.div
              style={{
                x: badge3X,
                y: badge3Y,
                translateZ: "40px",
              }}
              className="absolute top-1/2 -left-8 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card pointer-events-none z-20"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wide">
                ACTIVE
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      {/* ── Bottom Scroll Indicator with Parallax ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ opacity: scrollOpacity }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--color-text-muted)]">
          SCROLL
        </span>
        <a href="#about">
          <div className="w-[30px] h-[52px] rounded-full border-2 border-[var(--color-border)] flex justify-center items-start p-1.5 hover:border-sky-400 transition-colors">
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
