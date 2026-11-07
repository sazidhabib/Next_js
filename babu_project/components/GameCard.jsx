'use client';

export default function GameCard({ game, onPlay }) {
  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-500/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-amber-500/10 flex flex-col"
    >
      {/* Game Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumbnail_url}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Provider Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-amber-400 border border-slate-800">
            {game.provider}
          </span>
        </div>

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/30 transform scale-75 group-hover:scale-100 transition-transform">
            ▶
          </div>
          <span className="mt-2 text-xs font-black tracking-wider text-amber-300 uppercase">
            PLAY NOW
          </span>
        </div>
      </div>

      {/* Title & Info */}
      <div className="p-3 bg-slate-900/90 flex items-center justify-between border-t border-slate-800/60">
        <span className="font-bold text-sm text-slate-200 truncate group-hover:text-amber-400 transition-colors">
          {game.name}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-500 ml-2">
          {game.category.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}

