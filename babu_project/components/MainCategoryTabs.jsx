'use client';

export default function MainCategoryTabs({ activeCategory, onSelectCategory }) {
  const categories = [
    { id: 'all', label: 'All Games', icon: '🎰' },
    { id: 'cricket', label: 'Cricket', icon: '🏏', badge: 'Live' },
    { id: 'live-casino', label: 'Live Casino', icon: '👑', badge: 'HD' },
    { id: 'slots', label: 'Slot Games', icon: '🍒', badge: 'Hot' },
    { id: 'crash', label: 'Crash & Fast', icon: '🚀', badge: '1000x' },
    { id: 'table', label: 'Table Games', icon: '♠️' },
    { id: 'fishing', label: 'Fishing', icon: '🐟' },
    { id: 'sportsbook', label: 'Sportsbook', icon: '⚽' },
    { id: 'lottery', label: 'Lottery', icon: '🎟️' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all border cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/25 scale-[1.02]'
                : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50/30 shadow-2xs'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
            {cat.badge && (
              <span
                className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                  isActive
                    ? 'bg-slate-950 text-amber-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {cat.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
