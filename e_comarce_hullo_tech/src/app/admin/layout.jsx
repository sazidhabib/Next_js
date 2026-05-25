"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Grid,
  Settings,
  LogOut
} from 'lucide-react';
import { useAdminAuth, handleAdminLogout } from '../../lib/admin-auth';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAdminAuth();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/settings', label: 'Site Configuration', icon: Settings },
    { href: '/admin/products', label: 'Product Inventory', icon: Package },
    { href: '/admin/categories', label: 'Category Manager', icon: Grid },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <main className="flex-1 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}