'use client';

export default function GameModal({ game, launchUrl, onClose, userBalance, onRefreshBalance }) {
  if (!game || !launchUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col font-sans">
      {/* Header Bar */}
      <div className="h-14 px-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-sm">
            ♠
          </span>
          <div>
            <h3 className="font-extrabold text-sm text-gray-950 leading-tight">
              {game.name}
            </h3>
            <span className="text-[10px] text-gray-500 font-semibold uppercase">
              {game.provider}
            </span>
          </div>
        </div>

        {/* Center / Balance */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs shadow-2xs">
            <span className="text-gray-500 mr-1.5 font-bold">Balance:</span>
            <span className="font-black text-emerald-600">
              ${Number(userBalance || 0).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onRefreshBalance && onRefreshBalance()}
            title="Refresh Balance"
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs cursor-pointer"
          >
            ↻
          </button>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
        >
          Exit Game ✕
        </button>
      </div>

      {/* iFrame Game Screen */}
      <div className="flex-1 w-full h-full bg-black relative">
        <iframe
          src={launchUrl}
          title={game.name}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
}
