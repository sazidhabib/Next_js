'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import LoginView from '../auth/LoginView';
import Sidebar from './Sidebar';
import Header from './Header';
import { ShieldAlert } from 'lucide-react';

export default function AppShell({ children }) {
  const { isAuthenticated, isLoading, role, canAccessTab, hasPermission } = useAuth();
  const {
    stats,
    alerts,
    settings,
    theme,
    toggleTheme,
    isMobileNavOpen,
    setIsMobileNavOpen,
  } = useData();
  const pathname = usePathname();
  const router = useRouter();

  // Show loading screen during session authentication
  if (isLoading) {
    const activeLogo =
      settings?.appLogo ||
      (typeof window !== 'undefined'
        ? (() => {
            try {
              const cached = localStorage.getItem('hrms_public_settings');
              return cached ? JSON.parse(cached)?.appLogo : '';
            } catch (e) {
              return '';
            }
          })()
        : '');

    const activeAppName =
      settings?.appName ||
      (typeof window !== 'undefined'
        ? (() => {
            try {
              const cached = localStorage.getItem('hrms_public_settings');
              return cached ? JSON.parse(cached)?.appName : '';
            } catch (e) {
              return 'HRMS Pro';
            }
          })()
        : 'HRMS Pro');

    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-white select-none">
        <div className="text-center space-y-2">
          {activeAppName && (
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {activeAppName}
            </h2>
          )}
          <p className="text-slate-400 text-sm font-medium animate-pulse tracking-wide">
            Connecting to secure workspace...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in, enforce login screen barrier
  if (!isAuthenticated) {
    return <LoginView settings={settings} />;
  }

  // Determine current active section for permission and title
  const currentTab =
    !pathname || pathname === '/' || pathname === '/dashboard'
      ? 'dashboard'
      : pathname.replace(/^\//, '').split('/')[0];

  const getActiveTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return role === 'Employee' || (hasPermission('VIEW_OWN_PROFILE') && !hasPermission('VIEW_DASHBOARD'))
          ? 'My Employee Profile'
          : role === 'Manager'
          ? 'Store Manager Dashboard'
          : 'Executive Dashboard';
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
        return 'Dashboard';
    }
  };

  const hasAccess = canAccessTab(currentTab);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 font-sans antialiased text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        stats={stats}
        settings={settings}
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

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100/70 dark:bg-zinc-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            {hasAccess ? (
              children
            ) : (
              <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center max-w-lg mx-auto mt-12 shadow-sm">
                <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Access Restricted</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">
                  Your current account role ({role}) does not have permission to view this section.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
