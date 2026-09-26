'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User as UserIcon,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';

export default function Header({
  stats,
  alerts,
  onSearch,
  activeTabTitle,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
}) {
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(now.toLocaleString('en-GB', options).replace(',', ''));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalAlerts = (stats?.expiringVisasCount || 0) + (stats?.pendingRTWCount || 0);
  const isDarkMode = theme === 'dark';

  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 shadow-xs transition-colors duration-200">
      {/* Left: Mobile Menu Button + Page Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight capitalize truncate">
            {activeTabTitle || 'Dashboard'}
          </h2>
          <span className="hidden md:inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            UK Compliance Ready
          </span>
        </div>
      </div>

      {/* Right: Controls (Clock, Theme Toggle, Notifications, Profile) */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Live Clock (hidden on small screens, visible on lg) */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{currentTime || 'Loading...'}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition shadow-2xs flex items-center space-x-1.5"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold hidden md:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold hidden md:inline">Dark</span>
            </>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Compliance Notifications</h4>
                <span className="text-xs text-zinc-500">{totalAlerts} Pending</span>
              </div>
              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                {alerts?.immigration?.length > 0 ? (
                  alerts.immigration.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-2 text-xs"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {item.employee?.firstName} {item.employee?.lastName}
                        </p>
                        <p className="text-amber-700 dark:text-amber-400 text-[11px]">
                          {item.visaType?.name} expires on {item.expiryDate}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 py-3 text-center">No urgent visa alerts.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2 pl-1.5 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-xs">
            HR
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">Admin</p>
            <p className="text-[10px] text-zinc-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
