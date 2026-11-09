'use client';

export default function GameCard({ game, onPlay }) {
  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-amber-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col shadow-2xs"
    >
      {/* Game Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={game.thumbnail_url}
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Provider Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-xs">
            {game.provider}
          </span>
        </div>

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/40 transform scale-75 group-hover:scale-100 transition-transform">
            ▶
          </div>
          <span className="mt-2 text-xs font-black tracking-wider text-amber-300 uppercase">
            PLAY NOW
          </span>
        </div>
      </div>

      {/* Title & Info */}
      <div className="p-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
        <span className="font-bold text-xs text-gray-900 truncate group-hover:text-amber-700 transition-colors">
          {game.name}
        </span>
        <span className="text-[9px] uppercase font-bold text-gray-500 ml-2 shrink-0">
          {game.category.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
