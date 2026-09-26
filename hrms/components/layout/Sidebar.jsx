'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Globe2,
  CalendarDays,
  ShieldCheck,
  Building2,
  Shield,
  UserCheck,
  FileBadge,
  LogOut,
  Sparkles,
  ChevronRight,
  Database,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  onSeedData,
  isSeeding,
  isOpen,
  onClose,
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users, badge: stats?.totalEmployees },
    {
      id: 'immigration',
      label: 'Immigration',
      icon: Globe2,
      badge: stats?.expiringVisasCount > 0 ? `${stats.expiringVisasCount} alerts` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'leave',
      label: 'Leave',
      icon: CalendarDays,
      badge: stats?.pendingLeavesCount > 0 ? stats.pendingLeavesCount : null,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'rtw',
      label: 'Right To Work',
      icon: ShieldCheck,
      badge: stats?.pendingRTWCount > 0 ? 'Review' : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'departments', label: 'Departments', icon: Building2, badge: stats?.totalDepartments },
    { id: 'roles', label: 'Roles', icon: Shield },
    { id: 'users', label: 'Users', icon: UserCheck },
    { id: 'visatypes', label: 'VisaTypes', icon: FileBadge },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none shadow-2xl">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">HRMS Pro</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">Enterprise Compliance</p>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Database Quick Seed / Reset Bar */}
      <div className="p-3 mx-3 mb-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Database Sync</span>
          </div>
          <button
            onClick={onSeedData}
            disabled={isSeeding}
            className="text-[11px] bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white px-2 py-1 rounded-md transition font-medium disabled:opacity-50"
          >
            {isSeeding ? 'Syncing...' : 'Seed Data'}
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to log out?')) {
              alert('Logged out successfully.');
            }
          }}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-sm font-semibold bg-rose-600/90 hover:bg-rose-600 text-white transition shadow-sm hover:shadow-rose-600/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer with Backdrop */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Slide-out Sidebar Panel */}
          <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
