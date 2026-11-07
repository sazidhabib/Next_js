'use client';

import Link from 'next/link';
import { WalletIcon, ArrowDownLeftIcon, ArrowUpRightIcon, LogOutIcon, ShieldIcon } from './Icons';

export default function Navbar({
  user,
  onOpenAuth,
  onOpenWallet,
  onLogout,
  onRefreshProfile,
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              ♠
            </span>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                BETLUXA
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase -mt-1 font-semibold">
                CASINO & LIVE
              </span>
            </div>
          </Link>

          <Link
            href="/admin/login"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-slate-700 transition-colors"
          >
            <ShieldIcon className="w-3.5 h-3.5" />
            Admin Portal
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Balance Card */}
              <div
                onClick={() => onOpenWallet('history')}
                className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
                  <WalletIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                    Balance
                  </span>
                  <span className="font-extrabold text-emerald-400 text-sm leading-tight">
                    ${Number(user.wallet?.balance || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Deposit Action */}
              <button
                onClick={() => onOpenWallet('deposit')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all"
              >
                <ArrowDownLeftIcon className="w-4 h-4" />
                Deposit
              </button>

              {/* Withdraw Action */}
              <button
                onClick={() => onOpenWallet('withdraw')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <ArrowUpRightIcon className="w-4 h-4" />
                Withdraw
              </button>

              {/* User Dropdown / Logout */}
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 border border-slate-800 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs transition-colors"
              >
                Log In
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
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

