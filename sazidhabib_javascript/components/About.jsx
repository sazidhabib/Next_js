'use client';

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { styles } from "../styles";
import { services } from "../constants";
import SectionWrapper from "../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.15, 0.75)}>
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={900}
      glareEnable
      glareMaxOpacity={0.15}
      glareColor="#ffffff"
      glarePosition="all"
      scale={1.03}
      transitionSpeed={1500}
      className="green-pink-gradient rounded-2xl p-[2px] shadow-card h-full"
    >
      <div className="bg-surface rounded-2xl py-8 px-8 min-h-[150px] md:min-h-[240px] h-full flex flex-col items-center justify-center gap-5">
        <img
          src={icon}
          alt={title}
          className="w-14 h-14 md:w-16 md:h-16 object-contain"
        />
        <h3 className="text-white text-[15px] md:text-[18px] font-semibold text-center tracking-tight">
          {title}
        </h3>
      </div>
    </Tilt>
  </motion.div>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>About</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-slate-400 text-[15px] leading-relaxed max-w-3xl"
      >
        I&apos;m a skilled software developer with experience in TypeScript and
        JavaScript, and expertise in frameworks like React, Next.js, Node.js, Express, MySQL with Sequelize ORM, and
        Three.js. I&apos;m a quick learner and collaborate closely with clients
        to create efficient, scalable, and user-friendly solutions that solve
        real-world problems.
      </motion.p>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
