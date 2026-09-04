'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  ExternalLink,
  Building2,
  LogOut,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Code,
} from 'lucide-react';
import { AdminProvider, useAdmin } from '@/lib/adminContext';

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, activeRole, setActiveRole, selectedRestaurant, selectRestaurant, logout } = useAdmin();

  // If loading, show elegant skeleton loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-400">Loading Admin Session...</p>
        </div>
      </div>
    );
  }

  // If on login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Determine sidebar navigation links based on role and active tenant context
  let navItems = [];
  const isSuper = activeRole === 'SUPER_ADMIN';
  const hasTenant = selectedRestaurant !== null;

  if (isSuper) {
    if (!hasTenant) {
      // Global Super Admin Mode (No store selected)
      navItems = [
        { label: 'Overview & Metrics', href: '/admin', icon: LayoutDashboard },
        { label: 'Manage Users', href: '/admin/users', icon: Users },
        { label: 'Manage Restaurants', href: '/admin/restaurants', icon: Building2 },
        { label: 'Website Widget & Embed', href: '/admin/widget', icon: Code, badge: 'NEW' },
      ];
    } else {
      // Impersonation Mode (Viewing a specific store's operations)
      navItems = [
        { label: 'Store Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Live Order Receiver', href: '/admin/live-orders', icon: Bell, badge: 'LIVE' },
        { label: 'Menu & Modifiers', href: '/admin/menu', icon: UtensilsCrossed },
        { label: 'Delivery Zones & Fees', href: '/admin/zones', icon: MapPin },
        { label: 'Website Widget & Embed', href: '/admin/widget', icon: Code, badge: 'NEW' },
        {
          label: 'Invoices & Ledger',
          href: '/admin/invoices',
          icon: FileText,
          subItems: [
            { label: 'All Invoices', href: '/admin/invoices' },
            { label: 'Invoice Templates', href: '/admin/invoices/templates' },
            { label: 'Printer Options', href: '/admin/invoices/printer-options' },
          ],
        },
        { label: 'Operating Settings', href: '/admin/settings', icon: Settings },
      ];
    }
  } else {
    // Normal Restaurant Admin / Staff view
    navItems = [
      { label: 'Overview & Metrics', href: '/admin', icon: LayoutDashboard },
      { label: 'Live Order Receiver', href: '/admin/live-orders', icon: Bell, badge: 'LIVE' },
      { label: 'Menu & Modifiers', href: '/admin/menu', icon: UtensilsCrossed },
      { label: 'Delivery Zones & Fees', href: '/admin/zones', icon: MapPin },
      { label: 'Website Widget & Embed', href: '/admin/widget', icon: Code, badge: 'NEW' },
      {
        label: 'Invoices & Ledger',
        href: '/admin/invoices',
        icon: FileText,
        subItems: [
          { label: 'All Invoices', href: '/admin/invoices' },
          { label: 'Invoice Templates', href: '/admin/invoices/templates' },
          { label: 'Printer Options', href: '/admin/invoices/printer-options' },
        ],
      },
      { label: 'Operating Settings', href: '/admin/settings', icon: Settings },
      { label: 'Staff & Permissions', href: '/admin/users', icon: Users },
    ];
  }

  const handleBackToPlatform = () => {
    selectRestaurant(null);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div className="p-4 sm:p-5 space-y-5">
          {/* Brand & Restaurant Profile */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-600/30 font-extrabold text-base">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white line-clamp-1">
                  {selectedRestaurant?.name || 'Platform Hub'}
                </h2>
                <p className="text-[11px] text-slate-400">GloriaFood Admin</p>
              </div>
            </div>

            {/* Role Switcher Pill */}
            {user && (
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Logged in as: {user.name.split(' ')[0]}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                {user.role === 'SUPER_ADMIN' ? (
                  <select
                    value={activeRole || 'SUPER_ADMIN'}
                    onChange={(e) => setActiveRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs font-bold text-orange-400 rounded-lg p-1.5 focus:outline-none"
                  >
                    <option value="SUPER_ADMIN">👑 Super Admin</option>
                    <option value="RESTAURANT_ADMIN">👨‍🍳 Restaurant Admin</option>
                    <option value="STAFF_OPERATOR">🔔 Kitchen Operator</option>
                  </select>
                ) : (
                  <div className="text-xs font-bold text-slate-300 p-1">
                    {user.role === 'RESTAURANT_ADMIN' ? '👨‍🍳 Restaurant Admin' : '🔔 Kitchen Operator'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Context Back Button */}
          {isSuper && hasTenant && (
            <button
              onClick={handleBackToPlatform}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-950 hover:bg-slate-800 text-orange-400 hover:text-orange-350 border border-orange-500/20 hover:border-orange-500/40 rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Platform Control</span>
            </button>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isParentActive = pathname?.startsWith(item.href);
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : isParentActive;

              return (
                <div key={item.label} className="space-y-1">
                  <Link
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
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                          {item.badge}
                        </span>
                      )}
                      {item.subItems && (
                        isParentActive ? (
                          <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        )
                      )}
                    </div>
                  </Link>
                  
                  {item.subItems && isParentActive && (
                    <div className="pl-4 space-y-1 mt-1 border-l border-slate-800 ml-5 transition-all">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={`block px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all ${
                              isSubActive
                                ? 'bg-slate-800 text-orange-400 font-extrabold shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Link & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {selectedRestaurant && (
            <Link
              href={`/menu/${selectedRestaurant.slug}`}
              target="_blank"
              className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-orange-400" />
                <span>Customer Storefront</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-between bg-slate-950/40 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/30 text-slate-400 hover:text-red-400 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
