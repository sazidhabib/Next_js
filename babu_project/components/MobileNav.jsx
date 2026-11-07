'use client';

import { GamepadIcon, CoinsIcon, ShieldIcon, ArrowDownLeftIcon, WalletIcon } from './Icons';

export default function MobileNav({ activeCategory, onSelectCategory, onOpenWallet }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeCategory === 'all' ? 'text-amber-400 font-bold' : 'text-slate-400'
        }`}
      >
        <GamepadIcon className="w-5 h-5" />
        <span className="text-[10px]">Lobby</span>
      </button>

      <button
        onClick={() => onSelectCategory('slots')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeCategory === 'slots' ? 'text-amber-400 font-bold' : 'text-slate-400'
        }`}
      >
        <CoinsIcon className="w-5 h-5" />
        <span className="text-[10px]">Slots</span>
      </button>

      {/* Floating Center Deposit Action */}
      <button
        onClick={() => onOpenWallet('deposit')}
        className="flex flex-col items-center justify-center -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/30 active:scale-95 transition-transform"
      >
        <ArrowDownLeftIcon className="w-6 h-6" />
      </button>

      <button
        onClick={() => onSelectCategory('live_casino')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeCategory === 'live_casino' ? 'text-amber-400 font-bold' : 'text-slate-400'
        }`}
      >
        <ShieldIcon className="w-5 h-5" />
        <span className="text-[10px]">Live</span>
      </button>

      <button
        onClick={() => onOpenWallet('history')}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400"
      >
        <WalletIcon className="w-5 h-5" />
        <span className="text-[10px]">Wallet</span>
      </button>
    </div>
  );
}

