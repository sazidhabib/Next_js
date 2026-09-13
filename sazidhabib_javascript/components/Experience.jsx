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
        background: "var(--color-surface-translucent)",
        color: "var(--color-text)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--color-border)",
        borderRadius: "16px",
        boxShadow: "var(--shadow-card)",
      }}
      contentArrowStyle={{
        borderRight: "7px solid var(--color-border)",
      }}
      date={experience?.date}
    >
      <div>
        <div className="flex gap-3">
          <img
            src={experience?.img}
            alt={experience?.company}
            className="h-10 w-10 rounded-xl object-cover mt-1 border border-[var(--color-border)]"
          />
          <div className="flex flex-col">
            <div className="text-base font-bold text-[var(--color-text)]">
              {experience?.role}
            </div>
            <div className="text-sm font-semibold text-[var(--color-accent)]">
              {experience?.company}
            </div>
            <div className="text-xs font-normal text-[var(--color-text-muted)]">
              {experience?.date}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-[var(--color-text-muted)]">
          {experience?.desc && (
            <ul className="mt-3 list-disc ml-4 space-y-1.5">
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
                    className="bg-[var(--color-pill-bg)] text-[var(--color-text)] text-[11px] px-2.5 py-1 rounded-md border border-[var(--color-border)] font-medium"
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

      <div className="mt-20 flex flex-col">
        <VerticalTimeline lineColor="var(--color-border)">
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
