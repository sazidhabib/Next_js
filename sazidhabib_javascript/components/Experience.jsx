'use client';

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import SectionWrapper from "../hoc/SectionWrapper";
import { textVariant } from "../utils/motion";
import usePortfolioData from "../hooks/usePortfolioData";

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      icon={
        <img
          src={experience?.img}
          alt={experience?.company}
          className="rounded-full object-cover w-full h-full"
        />
      }
      contentStyle={{
        background: "rgba(17, 17, 34, 0.6)",
        color: "#fff",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
      contentArrowStyle={{
        borderRight: "7px solid rgba(255, 255, 255, 0.3)",
      }}
      date={experience?.date}
    >
      <div>
        <div className="flex gap-3">
          <img
            src={experience?.img}
            alt={experience?.company}
            className="h-10 w-10 rounded-md object-cover mt-1"
          />
          <div className="flex flex-col">
            <div className="text-base font-semibold text-white">
              {experience?.role}
            </div>
            <div className="text-sm font-medium text-slate-400">
              {experience?.company}
            </div>
            <div className="text-xs font-normal text-slate-500">
              {experience?.date}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-300">
          {experience?.desc && (
            <ul className="mt-4 list-disc ml-4 space-y-1.5">
              {experience.desc.map((item, i) => (
                <li key={i} className="text-[13px] leading-relaxed pl-1">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {experience?.skills && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {experience.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-white/5 text-slate-300 text-[11px] px-2 py-1 rounded-md border border-white/5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  const { experiences } = usePortfolioData();

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Experience</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience.
        </h2>
      </motion.div>

      <div className="mt-16 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
