import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
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
  settings,
  onSearch,
  activeTabTitle,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
}) {
  const { user, role } = useAuth();
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

  // Compute personal compliance notifications for the employee
  const employeeAlerts = useMemo(() => {
    if (role !== 'Employee') return [];
    const list = [];
    const emp = user?.employee;
    const today = new Date();

    // Check ShareCode Expiry (30 days threshold)
    if (emp?.shareCodeExpiryDate) {
      const exp = new Date(emp.shareCodeExpiryDate);
      const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        list.push({
          id: 'sc-expiry',
          type: 'share_code',
          title: 'Share Code Expiry Warning',
          message: diffDays < 0
            ? `Your Home Office Share Code expired on ${emp.shareCodeExpiryDate}. Please generate a new code immediately.`
            : `Your Home Office Share Code expires in ${diffDays} day${diffDays === 1 ? '' : 's'} (${emp.shareCodeExpiryDate}).`,
          daysLeft: diffDays,
          isCritical: diffDays <= 7 || diffDays < 0,
        });
      }
    }

    // Check Visa Expiry (60 days threshold, amber at 30 days)
    const immRec = emp?.immigrationRecords?.[0];
    const visaExp = immRec?.expiryDate || immRec?.visaExpiryDate;
    if (visaExp) {
      const exp = new Date(visaExp);
      const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      if (diffDays <= 60) {
        list.push({
          id: 'visa-expiry',
          type: 'visa',
          title: 'Visa Expiry Warning',
          message: diffDays < 0
            ? `Your visa expired on ${visaExp}. Contact HR compliance immediately.`
            : `Your visa (${immRec?.visaType?.name || 'Work Visa'}) expires in ${diffDays} day${diffDays === 1 ? '' : 's'} (${visaExp}).`,
          daysLeft: diffDays,
          isCritical: diffDays <= 30 || diffDays < 0,
        });
      }
    }

    return list;
  }, [user, role]);

  const adminAlertsCount =
    (stats?.expiringVisasCount || 0) +
    (stats?.expiringShareCodesCount || 0) +
    (stats?.pendingRTWCount || 0);

  const totalAlerts = role === 'Employee' ? employeeAlerts.length : adminAlertsCount;
  const isDarkMode = theme === 'dark';

  return (
    <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 shadow-xs transition-colors duration-200">
      {/* Left: Mobile Menu Button + Page Title */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight capitalize truncate">
              {activeTabTitle || 'Dashboard'}
            </h2>
            {settings?.companyName && (
              <span className="hidden lg:inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 truncate max-w-[200px]">
                {settings.companyName}
              </span>
            )}
          </div>
          <span className="hidden md:inline-flex text-[11px] text-zinc-500 font-medium">
            Sponsor License: {settings?.sponsorLicenceNo || '0W01ABC89'}
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
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 transition shadow-2xs flex items-center space-x-1.5 cursor-pointer"
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

        {/* Notifications Dropdown (Interactive for all authenticated roles) */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className={`absolute top-1 right-1 w-4 h-4 rounded-full ${
                role === 'Employee' ? 'bg-amber-500' : 'bg-rose-500'
              } text-white text-[10px] font-bold flex items-center justify-center animate-pulse`}>
                {totalAlerts}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-2rem)] sm:w-88 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {role === 'Employee' ? 'My Compliance Alerts' : 'Compliance Notifications'}
                </h4>
                <span className="text-xs text-zinc-500">
                  {totalAlerts} {totalAlerts === 1 ? 'Alert' : 'Alerts'}
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {role === 'Employee' ? (
                  employeeAlerts.length > 0 ? (
                    employeeAlerts.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs ${
                          item.isCritical
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            item.isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                          }`}
                        />
                        <div className="space-y-1">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</p>
                          <p className="text-[11px] text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {item.message}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-medium">
                            Action: Submit renewed verification to HR to maintain active status.
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-zinc-500">
                      <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">All Compliant</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Your visa and share code checks are up to date.</p>
                    </div>
                  )
                ) : (
                  <>
                    {/* Admin/Manager Expiring Share Codes */}
                    {alerts?.shareCodes?.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                          Expiring Share Codes ({alerts.shareCodes.length})
                        </p>
                        {alerts.shareCodes.map((sc) => {
                          const diff = Math.ceil((new Date(sc.shareCodeExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                          const isPast = diff < 0;
                          return (
                            <div
                              key={`sc-${sc.id}`}
                              className={`p-2.5 rounded-xl border flex items-start space-x-2 text-xs ${
                                isPast
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60'
                              }`}
                            >
                              <AlertTriangle
                                className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  isPast ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                                }`}
                              />
                              <div>
                                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                                  {sc.firstName} {sc.lastName}{' '}
                                  <span className="font-mono text-[10px] text-zinc-500">({sc.employeeCode})</span>
                                </p>
                                <p className={`text-[11px] ${isPast ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                  Share Code ({sc.shareCode || 'On file'}) {isPast ? 'expired on' : 'expires on'}{' '}
                                  {sc.shareCodeExpiryDate} ({isPast ? 'EXPIRED' : `${diff}d left`})
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Admin/Manager Expiring Visas */}
                    {alerts?.immigration?.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-blue-700 dark:text-blue-400">
                          Expiring Visas ({alerts.immigration.length})
                        </p>
                        {alerts.immigration.map((item) => (
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
                        ))}
                      </div>
                    )}

                    {(!alerts?.immigration || alerts.immigration.length === 0) &&
                      (!alerts?.shareCodes || alerts.shareCodes.length === 0) && (
                        <p className="text-xs text-zinc-500 py-3 text-center">No urgent compliance alerts.</p>
                      )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs overflow-hidden">
            {user?.employee?.photoUrl ? (
              <img src={user.employee.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

