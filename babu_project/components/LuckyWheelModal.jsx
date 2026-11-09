'use client';

import { useState } from 'react';

export default function LuckyWheelModal({ isOpen, onClose, onRewardClaimed }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const rewards = [
    { label: '৳ 50 Cash', amount: 50 },
    { label: '25 Free Spins', amount: 25 },
    { label: '৳ 100 Bonus', amount: 100 },
    { label: 'Better Luck', amount: 0 },
    { label: '৳ 500 VIP Cash', amount: 500 },
    { label: '50 Loyalty Pts', amount: 50 },
    { label: '৳ 200 Reload', amount: 200 },
    { label: 'Mystery Gift', amount: 75 },
  ];

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Pick random index
    const randomIndex = Math.floor(Math.random() * rewards.length);
    const prize = rewards[randomIndex];
    const segmentDegree = 360 / rewards.length;
    const extraRounds = 5 * 360; // 5 full rotations
    const targetDegree = extraRounds + (rewards.length - randomIndex) * segmentDegree - segmentDegree / 2;

    setRotation(targetDegree);

    setTimeout(() => {
      setSpinning(false);
      setResult(prize);
      if (onRewardClaimed && prize.amount > 0) {
        onRewardClaimed(prize);
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-center overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-16 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎡</span>
            <h3 className="font-black text-base text-gray-950">Wheel of Fortune</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-6">
          Spin the lucky wheel once every 24 hours to win free casino cash and mystery spins!
        </p>

        {/* The Animated Wheel */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          {/* Wheel Pointer Arrow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 filter drop-shadow-md" />

          {/* Wheel Disc */}
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
            }}
            className="w-full h-full rounded-full border-4 border-amber-400 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 shadow-xl relative overflow-hidden flex items-center justify-center"
          >
            {rewards.map((r, i) => (
              <div
                key={i}
                style={{
                  transform: `rotate(${i * 45}deg)`,
                }}
                className="absolute w-full h-full flex justify-center pt-2 text-[10px] font-black uppercase text-slate-950 tracking-wider"
              >
                <span className="bg-white/80 px-1 rounded shadow-2xs">{r.label}</span>
              </div>
            ))}
          </div>

          {/* Center Hub */}
          <div className="absolute z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-slate-950 to-gray-900 text-amber-400 font-black text-xs flex items-center justify-center shadow-lg border-2 border-white">
            SPIN
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-black animate-bounce shadow-xs">
            🎉 Congratulations! You won {result.label}!
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={spinning}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-sm shadow-md shadow-amber-400/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {spinning ? 'Spinning...' : 'SPIN FREE WHEEL'}
        </button>
      </div>
    </div>
  );
}
