'use client';

import { useState, useEffect } from 'react';
import { skills as fallbackSkills, experiences as fallbackExperiences } from '../constants/Constants';
import { projects as fallbackProjects, technologies as fallbackTechnologies } from '../constants/index';

export const usePortfolioData = () => {
  const [skills, setSkills] = useState(fallbackSkills);
  const [experiences, setExperiences] = useState(fallbackExperiences);
  const [projects, setProjects] = useState(fallbackProjects);
  const [technologies, setTechnologies] = useState(fallbackTechnologies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [skillsRes, expRes, projRes, techRes] = await Promise.allSettled([
          fetch('/api/skills'),
          fetch('/api/experiences'),
          fetch('/api/projects'),
          fetch('/api/technologies')
        ]);

        if (skillsRes.status === 'fulfilled' && skillsRes.value.ok) {
          const skillsData = await skillsRes.value.json();
          if (Array.isArray(skillsData) && skillsData.length > 0) {
            setSkills(skillsData);
          }
        }

        if (expRes.status === 'fulfilled' && expRes.value.ok) {
          const expData = await expRes.value.json();
          if (Array.isArray(expData) && expData.length > 0) {
            setExperiences(expData);
          }
        }

        if (projRes.status === 'fulfilled' && projRes.value.ok) {
          const projData = await projRes.value.json();
          if (Array.isArray(projData) && projData.length > 0) {
            setProjects(projData);
          }
        }

        if (techRes.status === 'fulfilled' && techRes.value.ok) {
          const techData = await techRes.value.json();
          if (Array.isArray(techData) && techData.length > 0) {
            setTechnologies(techData);
          }
        }
      } catch (err) {
        console.warn('API error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { skills, experiences, projects, technologies, loading };
};

export default usePortfolioData;
