'use client';

import { GamepadIcon, ShieldIcon, ArrowDownToLineIcon, WalletIcon } from './Icons';

export default function MobileNav({
  activeCategory,
  onSelectCategory,
  onOpenWallet,
  onOpenWheel,
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-2 flex items-center justify-around font-sans shadow-lg">
      <button
        onClick={() => onSelectCategory('all')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeCategory === 'all' ? 'text-amber-700 font-black' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <GamepadIcon className="w-5 h-5" />
        <span className="text-[10px]">Lobby</span>
      </button>

      <button
        onClick={() => onSelectCategory('cricket')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeCategory === 'cricket' ? 'text-amber-700 font-black' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <span className="text-base leading-none">🏏</span>
        <span className="text-[10px]">Cricket</span>
      </button>

      {/* Floating Center Gold Deposit Action */}
      <button
        onClick={() => onOpenWallet('deposit')}
        className="flex flex-col items-center justify-center -mt-6 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-400/40 active:scale-95 transition-transform border-4 border-white cursor-pointer"
      >
        <ArrowDownToLineIcon className="w-6 h-6" />
      </button>

      <button
        onClick={() => onSelectCategory('live-casino')}
        className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeCategory === 'live-casino' ? 'text-amber-700 font-black' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <ShieldIcon className="w-5 h-5" />
        <span className="text-[10px]">Live</span>
      </button>

      <button
        onClick={onOpenWheel}
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-amber-700 font-black cursor-pointer hover:text-amber-800"
      >
        <span className="text-base leading-none">🎡</span>
        <span className="text-[10px]">Wheel</span>
      </button>
    </div>
  );
}
