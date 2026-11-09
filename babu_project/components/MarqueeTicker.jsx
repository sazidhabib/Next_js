'use client';

export default function MarqueeTicker({ announcement }) {
  const defaultText =
    announcement?.content ||
    '📢 Welcome to Betluxa Casino & Live Sportsbook! 24/7 instant cashouts available via bKash, Nagad, Rocket, Upay & USDT TRC20. Play responsibly 18+. Claim your 200% Welcome Bonus on your first deposit!';

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 mb-6 flex items-center gap-3 overflow-hidden shadow-2xs">
      <div className="flex items-center gap-1.5 text-amber-800 shrink-0 font-black text-xs bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
        <span>📢</span>
        <span className="hidden sm:inline">Notice</span>
      </div>

      <div className="overflow-hidden whitespace-nowrap flex-1">
        <div className="inline-block animate-marquee text-xs font-semibold text-gray-700 tracking-wide">
          {defaultText} &nbsp;&bull;&nbsp; 🎉 Player <strong className="text-amber-700 font-bold">@rakib_88</strong> just won <strong className="text-emerald-600 font-bold">৳ 24,500</strong> on Gates of Olympus! &nbsp;&bull;&nbsp; 🚀 Aviator multiplier reached <strong className="text-rose-600 font-bold">482.35x</strong>!
        </div>
      </div>
    </div>
  );
}
