'use client';

import { FlameIcon, CoinsIcon } from './Icons';

export default function HeroBanner({ onOpenAuth, isLoggedIn, onOpenWallet }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/60 border border-slate-800 p-6 md:p-10 mb-8 shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-4">
          <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>WELCOME OFFER &bull; 200% FIRST DEPOSIT BONUS</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          PREMIUM CASINO & LIVE DEALER ACTION
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
          Spin over 5,000+ slots from Pragmatic Play, experience Evolution Live Casino, and cash out instantly with local mobile banking & USDT.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {isLoggedIn ? (
            <button
              onClick={() => onOpenWallet('deposit')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-yellow-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <CoinsIcon className="w-4 h-4" />
              Deposit & Claim Bonus
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-yellow-500/20 active:scale-95 transition-all"
            >
              Join Now & Play Free Demo
            </button>
          )}

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Over $1.2M+ in Jackpots Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

