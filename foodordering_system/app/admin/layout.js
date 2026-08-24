'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  MapPin,
  FileText,
  Settings,
  Users,
  Bell,
  ChefHat,
  ShieldCheck,
  Store,
  ChevronDown,
  ExternalLink,
  Flame,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState('RESTAURANT_ADMIN'); // 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'STAFF_OPERATOR'

  const navItems = [
    { label: 'Overview & Metrics', href: '/admin', icon: LayoutDashboard },
    { label: 'Live Order Receiver', href: '/admin/live-orders', icon: Bell, badge: 'LIVE' },
    { label: 'Menu & Modifiers', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Delivery Zones & Fees', href: '/admin/zones', icon: MapPin },
    { label: 'Invoices & Ledger', href: '/admin/invoices', icon: FileText },
    { label: 'Operating Settings', href: '/admin/settings', icon: Settings },
    { label: 'Staff & Permissions', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-4 sm:p-5 space-y-6">
          {/* Brand & Restaurant Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30 font-extrabold text-base">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white line-clamp-1">
                  Bella Vista Hub
                </h2>
                <p className="text-[11px] text-slate-400">GloriaFood Admin</p>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>Active Role (RBAC)</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-orange-400 rounded-lg p-1.5 focus:outline-none"
              >
                <option value="SUPER_ADMIN">👑 Super Admin</option>
                <option value="RESTAURANT_ADMIN">👨‍🍳 Restaurant Admin</option>
                <option value="STAFF_OPERATOR">🔔 Kitchen Operator</option>
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/menu/bellavista-pizza"
            target="_blank"
            className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-orange-400" />
              <span>Customer Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
