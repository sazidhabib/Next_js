'use client';

import { motion } from "framer-motion";
import SectionWrapper from "../hoc/SectionWrapper";
import { technologies } from "../constants";
import { styles } from "../styles";
import { textVariant, fadeIn } from "../utils/motion";

const floatAnimation = (i) => ({
  y: [0, -8, 0],
  transition: {
    duration: 2.4 + (i % 5) * 0.4,
    repeat: Infinity,
    repeatType: "loop",
    ease: "easeInOut",
    delay: (i % 7) * 0.3,
  },
});

const TechCard = ({ technology, index }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.08, 0.6)}
      className="group relative flex flex-col items-center"
    >
      <motion.div
        animate={floatAnimation(index)}
        whileHover={{
          y: -6,
          scale: 1.05,
          transition: { duration: 0.25, ease: "easeOut" },
        }}
        className="
          relative flex flex-col items-center justify-center
          w-[100px] h-[100px] sm:w-[110px] sm:h-[110px]
          rounded-2xl cursor-pointer
          glass-card
          transition-all duration-300 ease-out
          hover:border-[var(--color-accent)]
        "
      >
        {/* Glow ring on hover */}
        <div
          className="
            absolute inset-0 rounded-2xl opacity-0
            group-hover:opacity-100
            transition-opacity duration-300
            pointer-events-none
          "
          style={{
            background:
              "radial-gradient(circle at center, var(--color-accent) 0%, transparent 70%)",
            opacity: 0,
            filter: "blur(16px)",
          }}
        />

        <img
          src={technology.icon}
          alt={technology.name}
          className="
            w-12 h-12 sm:w-14 sm:h-14 object-contain
            transition-transform duration-300 ease-out
            group-hover:scale-110
            drop-shadow-sm
          "
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </motion.div>

      {/* Tech name */}
      <p
        className="
          mt-3 text-[11px] sm:text-xs font-medium tracking-wide
          text-[var(--color-text-muted)]
          group-hover:text-[var(--color-accent)]
          transition-colors duration-300
          text-center leading-tight
        "
      >
        {technology.name}
      </p>
    </motion.div>
  );
};

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Technologies</p>
        <h2 className={styles.sectionHeadText}>Tech Stack.</h2>
      </motion.div>

      <div className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-10">
        {technologies.map((technology, index) => (
          <TechCard key={technology.name} technology={technology} index={index} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "");
