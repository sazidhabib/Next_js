"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth, handleAdminLogout } from '../../lib/admin-auth';
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
  FileImage,
  ClipboardList
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAuthorized, user, token, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();

  // Data states
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockItems: 0,
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0
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

      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();
      
      if (productsData.success && categoriesData.success) {
        const ordersList = ordersData.success ? ordersData.data : [];
        const completedSales = ordersList
          .filter(o => o.status === 'completed' || o.status === 'processing')
          .reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const pendingCount = ordersList.filter(o => o.status === 'pending').length;

        setStats({
          totalProducts: productsData.data.length,
          totalCategories: categoriesData.data.length,
          lowStockItems: productsData.data.filter(p => !p.stock).length,
          totalSales: completedSales,
          totalOrders: ordersList.length,
          pendingOrders: pendingCount
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
      <AdminSidebar pendingCount={stats.pendingOrders} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 md:max-h-screen md:overflow-y-auto">
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
                <div className="text-slate-400 text-sm">Pending Orders</div>
                <div className="text-2xl font-bold text-yellow-500">{stats.pendingOrders}</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400 opacity-50" />
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-slate-400 text-sm">Total Revenue</div>
                <div className="text-2xl font-bold text-emerald-400">৳{Math.round(stats.totalSales).toLocaleString()}</div>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400 opacity-50" />
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
