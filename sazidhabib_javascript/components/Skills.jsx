'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { styles } from "../styles";
import SectionWrapper from "../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../utils/motion";
import usePortfolioData from "../hooks/usePortfolioData";

const SkillCard = ({ skill, index }) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.15, 0.75)}
      className="w-full max-w-[480px]"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        glareEnable
        glareMaxOpacity={0.15}
        glareColor="#ffffff"
        glarePosition="all"
        scale={1.02}
        transitionSpeed={1500}
        className="glass-card rounded-xl p-6 h-full"
      >
        <h3 className="text-lg font-semibold mb-6 text-center text-white">
          {skill.title}
        </h3>
        <div className="flex justify-center flex-wrap gap-2.5">
          {skill.skills.map((item, itemIndex) => (
            <div
              key={`skill-item-${itemIndex}`}
              className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-6 h-6 object-contain"
              />
              <span className="text-slate-300 text-[13px] font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Skills = () => {
  const { skills } = usePortfolioData();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Expertise</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Skills</h2>
      </motion.div>

      <section id="skills" className="pb-8">
        <div className="container mx-auto px-4">
          <div className="mt-16 flex flex-wrap gap-6 justify-center">
            {skills.map((skill, index) => (
              <SkillCard key={`skill-${index}`} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SectionWrapper(Skills, "skill");
