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
  Printer,
  Sparkles,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [ordersRes, restoRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/restaurant?slug=bellavista-pizza'),
        ]);

        const ordersJson = await ordersRes.json();
        const restoJson = await restoRes.json();

        if (ordersJson.success) setOrders(ordersJson.data);
        if (restoJson.success) setRestaurant(restoJson.data);
      } catch (err) {
        console.error('Error loading admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  const deliveryOrdersCount = orders.filter((o) => o.orderType === 'DELIVERY').length;
  const pickupOrdersCount = orders.filter((o) => o.orderType === 'PICKUP').length;
  const deliveryPercent =
    totalOrdersCount > 0 ? Math.round((deliveryOrdersCount / totalOrdersCount) * 100) : 60;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Restaurant Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time analytics and order stream for {restaurant?.name || 'Bella Vista Pizzeria'}
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
              {restaurant?.estimatedPrepTime || 25} mins
            </h3>
            <p className="text-[11px] text-purple-300 font-semibold mt-1">
              Optimal stone-oven throughput
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

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Delivery radius optimized across 3 active city delivery zones.
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
                Add dishes, toggle in-stock availability, customize size and topping groups.
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
                Configure delivery radius rings, minimum order thresholds, and free delivery perks.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 mt-4">
              <span>Configure Zones</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Ledger Table */}
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
              {orders.map((order) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
