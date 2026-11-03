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
  Others: FiTool,
  DevOps: FiCode,
};

const SkillCard = ({ skill, index, totalSkills }) => {
  const IconComponent = categoryIcons[skill.title] || FiCode;
  const isLastOdd = totalSkills % 2 !== 0 && index === totalSkills - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full min-w-0 ${
        isLastOdd ? "col-span-2 lg:col-span-1" : "col-span-1"
      }`}
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
          className="relative h-full glass-card rounded-2xl sm:rounded-3xl p-3 xs:p-3.5 sm:p-7 overflow-hidden flex flex-col justify-start"
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
              className="flex items-center justify-between pb-2.5 sm:pb-4 mb-3 sm:mb-5 border-b border-[var(--color-border)] text-[9px] xs:text-[10px] sm:text-[11px] font-mono text-[var(--color-text-muted)]"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                <span className="text-sky-600 dark:text-sky-400 font-semibold tracking-wider uppercase text-[8.5px] xs:text-[9.5px] sm:text-[11px]">
                  MODULE // 0{index + 1}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[var(--color-pill-bg)] border border-[var(--color-border)] text-[8px] xs:text-[9px] sm:text-xs font-mono shrink-0">
                {skill.skills?.length || 0} NODES
              </span>
            </div>

            {/* Category Title with Icon */}
            <div style={{ transform: "translateZ(25px)" }} className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6">
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sky-500/10 border border-sky-500/20 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 text-sm sm:text-lg shadow-sm shrink-0">
                <IconComponent />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm xs:text-base sm:text-xl font-bold text-[var(--color-text)] tracking-tight truncate">
                  {skill.title}
                </h3>
                <p className="text-[9px] xs:text-[10.5px] sm:text-[12px] font-mono text-[var(--color-text-muted)] truncate">
                  Production-Ready Stack
                </p>
              </div>
            </div>
          </div>

          {/* Skill Micro-Pills Grid */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="flex flex-wrap gap-1 xs:gap-1.5 sm:gap-2.5 items-center mt-1"
          >
            {skill.skills.map((item, itemIndex) => (
              <motion.div
                key={`skill-item-${itemIndex}`}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="group/item inline-flex items-center gap-1 sm:gap-2 bg-[var(--color-pill-bg)] border border-[var(--color-border)] hover:border-sky-500/40 dark:hover:border-sky-400/50 hover:bg-sky-500/10 rounded-lg sm:rounded-xl px-1.5 py-1 xs:px-2 xs:py-1 sm:px-3 sm:py-1.5 transition-all duration-300 shadow-sm cursor-default"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4.5 sm:h-4.5 object-contain filter drop-shadow-sm group-hover/item:scale-110 transition-transform shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.svgrepo.com/show/354262/react-router.svg";
                  }}
                />
                <span className="text-[var(--color-text)] text-[9.5px] xs:text-[10.5px] sm:text-[12.5px] font-medium group-hover/item:text-sky-600 dark:group-hover/item:text-sky-400 transition-colors whitespace-nowrap">
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

      {/* Cyber Skills Grid: 2 cards in one line on mobile with the 3rd card below, 3 cards in one row on desktop */}
      <section id="skills" className="mt-12 sm:mt-16 pb-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {skills.map((skill, index) => (
            <SkillCard
              key={`skill-${index}`}
              skill={skill}
              index={index}
              totalSkills={skills.length}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default SectionWrapper(Skills, "skill");
