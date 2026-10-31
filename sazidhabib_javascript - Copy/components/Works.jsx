'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/navigation";

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

  const cleanDescription = typeof description === 'string' ? description.replace(/<[^>]*>?/gm, '') : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.08, ease: "easeOut" }}
      onClick={handleCardClick}
      className="cursor-pointer h-full"
    >
      <Tilt
        tiltMaxAngleX={12}
        tiltMaxAngleY={12}
        perspective={1000}
        glareEnable
        glareMaxOpacity={0.18}
        glareColor="#ffffff"
        glarePosition="all"
        scale={1.02}
        transitionSpeed={1500}
        className="glass-card rounded-2xl p-[1px] glow-border h-full"
      >
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 h-full flex flex-col justify-between transition-colors duration-400">
          <div>
            <div className="relative w-full h-[140px] md:h-[200px] rounded-xl overflow-hidden bg-slate-900/30">
              {image && image.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={image}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={image || "/src/assets/web.png"}
                  alt={name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/src/assets/web.png";
                  }}
                />
              )}

              {source_code_link && (
                <div className="absolute inset-0 flex justify-end m-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(source_code_link, "_blank");
                    }}
                    className="glass w-9 h-9 rounded-full flex justify-center items-center cursor-pointer hover:bg-white/30 transition-colors shadow-md"
                  >
                    <img
                      src="/src/assets/github.png"
                      alt="source code"
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col">
              <h3 className="text-[var(--color-text)] font-bold text-[18px] tracking-tight">
                {name}
              </h3>
              <p className="mt-2 text-[var(--color-text-muted)] text-[13px] leading-relaxed">
                <span className="hidden md:inline">
                  {truncateText(cleanDescription, 26)}
                </span>
                <span className="md:hidden">{truncateText(cleanDescription, 12)}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.isArray(tags) && tags.map((tag, tIdx) => {
              const tagName = typeof tag === 'object' && tag !== null && tag.name ? tag.name : String(tag);
              const tagColor = typeof tag === 'object' && tag !== null && tag.color ? tag.color : 'text-sky-500';
              return (
                <span
                  key={`${id || index}-${tIdx}`}
                  className={`text-[11px] font-mono ${tagColor} bg-[var(--color-pill-bg)] px-2 py-0.5 rounded-md border border-[var(--color-border)] font-medium`}
                >
                  #{tagName}
                </span>
              );
            })}
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
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Projects</p>
        <h2 className={styles.sectionHeadText}>My Work.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-[var(--color-text-muted)] text-[15px] max-w-3xl leading-relaxed"
      >
        Following projects showcase my skills and experience through real-world
        examples of my work. Each project is described with features and links to repositories.
      </motion.p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, index) => (
          <ProjectCard key={project.id || `project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "project");
