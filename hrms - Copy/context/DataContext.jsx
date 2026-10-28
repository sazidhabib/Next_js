'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children, initialSettings }) {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState({ immigration: [], rtw: [] });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const [settings, setSettings] = useState(() => {
    if (initialSettings && typeof initialSettings === 'object' && initialSettings.appName) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hrms_public_settings', JSON.stringify(initialSettings));
        } catch (e) {}
      }
      return initialSettings;
    }
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('hrms_public_settings');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      appName: 'HRMS Pro',
      appSubtitle: 'Enterprise Compliance & UK Sponsorship',
      companyName: 'The Royal Kitchen Hospitality Ltd',
      appLogo: '',
      sponsorLicenceNo: '0W01ABC89',
      complianceOfficer: 'James Wilson',
      complianceEmail: 'compliance@hrms.local',
      currencySymbol: '£',
      visaWarningDays: 90,
      rtwWarningDays: 30,
    };
  });

  useEffect(() => {
    if (initialSettings && initialSettings.appName) {
      setSettings((prev) => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  // Always fetch public system settings on initial mount so login page and brand elements reflect current system data
  const refreshSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings(data.settings);
          try {
            localStorage.setItem('hrms_public_settings', JSON.stringify(data.settings));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Failed to fetch public system settings:', err.message);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Keep cached public settings synchronized whenever settings change
  useEffect(() => {
    if (settings && typeof window !== 'undefined') {
      try {
        localStorage.setItem('hrms_public_settings', JSON.stringify(settings));
      } catch (e) {}
    }
  }, [settings]);

  // Theme synchronization
  useEffect(() => {
    const saved = localStorage.getItem('hrms_theme');
    if (saved) {
      setTheme(saved);
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else if (document.documentElement.classList.contains('dark')) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('hrms_theme', nextTheme);
      return nextTheme;
    });
  };

  // Fetch Master Data
  const refreshAllData = useCallback(async () => {
    try {
      const [statsRes, deptRes, empRes, visaRes, settRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/departments'),
        fetch('/api/employees'),
        fetch('/api/visatypes'),
        fetch('/api/settings'),
      ]);

      const statsData = statsRes.ok ? await statsRes.json() : {};
      const deptData = deptRes.ok ? await deptRes.json() : {};
      const empData = empRes.ok ? await empRes.json() : {};
      const visaData = visaRes.ok ? await visaRes.json() : {};
      const settData = settRes.ok ? await settRes.json() : {};

      if (statsData.success) {
        setStats(statsData.stats);
        setAlerts(statsData.alerts);
      }

      if (deptData.success) setDepartments(deptData.departments);
      if (empData.success) setEmployees(empData.employees);
      if (visaData.success) setVisaTypes(visaData.visaTypes);
      if (settData.success && settData.settings) {
        setSettings(settData.settings);
        try {
          localStorage.setItem('hrms_public_settings', JSON.stringify(settData.settings));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error fetching global HRMS data:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated, refreshAllData]);

  const value = {
    stats,
    alerts,
    departments,
    employees,
    visaTypes,
    settings,
    setSettings,
    refreshSettings,
    refreshAllData,
    theme,
    toggleTheme,
    isMobileNavOpen,
    setIsMobileNavOpen,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
