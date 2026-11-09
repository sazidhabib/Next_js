'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  WalletIcon,
  ShieldIcon,
  LogOutIcon,
  ArrowDownToLineIcon,
  BellIcon,
} from './Icons';

export default function Header({
  user,
  onOpenAuth,
  onOpenWallet,
  onLogout,
  onOpenWheel,
  onOpenCheckin,
}) {
  const [currency, setCurrency] = useState('BDT');
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const currencies = [
    { code: 'BDT', symbol: '৳', name: 'Bangladesh', flag: '🇧🇩' },
    { code: 'INR', symbol: '₹', name: 'India', flag: '🇮🇳' },
    { code: 'USD', symbol: '$', name: 'Global / USDT', flag: '🌐' },
    { code: 'PKR', symbol: '₨', name: 'Pakistan', flag: '🇵🇰' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-xs font-sans">
      {/* Top utility sub-header */}
      <div className="hidden md:flex items-center justify-between px-4 lg:px-8 py-1.5 bg-gray-50 border-b border-gray-200 text-[11px] text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            24/7 Live Deposit & Cashout Active
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-700">
            Official Agent: <strong className="text-amber-700 font-mono">+880 1711-888888</strong> (bKash / Nagad / Rocket)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-gray-600 hover:text-amber-600 transition-colors font-bold"
          >
            <ShieldIcon className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
          <span className="text-gray-300">|</span>
          <button
            onClick={onOpenWheel}
            className="text-amber-600 hover:text-amber-700 font-black flex items-center gap-1 transition-colors"
          >
            🎡 Lucky Wheel (Free Spin)
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={onOpenCheckin}
            className="text-emerald-600 hover:text-emerald-700 font-bold"
          >
            🎁 Daily Check-In
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Currency Selector */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 flex items-center justify-center font-black text-slate-950 text-xl shadow-md shadow-amber-400/30 group-hover:scale-105 transition-transform">
              ♠
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight text-gray-950">
                  BETLUXA
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-[10px] font-black uppercase text-amber-800">
                  CASINO
                </span>
              </div>
              <span className="text-[9px] tracking-wider text-gray-500 uppercase -mt-1 font-bold hidden sm:block">
                SPORTSBOOK &bull; LIVE CASINO
              </span>
            </div>
          </Link>

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-amber-400 text-xs font-bold text-gray-800 transition-all shadow-2xs"
            >
              <span>{currencies.find((c) => c.code === currency)?.flag}</span>
              <span className="text-amber-700 font-black">{currency}</span>
              <span className="text-[10px] text-gray-400">▼</span>
            </button>

            {currencyMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      currency === c.code
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                      <span className="text-[10px] text-gray-500 font-normal">({c.name})</span>
                    </span>
                    <span className="font-mono text-amber-600 font-bold">{c.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Authenticated vs Guest */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Playable Balance Card */}
              <div
                onClick={() => onOpenWallet('history')}
                className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-amber-400 px-3 sm:px-4 py-1.5 rounded-xl flex items-center gap-2 transition-all shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 font-black text-sm">
                  {currency === 'BDT' ? '৳' : '$'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-gray-500 uppercase leading-none">
                    Main Balance
                  </span>
                  <span className="font-black text-emerald-600 text-sm leading-tight">
                    {currency === 'BDT' ? '৳' : '$'}
                    {Number(user.wallet?.balance || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Deposit Action */}
              <button
                onClick={() => onOpenWallet('deposit')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-400/25 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowDownToLineIcon className="w-4 h-4" />
                <span>Deposit</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 rounded-xl bg-gray-50 hover:bg-rose-50 hover:text-rose-600 text-gray-500 border border-gray-200 transition-colors cursor-pointer"
              >
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Log In
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs shadow-md shadow-amber-400/25 active:scale-95 transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
