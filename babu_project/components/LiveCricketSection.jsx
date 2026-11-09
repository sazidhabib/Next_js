'use client';

export default function LiveCricketSection({ onPlaceBet }) {
  const matches = [
    {
      id: 'cric_1',
      tournament: 'T20 International Series',
      teamA: 'Bangladesh',
      teamB: 'Sri Lanka',
      scoreA: '168/4 (18.2 ov)',
      scoreB: 'Yet to bat',
      status: 'Live &bull; 2nd Innings',
      oddsA: 1.85,
      oddsB: 1.95,
      isLive: true,
    },
    {
      id: 'cric_2',
      tournament: 'Indian Premier League (IPL)',
      teamA: 'Chennai Super Kings',
      teamB: 'Mumbai Indians',
      scoreA: 'Starts at 7:30 PM',
      scoreB: 'Eden Gardens',
      status: 'Today',
      oddsA: 1.92,
      oddsB: 1.88,
      isLive: false,
    },
  ];

  return (
    <div className="mb-8 font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h2 className="text-lg font-black text-gray-950 uppercase tracking-wide">
            🏏 Live Cricket Exchange & Odds
          </h2>
        </div>
        <span className="text-xs text-amber-700 font-bold hover:underline cursor-pointer">
          View All Sports &rarr;
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((m) => (
          <div
            key={m.id}
            className="bg-white border border-gray-200 hover:border-amber-400 p-4 rounded-2xl transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-xs">
                <span className="text-gray-500 font-bold">{m.tournament}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    m.isLive
                      ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  dangerouslySetInnerHTML={{ __html: m.status }}
                />
              </div>

              <div className="py-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900">{m.teamA}</span>
                  <span className="font-mono font-bold text-amber-700 text-xs">{m.scoreA}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-gray-900">{m.teamB}</span>
                  <span className="font-mono text-gray-500 text-xs">{m.scoreB}</span>
                </div>
              </div>
            </div>

            {/* Back / Lay Betting Odds Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => onPlaceBet && onPlaceBet(m.teamA, m.oddsA)}
                className="py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-800 font-black text-xs flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span>{m.teamA}</span>
                <span className="text-blue-900 group-hover:text-white font-mono font-black">{m.oddsA}</span>
              </button>

              <button
                onClick={() => onPlaceBet && onPlaceBet(m.teamB, m.oddsB)}
                className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-500 hover:text-slate-950 border border-amber-200 text-amber-900 font-black text-xs flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span>{m.teamB}</span>
                <span className="text-amber-800 group-hover:text-slate-950 font-mono font-black">{m.oddsB}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
