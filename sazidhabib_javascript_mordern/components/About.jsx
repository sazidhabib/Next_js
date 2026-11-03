'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FiLayout, FiCpu, FiServer, FiBox, FiCheckCircle } from "react-icons/fi";

import { styles } from "../styles";
import SectionWrapper from "../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../utils/motion";

// Unique Futuristic 3D Icon Matrix for each service
const serviceMetadata = [
  {
    title: "Web & Frontend",
    subtitle: "High-Performance Web",
    code: "FE_SYS // 01",
    tagline: "Next.js • TypeScript • UI/UX",
    accentGradient: "from-sky-400 via-blue-500 to-cyan-400",
    glowColor: "rgba(56, 189, 248, 0.25)",
    iconBg: "bg-sky-500/15 border-sky-400/30 text-sky-400",
    Icon: FiLayout,
    features: ["Responsive Architecture", "SEO & Core Web Vitals", "Smooth Micro-Interactions"],
  },
  {
    title: "React & Next.js",
    subtitle: "Modern Reactive Systems",
    code: "RCT_SYS // 02",
    tagline: "React 19 • State & APIs",
    accentGradient: "from-blue-400 via-indigo-500 to-sky-400",
    glowColor: "rgba(99, 102, 241, 0.25)",
    iconBg: "bg-indigo-500/15 border-indigo-400/30 text-indigo-400",
    Icon: FiCpu,
    features: ["Custom Hooks & State", "Server Components", "API Optimization"],
  },
  {
    title: "Cloud & Backend",
    subtitle: "Scalable Data Pipelines",
    code: "BE_SYS // 03",
    tagline: "Node • Express • MySQL • ORM",
    accentGradient: "from-emerald-400 via-teal-500 to-cyan-400",
    glowColor: "rgba(52, 211, 153, 0.25)",
    iconBg: "bg-emerald-500/15 border-emerald-400/30 text-emerald-400",
    Icon: FiServer,
    features: ["REST & Auth Security", "Relational & NoSQL", "Clean Architecture"],
  },
  {
    title: "3D & Creative",
    subtitle: "Spatial & Depth Web",
    code: "3D_SYS // 04",
    tagline: "Three.js • Fiber • Motion",
    accentGradient: "from-purple-400 via-fuchsia-500 to-indigo-400",
    glowColor: "rgba(168, 85, 247, 0.25)",
    iconBg: "bg-purple-500/15 border-purple-400/30 text-purple-400",
    Icon: FiBox,
    features: ["Interactive 3D WebGL", "Particle Networks", "Modern Parallax Systems"],
  },
];

const ServiceCard = ({ index, service }) => {
  const { title, subtitle, code, tagline, accentGradient, glowColor, iconBg, Icon, features } = service;

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.12, 0.7)}
      className="w-full h-full"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        glareEnable
        glareMaxOpacity={0.12}
        glareColor="#38bdf8"
        glareBorderRadius="1.5rem"
        glarePosition="all"
        scale={1.02}
        transitionSpeed={1400}
        className="group relative h-full"
      >
        {/* Card Body - Matches Contact glass-card styling and shadow exactly */}
        <div
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-full glass-card rounded-2xl sm:rounded-3xl p-3.5 xs:p-4 sm:p-6 md:p-7 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Cyber Grid Background in Card */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Glowing Ambient Radial Glow */}
          <div
            className="absolute -top-12 -right-12 w-28 h-28 sm:w-32 sm:h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: glowColor }}
          />

          {/* Corner Crosshairs HUD */}
          <div className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] text-sky-500/40 dark:text-sky-400/40 font-mono pointer-events-none">+</div>
          <div className="absolute top-2.5 right-2.5 text-[9px] sm:text-[10px] text-sky-500/40 dark:text-sky-400/40 font-mono pointer-events-none">+</div>
          <div className="absolute bottom-2.5 left-2.5 text-[9px] sm:text-[10px] text-sky-500/40 dark:text-sky-400/40 font-mono pointer-events-none">+</div>
          <div className="absolute bottom-2.5 right-2.5 text-[9px] sm:text-[10px] text-sky-500/40 dark:text-sky-400/40 font-mono pointer-events-none">+</div>

          <div>
            {/* Header Row */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="flex items-center justify-between pb-2.5 sm:pb-4 border-b border-[var(--color-border)] text-[9px] sm:text-[10px] font-mono text-[var(--color-text-muted)]"
            >
              <span className="tracking-wider uppercase text-sky-600 dark:text-sky-400 font-semibold truncate">{code}</span>
              <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 text-[8px] sm:text-[10px] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">ONLINE</span>
              </span>
            </div>

            {/* Center 3D Icon Presentation with Orbital Pulse */}
            <div
              style={{ transform: "translateZ(35px)" }}
              className="my-3 sm:my-5 flex flex-col items-center justify-center relative"
            >
              {/* Holographic Glowing Ring Behind Icon */}
              <div
                className="absolute w-14 h-14 sm:w-20 sm:h-20 rounded-2xl blur-xl opacity-40 group-hover:opacity-90 group-hover:scale-125 transition-all duration-500 pointer-events-none"
                style={{ background: glowColor }}
              />

              {/* The Unique Futuristic 3D Icon Container */}
              <div
                className={`relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center border shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconBg}`}
              >
                <Icon className="text-2xl xs:text-3xl sm:text-4xl filter drop-shadow-[0_0_10px_currentColor]" />
                
                {/* Corner accent marks */}
                <div className="absolute -top-1 -left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 border-t border-l border-current opacity-80" />
                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 border-b border-r border-current opacity-80" />
              </div>

              <span className="mt-1.5 sm:mt-3 text-[9px] sm:text-[11px] font-mono text-[var(--color-text-muted)] tracking-wider truncate max-w-full text-center">
                {tagline}
              </span>
            </div>
          </div>

          {/* Titles & Capability Features */}
          <div style={{ transform: "translateZ(25px)" }} className="space-y-2 sm:space-y-3 mt-1 sm:mt-2">
            <div>
              <h3 className="text-[var(--color-text)] text-[13px] xs:text-[15px] sm:text-[17px] md:text-[18px] font-bold tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 line-clamp-1 sm:line-clamp-none">
                {title}
              </h3>
              <p className="text-[10px] sm:text-[12px] font-mono text-[var(--color-text-muted)] mt-0.5 truncate">
                {subtitle}
              </p>
            </div>

            {/* Feature Pills */}
            <ul className="space-y-1 sm:space-y-1.5 pt-1.5 sm:pt-2 border-t border-[var(--color-border)]/60">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[12px] text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors"
                >
                  <FiCheckCircle className="text-sky-600 dark:text-sky-400 text-[10px] sm:text-xs shrink-0" />
                  <span className="truncate">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Overview</p>
        <h2 className={styles.sectionHeadText}>Engineering Capabilities.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-[var(--color-text-muted)] text-[15px] sm:text-[16px] leading-relaxed max-w-3xl font-normal"
      >
        I specialize in crafting high-performance, modern full-stack systems. Combining{" "}
        <span className="text-[var(--color-text)] font-semibold">Next.js 16, React 19, TypeScript</span> with robust backend architectures (Node.js, Express, MySQL/Sequelize, MongoDB) and immersive{" "}
        <span className="text-sky-400 font-semibold">Three.js 3D depth</span>. Every project is built for speed, visual excellence, and business impact.
      </motion.p>

      {/* Futuristic 4-Card Service Grid - 2 columns on mobile, 4 columns on large screens */}
      <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {serviceMetadata.map((service, index) => (
          <ServiceCard key={service.code} index={index} service={service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
