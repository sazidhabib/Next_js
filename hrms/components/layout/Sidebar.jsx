'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
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
  X,
  Settings as SettingsIcon,
  Image as ImageIcon,
} from 'lucide-react';

export default function Sidebar({
  isOpen,
  onClose,
  stats: propsStats,
  settings: propsSettings,
}) {
  const { user, role, canAccessTab, logout } = useAuth();
  const dataContext = useData();
  const pathname = usePathname();

  const stats = propsStats || dataContext?.stats;
  const settings = propsSettings || dataContext?.settings;

  const allMenuItems = [
    { id: 'dashboard', href: '/', label: role === 'Employee' ? 'My Dashboard' : 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', href: '/employees', label: 'Employees', icon: Users, badge: stats?.totalEmployees },
    {
      id: 'immigration',
      href: '/immigration',
      label: 'Immigration',
      icon: Globe2,
      badge: stats?.expiringVisasCount > 0 ? `${stats.expiringVisasCount} alerts` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'leave',
      href: '/leave',
      label: role === 'Employee' ? 'My Leaves' : 'Leave Tracking',
      icon: CalendarDays,
      badge: stats?.pendingLeavesCount > 0 ? stats.pendingLeavesCount : null,
      badgeColor: 'bg-blue-500 text-white',
    },
    {
      id: 'rtw',
      href: '/rtw',
      label: 'Right To Work',
      icon: ShieldCheck,
      badge: stats?.pendingRTWCount > 0 ? 'Review' : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    { id: 'departments', href: '/departments', label: 'Departments', icon: Building2, badge: stats?.totalDepartments },
    { id: 'roles', href: '/roles', label: 'Roles & RBAC', icon: Shield },
    { id: 'users', href: '/users', label: 'User Accounts', icon: UserCheck },
    { id: 'visatypes', href: '/visatypes', label: 'Visa Categories', icon: FileBadge },
    { id: 'media', href: '/media', label: 'Media Library', icon: ImageIcon },
    {
      id: 'settings',
      href: '/settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: 'Admin',
      badgeColor: 'bg-indigo-600/90 text-white text-[10px]',
    },
  ];

  // Filter menu items by user's role permissions
  const menuItems = allMenuItems.filter((item) => canAccessTab(item.id));

  const isItemActive = (href) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  const appName = settings?.appName || 'HRMS Pro';
  const appSubtitle = settings?.appSubtitle || 'Enterprise Compliance';
  const appLogo = settings?.appLogo;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none shadow-2xl">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0">
          {appLogo ? (
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <img
                src={appLogo}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}

          <div className="min-w-0">
            <h1 className="font-bold text-base tracking-tight text-white leading-tight truncate">
              {appName}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide truncate">
              {appSubtitle}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>{role} Navigation</span>
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
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
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout Action Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden shadow-sm">
              {user?.employee?.photoUrl ? (
                <img src={user.employee.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{user?.name || 'User'}</p>
              <span className="text-[10px] font-semibold text-blue-400 truncate block">
                {role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
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
