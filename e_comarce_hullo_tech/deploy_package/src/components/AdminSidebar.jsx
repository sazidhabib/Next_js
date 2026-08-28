"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Grid,
  Settings as SettingsIcon,
  LogOut,
  ClipboardList,
  FileImage,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth, handleAdminLogout } from '../lib/admin-auth';

export default function AdminSidebar({ pendingCount = 0 }) {
  const { user } = useAdminAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    handleAdminLogout();
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/settings', label: 'Site Configuration', icon: SettingsIcon },
    {
      href: '/admin/orders',
      label: 'Orders Management',
      icon: ClipboardList,
      badge: pendingCount
    },
    { href: '/admin/products', label: 'Product Inventory', icon: Package },
    { href: '/admin/categories', label: 'Category Manager', icon: Grid },
    { href: '/admin/media', label: 'Media Gallery', icon: FileImage },
    { href: '/admin/menu', label: 'Menu Manager', icon: Menu },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col md:min-h-screen">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold tracking-wide">HulloTech</h2>
            <span className="text-xs text-slate-400">Admin Control</span>
          </div>
        </div>
        {/* Hamburger menu for mobile */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 rounded-lg transition"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation list */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block flex-1 flex flex-col`}>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 ? (
                  <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Profile / Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="truncate">
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-950/20 hover:text-red-400 border border-slate-700/50 hover:border-red-900/30 text-slate-300 py-2.5 rounded-xl transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
