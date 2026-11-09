'use client';

import { useState, useEffect } from 'react';

export default function RecentWinnersTicker() {
  const initialWinners = [
    { id: 1, user: 'sakib***', game: 'Gates of Olympus', amount: '৳ 14,200', time: '1m ago', provider: 'Pragmatic' },
    { id: 2, user: 'tanvir***', game: 'Crazy Time', amount: '৳ 38,500', time: '2m ago', provider: 'Evolution' },
    { id: 3, user: 'hasan***', game: 'Aviator', amount: '৳ 9,800', time: '3m ago', provider: 'Spribe' },
    { id: 4, user: 'arif***', game: 'Sweet Bonanza', amount: '৳ 22,100', time: '4m ago', provider: 'Pragmatic' },
    { id: 5, user: 'fahim***', game: 'Lightning Roulette', amount: '৳ 45,000', time: '5m ago', provider: 'Evolution' },
  ];

  const [winners, setWinners] = useState(initialWinners);

  // Periodically simulate a new win
  useEffect(() => {
    const timer = setInterval(() => {
      const names = ['kamal***', 'nahid***', 'rubel***', 'shuvo***', 'badhon***'];
      const games = ['Gates of Olympus', 'Aviator', 'Mega Wheel', 'Sugar Rush', 'Cricket X'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomAmount = `৳ ${(Math.floor(Math.random() * 300) * 100 + 1500).toLocaleString()}`;

      const newWin = {
        id: Date.now(),
        user: randomName,
        game: randomGame,
        amount: randomAmount,
        time: 'Just now',
        provider: 'Verified',
      };

      setWinners((prev) => [newWin, ...prev.slice(0, 4)]);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs mb-3">
        <div className="flex items-center gap-2">
          <span className="text-amber-800 font-bold">🏆 Live Recent Winners</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <span className="text-gray-400 text-[11px] font-medium">Real-time payout telemetry</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {winners.map((win) => (
          <div
            key={win.id}
            className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex flex-col justify-between shadow-2xs hover:border-amber-300 transition-colors"
          >
            <div>
              <span className="text-[10px] text-gray-500 font-mono block">{win.user}</span>
              <span className="font-bold text-xs text-gray-900 truncate block mt-0.5">{win.game}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="font-black text-xs text-emerald-600">{win.amount}</span>
              <span className="text-[9px] text-gray-500 font-bold">{win.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
