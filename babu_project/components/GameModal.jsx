'use client';

export default function GameModal({ game, launchUrl, onClose, userBalance, onRefreshBalance }) {
  if (!game || !launchUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col">
      {/* Header Bar */}
      <div className="h-14 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
            ♠
          </span>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 leading-tight">
              {game.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              {game.provider}
            </span>
          </div>
        </div>

        {/* Center / Balance */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 mr-1.5 font-bold">Balance:</span>
            <span className="font-extrabold text-emerald-400">
              ${Number(userBalance || 0).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onRefreshBalance && onRefreshBalance()}
            title="Refresh Balance"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
          >
            ↻
          </button>
        </div>

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/40 transition-colors"
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

