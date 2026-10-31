'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/navigation";
import { FiGithub, FiExternalLink, FiArrowRight, FiTerminal } from "react-icons/fi";

import { styles } from "../styles";
import SectionWrapper from "../hoc/SectionWrapper";
import usePortfolioData from "../hooks/usePortfolioData";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  id,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const router = useRouter();

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const handleCardClick = () => {
    if (id) router.push(`/project/${id}`);
  };

  const cleanImageSrc = (img) => {
    if (!img) return "/src/assets/web.png";
    if (typeof img === "string" && img.includes("pathakbondhu")) {
      return "/src/assets/pathokbonddhufullpage.webp";
    }
    return img;
  };
  const resolvedImage = cleanImageSrc(image);

  const cleanDescription = typeof description === 'string' ? description.replace(/<[^>]*>?/gm, '') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={handleCardClick}
      className="cursor-pointer h-full"
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
          className="relative h-full glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 overflow-hidden flex flex-col justify-between"
        >
          {/* Subtle Grid Texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div>
            {/* Top Telemetry Row */}
            <div
              style={{ transform: "translateZ(15px)" }}
              className="flex items-center justify-between pb-2 sm:pb-3 mb-2.5 sm:mb-3.5 border-b border-[var(--color-border)] text-[9px] sm:text-[10px] font-mono text-[var(--color-text-muted)]"
            >
              <div className="flex items-center gap-1 sm:gap-1.5 text-sky-600 dark:text-sky-400 font-semibold tracking-wider">
                <FiTerminal className="text-[10px] sm:text-xs shrink-0" />
                <span className="truncate">PRJ // {String(index + 1).padStart(2, "0")}</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[8px] sm:text-[9.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
                <span className="hidden xs:inline">VERIFIED</span>
              </span>
            </div>

            {/* Futuristic Viewport Window for Media */}
            <div
              style={{ transform: "translateZ(30px)" }}
              className="relative w-full h-[105px] xs:h-[125px] sm:h-[175px] md:h-[200px] rounded-xl sm:rounded-2xl overflow-hidden bg-transparent dark:bg-slate-950/80 shadow-none dark:shadow-inner group/media"
            >
              {/* Media Content */}
              {resolvedImage && resolvedImage.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={resolvedImage}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={resolvedImage}
                  alt={name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/creator.png";
                  }}
                />
              )}

              {/* Viewport Ambient Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/80 via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Top Quick Actions (GitHub) */}
              {source_code_link && (
                <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 flex items-center gap-1.5 z-10">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(source_code_link, "_blank");
                    }}
                    title="View GitHub Repository"
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/90 dark:bg-slate-900/85 hover:bg-sky-500 hover:text-white border border-[var(--color-border)] text-slate-800 dark:text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <FiGithub className="text-xs sm:text-sm" />
                  </div>
                </div>
              )}

              {/* View Project Pill on hover */}
              <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-white/90 dark:bg-slate-900/85 border border-sky-500/30 dark:border-sky-400/40 text-[9px] sm:text-[11px] font-mono text-sky-600 dark:text-sky-400 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity shadow-xs">
                <span>OPEN</span>
                <FiExternalLink className="text-[9px] sm:text-[10px]" />
              </div>
            </div>

            {/* Project Details */}
            <div style={{ transform: "translateZ(20px)" }} className="mt-3 sm:mt-5">
              <h3 className="text-[var(--color-text)] font-bold text-[14px] sm:text-[18px] md:text-[19px] tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1 sm:line-clamp-none">
                {name}
              </h3>
              <p className="mt-1 sm:mt-2 text-[var(--color-text-muted)] text-[11px] sm:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-3">
                {truncateText(cleanDescription, 16)}
              </p>
            </div>
          </div>

          {/* Card Footer: Tech Stack Chips & Explore Action */}
          <div style={{ transform: "translateZ(15px)" }} className="mt-3 sm:mt-5 pt-2.5 sm:pt-4 border-t border-[var(--color-border)]/60">
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-4">
              {Array.isArray(tags) &&
                tags.slice(0, 3).map((tag, tIdx) => {
                  const tagName = typeof tag === 'object' && tag !== null && tag.name ? tag.name : String(tag);
                  return (
                    <span
                      key={`${id || index}-${tIdx}`}
                      className="text-[9px] sm:text-[11px] font-mono text-sky-700 dark:text-sky-400 bg-[var(--color-pill-bg)] px-1.5 py-0.5 sm:px-2.5 rounded-md border border-[var(--color-border)] font-medium truncate max-w-[90px] sm:max-w-none"
                    >
                      #{tagName}
                    </span>
                  );
                })}
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span className="truncate">CASE STUDY</span>
              <FiArrowRight className="text-xs sm:text-sm shrink-0" />
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const { projects } = usePortfolioData();

  return (
    <>
      <motion.div variants={textVariant()} className="text-center">
        <p className={styles.sectionSubText}>Production Showcase</p>
        <h2 className={styles.sectionHeadText}>Featured Projects.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-[var(--color-text-muted)] text-[15px] sm:text-[16px] max-w-2xl mx-auto leading-relaxed text-center"
      >
        Real-world applications engineered with modular architecture, performance-first patterns, and dynamic content systems.
      </motion.p>

      {/* Cyber Projects Grid - 2 columns on mobile, 2 on md, 3 on lg */}
      <div className="mt-10 sm:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id || `project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "project");
