'use client';

import { useState, useEffect } from 'react';

export default function HeroSlider({ onOpenAuth, onOpenWallet, isLoggedIn }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [jackpot, setJackpot] = useState(12482910.45);

  const slides = [
    {
      id: 1,
      badge: 'FIRST DEPOSIT WELCOME OFFER',
      title: '200% WELCOME BONUS UP TO ৳20,000',
      subtitle: 'Spin 5,000+ Slots from Pragmatic Play & PG Soft with 24/7 instant cashouts.',
      tag: 'NEW PLAYERS',
      gradient: 'from-amber-600 via-amber-500 to-yellow-500',
      textColor: 'text-slate-950',
      subTextColor: 'text-amber-950',
      badgeBg: 'bg-slate-950 text-amber-400 border-slate-800',
      btnBg: 'bg-slate-950 text-white hover:bg-black',
    },
    {
      id: 2,
      badge: 'UNLIMITED DAILY RELOAD',
      title: 'UNLIMITED 5% DEPOSIT BONUS ON ALL GAMES',
      subtitle: 'Claim extra chips on every single deposit via bKash, Nagad, Rocket & USDT.',
      tag: 'ALL MEMBERS',
      gradient: 'from-emerald-700 via-teal-600 to-emerald-500',
      textColor: 'text-white',
      subTextColor: 'text-emerald-100',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-400/40',
      btnBg: 'bg-amber-400 text-slate-950 hover:bg-amber-300',
    },
    {
      id: 3,
      badge: 'CRICKET EXCHANGE & LIVE SPORTS',
      title: 'BANGLADESH vs SRI LANKA & IPL LIVE ODDS',
      subtitle: 'Highest odds, instant bet settlement, and live HD match streaming.',
      tag: 'SPORTSBOOK',
      gradient: 'from-blue-700 via-indigo-600 to-blue-500',
      textColor: 'text-white',
      subTextColor: 'text-blue-100',
      badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-400/40',
      btnBg: 'bg-amber-400 text-slate-950 hover:bg-amber-300',
    },
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Live ticking jackpot counter
  useEffect(() => {
    const ticker = setInterval(() => {
      setJackpot((prev) => Number((prev + (Math.random() * 1.5 + 0.2)).toFixed(2)));
    }, 800);
    return () => clearInterval(ticker);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative mb-6">
      {/* Banner Carousel Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r ${slide.gradient} p-6 sm:p-10 shadow-lg transition-all duration-700`}
      >
        {/* Glow decorative pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-black tracking-wide mb-3 ${slide.badgeBg}`}>
            <span>🔥</span>
            <span>{slide.badge}</span>
          </div>

          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3 ${slide.textColor}`}>
            {slide.title}
          </h1>

          <p className={`text-xs sm:text-sm md:text-base leading-relaxed mb-6 max-w-xl font-medium ${slide.subTextColor}`}>
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => onOpenWallet('deposit')}
                className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer ${slide.btnBg}`}
              >
                <span>💰</span>
                <span>Deposit & Claim Bonus</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('register')}
                className={`px-6 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer ${slide.btnBg}`}
              >
                Join Now & Claim ৳20,000
              </button>
            )}

            {/* Live Jackpot Counter Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/90 text-white border border-slate-800 text-xs shadow-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">
                  Global Progressive Jackpot
                </span>
                <span className="text-sm font-black font-mono text-amber-400">
                  ৳ {jackpot.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-4 right-6 flex items-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === i ? 'w-7 bg-white shadow-sm' : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
