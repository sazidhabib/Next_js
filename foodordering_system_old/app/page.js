'use client';

import React from 'react';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Bell,
  ChefHat,
  ShieldCheck,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Database,
  CheckCircle2,
  Bike,
  Layers,
  Flame,
  Zap,
  Printer,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-orange-600 text-white text-center py-2 px-4 text-xs font-extrabold flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>GloriaFood & FoodBooking Architecture Implemented with Next.js 16 + MySQL + Prisma ORM</span>
      </div>

      {/* Hero Section */}
      <header className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>Complete Multi-Tenant Restaurant System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-none">
          Online Food Ordering <br />
          <span className="bg-linear-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
            System & Admin Hub
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Inspired by <strong className="text-slate-200">GloriaFood</strong> and <strong className="text-slate-200">FoodBooking</strong>. Includes a high-converting customer ordering widget, real-time kitchen order receiver with audio alerts, delivery radius calculation, and a full-featured multi-role admin dashboard.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/menu/bellavista-pizza"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl shadow-orange-600/30 transition-all active:scale-95"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Open Customer Storefront</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/admin/live-orders"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg transition-all active:scale-95"
          >
            <Bell className="w-4 h-4 animate-bounce" />
            <span>Kitchen Order Receiver</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-7 py-3.5 rounded-2xl font-extrabold text-sm shadow-lg transition-all active:scale-95"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </header>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Core System Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore the four key pillars of the restaurant ordering engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <Link
            href="/menu/bellavista-pizza"
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center shadow-inner">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                1. Customer Storefront
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                FoodBooking-style restaurant menu with sticky category nav, instant search, dietary tags, single & multi modifier groups (sizes, crusts, toppings), and zone checkout.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-orange-400 gap-1">
              <span>Try Storefront</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/admin/live-orders"
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-inner">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                2. Live Order Receiver
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                GloriaFood signature tablet console with web audio chime, +15m/+30m quick accept prep times, rejection reasons, and 80mm thermal kitchen ticket printing.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-amber-400 gap-1">
              <span>Open Receiver</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/order/ord-80124"
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                3. Live Order Tracking
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer live tracking screen with pulse animation, dynamic 5-step status timeline (Pending → Cooking → Dispatched → Completed), and live polling.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-indigo-400 gap-1">
              <span>View Tracking Demo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4 */}
          <Link
            href="/admin"
            className="group bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                4. Multi-Role Admin Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full RBAC dashboard: Menu & modifier builder, concentric delivery radius manager, tax & operating schedule settings, and searchable invoice ledger.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-bold text-emerald-400 gap-1">
              <span>Enter Admin</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Database Schema & Technical Architecture Specs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                MySQL Database Architecture (Prisma ORM)
              </h3>
              <p className="text-xs text-slate-400">
                Relational schema optimized for multi-tenant restaurants, nested modifier trees, and real-time state machines.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-orange-400">User & RBAC</span>
              <p className="text-slate-400">
                Super Admin, Restaurant Admin, Staff Operator, and Customer with scoped tenant role bindings.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-orange-400">Dynamic Menus</span>
              <p className="text-slate-400">
                Categories, Dishes, and Option Groups with Min/Max selection rules and per-item pricing.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-orange-400">Delivery Zones</span>
              <p className="text-slate-400">
                Radius & polygon zones with dynamic delivery fee, minimum order amounts, and free delivery perks.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
              <span className="font-bold text-orange-400">Orders & Invoices</span>
              <p className="text-slate-400">
                State transitions (Pending → Accepted → Preparing → Ready → Completed), thermal tickets & PDF receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>
          Online Restaurant Food Ordering System • Built with Next.js 16, MySQL & Prisma ORM.
        </p>
      </footer>
    </div>
  );
}
