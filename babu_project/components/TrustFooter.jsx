'use client';

export default function TrustFooter() {
  const paymentMethods = [
    { name: 'bKash', color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { name: 'Nagad', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { name: 'Rocket', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { name: 'Upay', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'Bank Wire', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    { name: 'USDT (TRC-20)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  const providers = [
    'Pragmatic Play',
    'Evolution Gaming',
    'PG Soft',
    'Spribe (Aviator)',
    'JILI Games',
    'NetEnt',
    'BGaming',
    'SABA Sports',
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-200 pt-12 pb-24 md:pb-12 text-gray-600 font-sans mt-16 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Payment Gateways Bar */}
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-3 text-center sm:text-left">
            Accepted Payment Channels &bull; Instant Deposit & Payout
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {paymentMethods.map((m) => (
              <span
                key={m.name}
                className={`px-3 py-1.5 rounded-xl border text-xs font-black shadow-2xs ${m.color}`}
              >
                {m.name}
              </span>
            ))}
          </div>
        </div>

        {/* Game Providers Bar */}
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 block mb-3 text-center sm:text-left">
            Official Licensed Game Providers
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {providers.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Security & Licensing Trust Seals */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-black text-xs border border-rose-300 flex items-center justify-center shadow-2xs">
              18+
            </span>
            <div>
              <span className="font-extrabold text-gray-900 block">Responsible Gaming</span>
              <span className="text-[10px] text-gray-500">Play with control. All games utilize certified RNG.</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>&bull;</span>
            <span>🛡️ Provably Fair Engine</span>
            <span>&bull;</span>
            <span>⚡ Seamless Wallet v2.0</span>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="text-center text-[11px] text-gray-500 pt-4 border-t border-gray-100 space-y-2">
          <p className="font-semibold text-gray-800">
            &copy; {new Date().getFullYear()} BetLuxa Gaming Platform. All Rights Reserved.
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed text-gray-500">
            Betluxa is an authorized international online gaming and entertainment operator. Services are strictly restricted to persons above the legal gambling age.
          </p>
        </div>
      </div>
    </footer>
  );
}
