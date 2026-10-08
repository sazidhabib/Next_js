"use client";
import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

const ThemeToggle = ({ className = '', showLabel = false, size = 'md' }) => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`theme-toggle-skeleton ${className}`}
        style={{ width: size === 'sm' ? '32px' : '38px', height: size === 'sm' ? '32px' : '38px' }}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      aria-label={isDark ? "লাইট মোডে পরিবর্তন করুন" : "ডার্ক মোডে পরিবর্তন করুন"}
      title={isDark ? "লাইট মোড (Day Mode)" : "ডার্ক মোড (Night Mode)"}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb">
          {isDark ? (
            <i className="fas fa-moon theme-toggle-icon moon-icon"></i>
          ) : (
            <i className="fas fa-sun theme-toggle-icon sun-icon"></i>
          )}
        </span>
      </span>
      {showLabel && (
        <span className="theme-toggle-label ms-2 d-none d-sm-inline font-bangla">
          {isDark ? 'রাত' : 'দিন'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
