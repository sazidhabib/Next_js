'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FiLayers, FiDatabase, FiTool, FiCode } from "react-icons/fi";

import { styles } from "../styles";
import SectionWrapper from "../hoc/SectionWrapper";
import { textVariant, fadeIn } from "../utils/motion";
import usePortfolioData from "../hooks/usePortfolioData";

const categoryIcons = {
  Frontend: FiLayers,
  Backend: FiDatabase,
  "Tools & Others": FiTool,
  DevOps: FiCode,
};

const SkillCard = ({ skill, index }) => {
  const IconComponent = categoryIcons[skill.title] || FiCode;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-1 min-w-[260px] max-w-[560px]"
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
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
          className="relative h-full glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle Grid Texture in Card */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div>
            {/* Top Category Telemetry Header */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 border-b border-[var(--color-border)] text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)]"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                <span className="text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase">
                  SKILL_MODULE // 0{index + 1}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[var(--color-pill-bg)] border border-[var(--color-border)] text-[10px] sm:text-xs font-mono">
                {skill.skills?.length || 0} NODES
              </span>
            </div>

            {/* Category Title with Icon */}
            <div style={{ transform: "translateZ(25px)" }} className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 text-base sm:text-lg shadow-sm shrink-0">
                <IconComponent />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold text-[var(--color-text)] tracking-tight">
                  {skill.title}
                </h3>
                <p className="text-[11px] sm:text-[12px] font-mono text-[var(--color-text-muted)]">
                  Production-Ready Stack
                </p>
              </div>
            </div>
          </div>

          {/* Skill Micro-Pills Grid - Compact on mobile so skills wrap in multi-column rows like third card */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="flex flex-wrap gap-1.5 sm:gap-2.5 items-center mt-1"
          >
            {skill.skills.map((item, itemIndex) => (
              <motion.div
                key={`skill-item-${itemIndex}`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="group/item inline-flex items-center gap-1.5 sm:gap-2 bg-[var(--color-pill-bg)] border border-[var(--color-border)] hover:border-sky-500/40 dark:hover:border-sky-400/50 hover:bg-sky-500/10 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-1.5 transition-all duration-300 shadow-sm cursor-default"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 object-contain filter drop-shadow-sm group-hover/item:scale-110 transition-transform shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.svgrepo.com/show/354262/react-router.svg";
                  }}
                />
                <span className="text-[var(--color-text)] text-[11px] sm:text-[12.5px] font-medium group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400 transition-colors whitespace-nowrap">
                  {item.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Skills = () => {
  const { skills } = usePortfolioData();

  return (
    <>
      <motion.div variants={textVariant()} className="text-center">
        <p className={styles.sectionSubText}>Expertise</p>
        <h2 className={styles.sectionHeadText}>Technical Arsenal.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-[var(--color-text-muted)] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mx-auto text-center"
      >
        Comprehensive technology matrix applied across high-scale frontends, secure backend APIs, and distributed data systems.
      </motion.p>

      {/* Cyber Skills Grid */}
      <section id="skills" className="mt-12 sm:mt-16 pb-4">
        <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center items-stretch max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <SkillCard key={`skill-${index}`} skill={skill} index={index} />
          ))}
        </div>
      </section>
    </>
  );
};

export default SectionWrapper(Skills, "skill");
