'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FiCalendar } from "react-icons/fi";

import { styles } from "../styles";
import SectionWrapper from "../hoc/SectionWrapper";
import { textVariant, fadeIn } from "../utils/motion";
import usePortfolioData from "../hooks/usePortfolioData";

const ExperienceCard = ({ experience, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex flex-col md:flex-row items-center w-full mb-10 sm:mb-12 last:mb-0 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* ── Left / Right Card Container (indented on mobile to accommodate timeline line) ── */}
      <div className="w-full pl-9 sm:pl-12 md:pl-0 md:w-[calc(50%-40px)]">
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
            className="relative glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 overflow-hidden"
          >
            {/* Top Telemetry Header */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="flex items-center justify-between pb-2.5 sm:pb-3.5 mb-3 sm:mb-4 border-b border-[var(--color-border)] text-[10px] sm:text-[11px] font-mono"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 text-sky-600 dark:text-sky-400 font-semibold tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
                <span>EXP_SYS // {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[var(--color-text-muted)] text-[9px] sm:text-[11px]">
                <FiCalendar className="text-sky-600 dark:text-sky-400 text-xs shrink-0" />
                <span>{experience?.date}</span>
              </div>
            </div>

            {/* Company & Role Header */}
            <div style={{ transform: "translateZ(30px)" }} className="flex items-start gap-3 sm:gap-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl p-1 bg-gradient-to-br from-sky-400/20 to-indigo-500/20 border border-sky-500/20 dark:border-sky-400/30 shrink-0 overflow-hidden shadow-sm">
                <img
                  src={experience?.img}
                  alt={experience?.company}
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/creator.png";
                  }}
                />
              </div>

              <div>
                <h3 className="text-[var(--color-text)] font-bold text-[16px] sm:text-[19px] md:text-[20px] leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {experience?.role}
                </h3>
                <p className="text-[13px] sm:text-[14px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 mt-0.5">
                  {experience?.company}
                </p>
              </div>
            </div>

            {/* Deliverables / Descriptions */}
            {experience?.desc && (
              <div style={{ transform: "translateZ(20px)" }} className="mt-4 sm:mt-5 space-y-2 sm:space-y-2.5">
                {experience.desc.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-2.5 text-[12px] sm:text-[13px] text-[var(--color-text-muted)] leading-relaxed">
                    <span className="text-sky-600 dark:text-sky-400 font-mono mt-1 shrink-0 text-xs">▹</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack Chips */}
            {experience?.skills && (
              <div
                style={{ transform: "translateZ(25px)" }}
                className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[var(--color-border)]/60 flex flex-wrap gap-1 sm:gap-1.5"
              >
                {experience.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-[var(--color-pill-bg)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Tilt>
      </div>

      {/* ── Node on Cyber Conduit (Visible on both Mobile and Desktop) ── */}
      <div className="flex absolute left-3 sm:left-4 md:left-1/2 -translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 items-center justify-center z-10">
        <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-surface)] border-2 border-sky-400 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6)]">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          <span className="absolute -inset-1 rounded-full border border-sky-400/40 animate-ping pointer-events-none" />
        </div>
      </div>

      {/* Empty spacer for the other column in md layout */}
      <div className="hidden md:block w-[calc(50%-40px)]" />
    </motion.div>
  );
};

const Experience = () => {
  const { experiences } = usePortfolioData();

  return (
    <>
      <motion.div variants={textVariant()} className="text-center">
        <p className={styles.sectionSubText}>Trajectory</p>
        <h2 className={styles.sectionHeadText}>Work Experience.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-[var(--color-text-muted)] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mx-auto text-center"
      >
        Track record of engineering robust web solutions, leading architectural features, and delivering production-ready applications.
      </motion.p>

      {/* Futuristic Cyber Timeline Conduit */}
      <div className="relative mt-14 sm:mt-20 max-w-5xl mx-auto">
        {/* Glowing Cyber Conduit Line (Visible on Mobile & Desktop) */}
        <div className="absolute left-3 sm:left-4 md:left-1/2 -translate-x-1/2 top-3 bottom-3 w-[2px] bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-500 opacity-60 shadow-[0_0_15px_rgba(56,189,248,0.5)]" />

        {/* Experience Cards */}
        <div className="flex flex-col">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience?.id || `exp-${index}`}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
