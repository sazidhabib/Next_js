'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, UtensilsCrossed, Clock, MapPin, Search, ChevronDown, ShieldCheck, Bell } from 'lucide-react';

export default function Navbar({
  restaurant,
  cartCount,
  cartTotal,
  onOpenCart,
  serviceType,
  setServiceType,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification / Demo Quick Navigation Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium text-[11px]">
            ⚡ GloriaFood Inspired Engine
          </span>
          <span className="hidden sm:inline text-slate-400">
            Real-time multi-tenant restaurant ordering platform with MySQL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/live-orders"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>Kitchen Order Receiver</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            href="/admin"
            className="flex items-center gap-1 text-slate-300 hover:text-white font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand / Restaurant Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              {restaurant?.logoUrl ? (
                <img
                  src={restaurant.logoUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UtensilsCrossed className="w-6 h-6" />
              )}
            </div>
            <div>
              <Link href="/" className="font-bold text-slate-900 text-base sm:text-lg hover:text-orange-600 transition-colors leading-tight line-clamp-1">
                {restaurant?.name || 'Bella Vista Gourmet Kitchen'}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Open Now
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 hidden xs:inline-flex">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {restaurant?.estimatedPrepTime || 25} - {(restaurant?.estimatedPrepTime || 25) + 15} mins
                </span>
              </div>
            </div>
          </div>

          {/* Center: Fulfillment Selector (Delivery vs Pickup) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setServiceType('DELIVERY')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                serviceType === 'DELIVERY'
                  ? 'bg-white text-orange-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛵 Delivery
            </button>
            <button
              onClick={() => setServiceType('PICKUP')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                serviceType === 'PICKUP'
                  ? 'bg-white text-orange-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛍️ Pickup
            </button>
            <button
              onClick={() => setServiceType('DINE_IN')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                serviceType === 'DINE_IN'
                  ? 'bg-white text-orange-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🍽️ Dine-In
            </button>
          </div>

          {/* Right Action: Search & Cart Button */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden lg:block w-48 xl:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search pizzas, burgers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/25 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-orange-700/80 px-2 py-0.5 rounded-md text-xs font-bold">
                ${cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
