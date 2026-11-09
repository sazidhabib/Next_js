'use client';

import { useState } from 'react';

export default function DailyCheckinModal({ isOpen, onClose, onClaimReward }) {
  const [claimedDay, setClaimedDay] = useState(1);
  const [claimedToday, setClaimedToday] = useState(false);

  if (!isOpen) return null;

  const days = [
    { day: 1, reward: '৳ 10', icon: '🪙' },
    { day: 2, reward: '৳ 20', icon: '🪙' },
    { day: 3, reward: '৳ 35', icon: '🎁' },
    { day: 4, reward: '৳ 50', icon: '💎' },
    { day: 5, reward: '৳ 75', icon: '🎰' },
    { day: 6, reward: '৳ 100', icon: '🔥' },
    { day: 7, reward: '৳ 250', icon: '👑', isMega: true },
  ];

  const handleClaim = () => {
    if (claimedToday) return;
    setClaimedToday(true);
    if (onClaimReward) {
      onClaimReward(10);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h3 className="font-black text-base text-gray-950">7-Day Check-In Rewards</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4">
          Check in every day consecutively to increase your bonus! Don't miss Day 7 for the Mega VIP Bonus.
        </p>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
          {days.map((d) => {
            const isCompleted = d.day < claimedDay || (d.day === claimedDay && claimedToday);
            const isToday = d.day === claimedDay && !claimedToday;

            return (
              <div
                key={d.day}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                  d.isMega
                    ? 'col-span-2 sm:col-span-1 bg-amber-50 border-amber-400 font-bold shadow-xs'
                    : isToday
                    ? 'border-amber-500 bg-amber-50/80 shadow-md shadow-amber-400/20 scale-105 font-bold'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50 opacity-80'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="text-[10px] font-bold text-gray-500">Day {d.day}</span>
                <span className="text-xl my-1">{d.icon}</span>
                <span className="text-xs font-black text-amber-700">{d.reward}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleClaim}
          disabled={claimedToday}
          className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
            claimedToday
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 shadow-amber-400/25 active:scale-95'
          }`}
        >
          {claimedToday ? '✓ Claimed for Today! Return Tomorrow' : 'CLAIM TODAY\'S REWARD'}
        </button>
      </div>
    </div>
  );
}
