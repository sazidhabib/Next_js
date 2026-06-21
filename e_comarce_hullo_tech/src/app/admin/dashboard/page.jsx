"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../../lib/admin-auth';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Layers,
  Package,
  Grid,
  AlertCircle,
  Check,
  AlertTriangle,
  Settings,
  LogOut,
  FileImage
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  // Data states
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockItems: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);

  // Wait for auth check to complete
  useEffect(() => {
    if (!authLoading && isAuthorized && token) {
      fetchStats();
    }
  }, [isAuthorized, token, authLoading]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch products count
      const productsRes = await fetch('/api/products');
      const productsData = await productsRes.json();
      
      // Fetch categories count
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();
      
      if (productsData.success && categoriesData.success) {
        setStats({
          totalProducts: productsData.data.length,
          totalCategories: categoriesData.data.length,
          lowStockItems: productsData.data.filter(p => !p.stock).length,
          totalSales: 0 // Placeholder
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    handleAdminLogout();
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect happens in useAdminAuth if not authorized
  if (!isAuthorized || !token) {
    return null; // Will redirect via useAdminAuth hook
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold tracking-wide">HulloTech</h2>
              <span className="text-xs text-slate-400">Admin Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/15"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/settings"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Settings className="w-5 h-5" />
            <span>Site Configuration</span>
          </Link>

          <Link
            href="/admin/products"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Package className="w-5 h-5" />
            <span>Product Inventory</span>
          </Link>

          <Link
            href="/admin/categories"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <Grid className="w-5 h-5" />
            <span>Category Manager</span>
          </Link>

          <Link
            href="/admin/media"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition text-left hover:bg-slate-800 hover:text-slate-200"
          >
            <FileImage className="w-5 h-5" />
            <span>Media Gallery</span>
          </Link>
        </nav>

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
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        {/* Alerts / Notifications */}
        <div className="mb-6">
          {/* Placeholder for toast notifications */}
        </div>

        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of your e-commerce platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8">
          <div className="md:grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-400 text-sm">Total Products</div>
                <div className="text-2xl font-bold text-slate-100">{stats.totalProducts}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-400 text-sm">Total Categories</div>
                <div className="text-2xl font-bold text-slate-100">{stats.totalCategories}</div>
              </div>
              <Layers className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-400 text-sm">Low Stock Items</div>
                <div className="text-2xl font-bold text-slate-100">{stats.lowStockItems}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400 opacity-50" />
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-400 text-sm">Total Sales</div>
                <div className="text-2xl font-bold text-slate-100">$0</div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/products"
              className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col items-center transition hover:bg-slate-900/40"
            >
              <Package className="w-10 h-10 text-blue-400 mb-3" />
              <span className="text-sm font-medium text-slate-100">Manage Products</span>
            </Link>
            
            <Link
              href="/admin/categories"
              className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col items-center transition hover:bg-slate-900/40"
            >
              <Grid className="w-10 h-10 text-blue-400 mb-3" />
              <span className="text-sm font-medium text-slate-100">Manage Categories</span>
            </Link>
            
            <Link
              href="/admin/settings"
              className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col items-center transition hover:bg-slate-900/40"
            >
              <Settings className="w-10 h-10 text-blue-400 mb-3" />
              <span className="text-sm font-medium text-slate-100">Site Settings</span>
            </Link>
            
            <button
              onClick={() => router.push('/admin/products')}
              className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex flex-col items-center transition hover:bg-slate-900/40"
            >
              <AlertCircle className="w-10 h-10 text-yellow-400 mb-3" />
              <span className="text-sm font-medium text-slate-100">Add New Product</span>
            </button>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-100">Recent Activity</h2>
            <Link
              href="/admin/products"
              className="text-sm text-blue-400 hover:underline"
            >
              View All Activity
            </Link>
          </div>
          <div className="space-y-4">
            <div className="text-slate-400 text-sm">
              • No recent activity to display
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}