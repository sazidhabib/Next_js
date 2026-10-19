"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    }
    setMounted(true);
  }, []);

  const applyTheme = (newTheme) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;

    // Temporarily suppress all transitions during theme switch for an instant toggle
    const styleId = 'disable-theme-transitions';
    let disableTransitionStyle = document.getElementById(styleId);
    if (!disableTransitionStyle) {
      disableTransitionStyle = document.createElement('style');
      disableTransitionStyle.id = styleId;
      disableTransitionStyle.textContent = `
        *, *::before, *::after {
          -webkit-transition: none !important;
          -moz-transition: none !important;
          -o-transition: none !important;
          -ms-transition: none !important;
          transition: none !important;
        }
      `;
      document.head.appendChild(disableTransitionStyle);
    }

    if (newTheme === 'dark') {
      root.setAttribute('data-bs-theme', 'dark');
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.setAttribute('data-bs-theme', 'light');
      root.setAttribute('data-theme', 'light');
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Force reflow so new theme values take effect immediately
    if (document.body) {
      window.getComputedStyle(document.body).opacity;
    } else {
      window.getComputedStyle(root).opacity;
    }

    // Wait until browser renders the frame with the new theme before re-enabling transitions
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(styleId);
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('app-theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
