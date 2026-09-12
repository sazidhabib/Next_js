'use client';

import { useState, useEffect } from 'react';
import { skills as fallbackSkills, experiences as fallbackExperiences } from '../constants/Constants';
import { projects as fallbackProjects } from '../constants/index';

export const usePortfolioData = () => {
  const [skills, setSkills] = useState(fallbackSkills);
  const [experiences, setExperiences] = useState(fallbackExperiences);
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [skillsRes, expRes, projRes] = await Promise.all([
          fetch('/api/skills'),
          fetch('/api/experiences'),
          fetch('/api/projects')
        ]);

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          if (skillsData && skillsData.length > 0) {
            setSkills(skillsData);
          }
        }

        if (expRes.ok) {
          const expData = await expRes.json();
          if (expData && expData.length > 0) {
            setExperiences(expData);
          }
        }

        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData && projData.length > 0) {
            setProjects(projData);
          }
        }
      } catch (err) {
        console.warn('API error loading portfolio data. Falling back to local constants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { skills, experiences, projects, loading };
};

export default usePortfolioData;
