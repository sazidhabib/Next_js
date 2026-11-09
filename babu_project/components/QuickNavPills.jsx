'use client';

export default function QuickNavPills({
  activePill,
  onSelectPill,
  onOpenWheel,
  onOpenCheckin,
}) {
  const pills = [
    { id: 'promotions', label: 'Promotion', icon: '🔥', badge: 'Hot' },
    { id: 'rewards', label: 'Rewards', icon: '🎁', action: onOpenCheckin },
    { id: 'referral', label: 'Refer and Earn', icon: '👥', badge: '5%' },
    { id: 'betting-pass', label: 'Betting Pass', icon: '🎟️' },
    { id: 'wheel', label: 'Lucky Wheel', icon: '🎡', action: onOpenWheel },
    { id: 'lottery', label: 'Lottery', icon: '🎰', badge: '৳250K' },
    { id: 'vip', label: 'VIP Club', icon: '👑' },
    { id: 'affiliate', label: 'Agent Affiliate', icon: '💼' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-200 py-2.5 overflow-x-auto scrollbar-none shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 min-w-max">
        {pills.map((pill) => {
          const isSelected = activePill === pill.id;

          return (
            <button
              key={pill.id}
              onClick={() => {
                if (pill.action) {
                  pill.action();
                } else if (onSelectPill) {
                  onSelectPill(pill.id);
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                isSelected
                  ? 'bg-amber-400 border-amber-500 text-slate-950 font-black shadow-xs scale-[1.02]'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-900 shadow-2xs'
              }`}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
              {pill.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    isSelected
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {pill.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
