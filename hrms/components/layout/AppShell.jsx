'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from '../dashboard/DashboardView';
import EmployeeManagement from '../employees/EmployeeManagement';
import ImmigrationManagement from '../immigration/ImmigrationManagement';
import RightToWorkManagement from '../rtw/RightToWorkManagement';
import LeaveManagement from '../leave/LeaveManagement';
import DepartmentManagement from '../departments/DepartmentManagement';
import RoleManagement from '../roles/RoleManagement';
import UserManagement from '../users/UserManagement';
import VisaTypeManagement from '../visatypes/VisaTypeManagement';
import SettingsManagement from '../settings/SettingsManagement';
import MediaManagement from '../media/MediaManagement';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState({ immigration: [], rtw: [] });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [visaTypes, setVisaTypes] = useState([]);
  const [settings, setSettings] = useState({
    appName: 'HRMS Pro',
    appSubtitle: 'Enterprise Compliance',
    companyName: 'The Royal Kitchen Hospitality Ltd',
    appLogo: '',
    sponsorLicenceNo: '0W01ABC89',
    complianceOfficer: 'James Wilson',
    complianceEmail: 'compliance@hrms.local',
    currencySymbol: '£',
    visaWarningDays: 90,
    rtwWarningDays: 30,
  });
  const [isSeeding, setIsSeeding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Sync theme with document class on mount
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

  // Fetch Master Data & Settings
  const refreshAllData = async () => {
    try {
      const [statsRes, deptRes, empRes, visaRes, settRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/departments'),
        fetch('/api/employees'),
        fetch('/api/visatypes'),
        fetch('/api/settings'),
      ]);

      const statsData = await statsRes.json();
      const deptData = await deptRes.json();
      const empData = await empRes.json();
      const visaData = await visaRes.json();
      const settData = await settRes.json();

      if (statsData.success) {
        setStats(statsData.stats);
        setAlerts(statsData.alerts);
      }

      if (deptData.success) setDepartments(deptData.departments);
      if (empData.success) setEmployees(empData.employees);
      if (visaData.success) setVisaTypes(visaData.visaTypes);
      if (settData.success && settData.settings) setSettings(settData.settings);

      if (statsData.success && statsData.stats.totalEmployees === 0 && !isInitialized) {
        setIsInitialized(true);
        triggerSeed(false);
      }
    } catch (err) {
      console.error('Error fetching global HRMS data:', err);
    }
  };

  const triggerSeed = async (showPrompt = true) => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (showPrompt) alert('Database seeded with demo compliance records!');
        refreshAllData();
      }
    } catch (err) {
      if (showPrompt) alert('Seeder notice: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Executive Dashboard';
      case 'employees':
        return 'Employee Records';
      case 'immigration':
        return 'Immigration & Visas';
      case 'rtw':
        return 'Right To Work (RTW)';
      case 'leave':
        return 'Leave Tracking';
      case 'departments':
        return 'Departments';
      case 'roles':
        return 'Roles & RBAC';
      case 'users':
        return 'User Accounts';
      case 'visatypes':
        return 'Visa Categories';
      case 'settings':
        return 'System & Application Settings';
      default:
        return activeTab;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 font-sans antialiased text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        settings={settings}
        onSeedData={() => triggerSeed(true)}
        isSeeding={isSeeding}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main View Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          stats={stats}
          alerts={alerts}
          settings={settings}
          activeTabTitle={getActiveTabTitle()}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100/70 dark:bg-zinc-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                alerts={alerts}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'employees' && (
              <EmployeeManagement
                departments={departments}
                onEmployeeUpdated={refreshAllData}
              />
            )}

            {activeTab === 'immigration' && (
              <ImmigrationManagement
                employees={employees}
                visaTypes={visaTypes}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'rtw' && (
              <RightToWorkManagement
                employees={employees}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'leave' && (
              <LeaveManagement
                employees={employees}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'departments' && (
              <DepartmentManagement
                departments={departments}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'roles' && (
              <RoleManagement onUpdated={refreshAllData} />
            )}

            {activeTab === 'users' && (
              <UserManagement
                employees={employees}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'visatypes' && (
              <VisaTypeManagement
                visaTypes={visaTypes}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'media' && (
              <MediaManagement />
            )}

            {activeTab === 'settings' && (
              <SettingsManagement
                settings={settings}
                onSettingsUpdated={(updatedSettings) => {
                  setSettings(updatedSettings);
                  refreshAllData();
                }}
                onSeedData={() => triggerSeed(true)}
                isSeeding={isSeeding}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
