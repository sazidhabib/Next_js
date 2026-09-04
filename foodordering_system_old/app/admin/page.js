'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  Bike,
  UtensilsCrossed,
  ArrowUpRight,
  Bell,
  ChevronRight,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  Percent,
} from 'lucide-react';
import { useAdmin } from '@/lib/adminContext';

export default function AdminOverviewPage() {
  const { activeRole, selectedRestaurant, selectRestaurant } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Super Admin statistics
  const [superMetrics, setSuperMetrics] = useState({ userCount: 0, restaurantCount: 0 });
  const [restaurantsList, setRestaurantsList] = useState([]);

  // Load Super Admin Data
  useEffect(() => {
    if (activeRole !== 'SUPER_ADMIN') return;

    async function loadSuperData() {
      try {
        const res = await fetch('/api/admin/metrics');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSuperMetrics(data.metrics);
            setRestaurantsList(data.restaurants);
          }
        }
      } catch (err) {
        console.error('Error loading super admin metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSuperData();
  }, [activeRole]);

  // Load Restaurant Operational Data (either for selected restaurant or default)
  useEffect(() => {
    const slug = selectedRestaurant?.slug || '';
    const restaurantId = selectedRestaurant?.id || '';

    // If active role is not super admin but we have no selected restaurant, load default
    if (activeRole !== 'SUPER_ADMIN' && !selectedRestaurant) {
      // Don't fetch yet, wait until checkAuth resolves user details.
      return;
    }

    // If super admin and no restaurant is selected context, we show platform control, no operational fetch needed
    if (activeRole === 'SUPER_ADMIN' && !selectedRestaurant) {
      setLoading(false);
      return;
    }

    async function loadOperationalData() {
      try {
        const [ordersRes, restoRes] = await Promise.all([
          fetch(`/api/orders?restaurantId=${restaurantId}`),
          fetch(`/api/restaurant?slug=${slug || 'bellavista-pizza'}`),
        ]);

        const ordersJson = await ordersRes.json();
        const restoJson = await restoRes.json();

        if (ordersJson.success) setOrders(ordersJson.data);
        if (restoJson.success) {
          setRestaurantDetails(restoJson.data);
          if (!selectedRestaurant && restoJson.data) {
            selectRestaurant(restoJson.data);
          }
        }
      } catch (err) {
        console.error('Error loading admin operational data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOperationalData();
  }, [selectedRestaurant, activeRole]);

  // Compute operational metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  const deliveryOrdersCount = orders.filter((o) => o.orderType === 'DELIVERY').length;
  const pickupOrdersCount = orders.filter((o) => o.orderType === 'PICKUP').length;
  const deliveryPercent =
    totalOrdersCount > 0 ? Math.round((deliveryOrdersCount / totalOrdersCount) * 100) : 0;

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-400">Loading Dashboard Data...</p>
      </div>
    );
  }

  // --- RENDER SUPER ADMIN DASHBOARD (NO ACTIVE STORE CONTEXT) ---
  if (activeRole === 'SUPER_ADMIN' && !selectedRestaurant) {
    return (
      <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-orange-500" />
              <span>Super Admin Platform Control</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              System-wide metrics and multi-tenant restaurant dashboard access
            </p>
          </div>
        </div>

        {/* Platform metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Total Restaurants */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Restaurants
              </span>
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{superMetrics.restaurantCount}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Active multi-tenant storefronts</p>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Platform Users
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">{superMetrics.userCount}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Admins, staff, and customers</p>
            </div>
          </div>
        </div>

        {/* Restaurant List (TABLE FORMAT) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Select Restaurant Tenant Context
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click on a restaurant name to enter its dashboard context and configure specific menus, operating hours, delivery zones, and view orders.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Restaurant Name</th>
                  <th className="p-3.5">URL Slug</th>
                  <th className="p-3.5">Contact info</th>
                  <th className="p-3.5">Physical Address</th>
                  <th className="p-3.5">Prep Time</th>
                  <th className="p-3.5">Tax Rate</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {restaurantsList.map((resto) => (
                  <tr key={resto.id} className="hover:bg-slate-850 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      <button
                        onClick={() => selectRestaurant(resto)}
                        className="text-orange-400 hover:text-orange-300 font-black hover:underline text-left text-sm flex items-center gap-1.5 cursor-pointer focus:outline-none"
                      >
                        <Building2 className="w-4 h-4 text-orange-500 shrink-0" />
                        <span>{resto.name}</span>
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-slate-450">
                      /{resto.slug}
                    </td>
                    <td className="p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{resto.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{resto.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium max-w-xs truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{resto.address}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-550" />
                        <span>{resto.estimatedPrepTime} mins</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="flex items-center gap-0.5 text-slate-300 font-semibold">
                        <Percent className="w-3.5 h-3.5 text-slate-550" />
                        <span>{resto.taxRatePercent}%</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => selectRestaurant(resto)}
                        className="bg-orange-600 hover:bg-orange-550 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        Visit Dashboard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER NORMAL OPERATIONAL DASHBOARD (RESTAURANT_ADMIN, STAFF_OPERATOR, OR SUPER ADMIN IN TENANT MODE) ---
  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {restaurantDetails?.name || 'Restaurant Dashboard'}
            </h1>
            {activeRole === 'SUPER_ADMIN' && (
              <span className="bg-purple-500/20 text-purple-300 font-black text-[10px] px-2 py-0.5 rounded-md border border-purple-500/30">
                ADMIN CONTEXT
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics and operations for {restaurantDetails?.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/live-orders"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span>Launch Order Receiver</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-white text-orange-700 text-[11px] font-black px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              ${totalRevenue.toFixed(2)}
            </h3>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last week</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{totalOrdersCount}</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {pendingOrdersCount} pending in queue
            </p>
          </div>
        </div>

        {/* Metric 3: Avg Order Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg. Ticket Size
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              ${avgOrderValue.toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Across all delivery & pickup
            </p>
          </div>
        </div>

        {/* Metric 4: Kitchen Prep Avg */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg. Kitchen Prep
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">
              {restaurantDetails?.estimatedPrepTime || 25} mins
            </h3>
            <p className="text-[11px] text-purple-300 font-semibold mt-1">
              Optimal throughput
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Fulfillment Breakdown & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Type Split */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Fulfillment Breakdown
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-orange-400" />
                  Delivery ({deliveryOrdersCount})
                </span>
                <span>{deliveryPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${deliveryPercent}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-indigo-400" />
                  Pickup ({pickupOrdersCount})
                </span>
                <span>{100 - deliveryPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${100 - deliveryPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/menu"
            className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-orange-400 transition-colors">
                Menu & Modifiers Manager
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add dishes, toggle availability, customize size and modifier groups.
              </p>
            </div>
            <span className="text-xs font-bold text-orange-400 flex items-center gap-1 mt-4">
              <span>Manage Menu</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/admin/zones"
            className="group bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                Delivery Zones & Fees
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure delivery radius rings, minimum orders, and fees.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 mt-4">
              <span>Configure Zones</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Orders Feed
          </h3>
          <Link
            href="/admin/invoices"
            className="text-xs text-orange-400 hover:text-orange-300 font-bold"
          >
            View All Invoices ↗
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Type</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-semibold">
                    No orders registered yet for this restaurant.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-orange-400">
                      {order.orderNumber}
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-[11px] text-slate-400">{order.customerPhone}</p>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] ${
                          order.orderType === 'DELIVERY'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {order.orderType}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-300">
                      {order.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                    </td>
                    <td className="p-3 font-bold text-white">
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          order.status === 'PENDING'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse'
                            : order.status === 'ACCEPTED' || order.status === 'PREPARING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : order.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/order/${order.id}`}
                        target="_blank"
                        className="text-xs text-slate-400 hover:text-white font-bold inline-flex items-center gap-1"
                      >
                        <span>Track</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
