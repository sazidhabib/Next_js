'use client';

import { GamepadIcon, FlameIcon, ShieldIcon, CoinsIcon } from './Icons';

export default function CategoryTabs({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: 'all', label: 'All Games', icon: GamepadIcon },
    { id: 'slots', label: 'Slots', icon: CoinsIcon },
    { id: 'live_casino', label: 'Live Casino', icon: ShieldIcon },
    { id: 'crash', label: 'Crash Games', icon: FlameIcon },
    { id: 'table', label: 'Table Games', icon: GamepadIcon },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all border ${
              isActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

