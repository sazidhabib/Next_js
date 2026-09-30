'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginView from '../auth/LoginView';
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
import { Sparkles, Loader2 } from 'lucide-react';

function AppShellContent() {
  const { isAuthenticated, isLoading, user, role, canAccessTab } = useAuth();
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
    appSubtitle: 'Enterprise Compliance & UK Sponsorship',
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
    if (isAuthenticated) {
      refreshAllData();
    }
  }, [isAuthenticated]);

  // Tab permission guard: reset to dashboard if active tab is disallowed
  useEffect(() => {
    if (isAuthenticated && !canAccessTab(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, activeTab, canAccessTab, role]);

  // Show loading spinner during session authentication
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/20 animate-pulse">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          <span>Connecting to secure workspace...</span>
        </div>
      </div>
    );
  }

  // If not logged in, enforce login screen barrier
  if (!isAuthenticated) {
    return <LoginView settings={settings} />;
  }

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return role === 'Employee' ? 'My Self-Service Dashboard' : role === 'Manager' ? 'Store Manager Dashboard' : 'Executive Dashboard';
      case 'employees':
        return 'Employee Records';
      case 'immigration':
        return 'Immigration & Visas';
      case 'rtw':
        return 'Right To Work (RTW)';
      case 'leave':
        return role === 'Employee' ? 'My Leave Applications' : 'Leave Tracking';
      case 'departments':
        return 'Departments';
      case 'roles':
        return 'Roles & RBAC';
      case 'users':
        return 'User Accounts';
      case 'visatypes':
        return 'Visa Categories';
      case 'media':
        return 'Media & Compliance Library';
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
                onNavigate={(tab) => {
                  if (canAccessTab(tab)) {
                    setActiveTab(tab);
                  }
                }}
              />
            )}

            {activeTab === 'employees' && canAccessTab('employees') && (
              <EmployeeManagement
                departments={departments}
                onEmployeeUpdated={refreshAllData}
              />
            )}

            {activeTab === 'immigration' && canAccessTab('immigration') && (
              <ImmigrationManagement
                employees={employees}
                visaTypes={visaTypes}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'rtw' && canAccessTab('rtw') && (
              <RightToWorkManagement
                employees={employees}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'leave' && canAccessTab('leave') && (
              <LeaveManagement
                employees={employees}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'departments' && canAccessTab('departments') && (
              <DepartmentManagement
                departments={departments}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'roles' && canAccessTab('roles') && (
              <RoleManagement onUpdated={refreshAllData} />
            )}

            {activeTab === 'users' && canAccessTab('users') && (
              <UserManagement
                employees={employees}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'visatypes' && canAccessTab('visatypes') && (
              <VisaTypeManagement
                visaTypes={visaTypes}
                onUpdated={refreshAllData}
              />
            )}

            {activeTab === 'media' && canAccessTab('media') && (
              <MediaManagement />
            )}

            {activeTab === 'settings' && canAccessTab('settings') && (
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

export default function AppShell() {
  return (
    <AuthProvider>
      <AppShellContent />
    </AuthProvider>
  );
}

