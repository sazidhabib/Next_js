import Link from "next/link";
import { IconDownload } from "./Icons";

export default function DownloadMarquee({ fonts }) {
  if (!fonts || fonts.length === 0) return null;

  // Get unique fonts to inject styles once
  const uniqueFonts = Array.from(new Map(fonts.map(font => [font.id, font])).values());

  // Duplicate items to ensure seamless loop
  const marqueeItems = [...fonts, ...fonts, ...fonts, ...fonts];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-purple-950/20 via-surface/40 to-emerald-950/20 border-y border-white/5 py-4 sm:py-5 my-2">
      {uniqueFonts.map((font) => {
        const fontFam = `font-marquee-${font.id}`;
        const previewFontUrl = font.previewImageUrl || font.fontFileUrl;
        if (!previewFontUrl) return null;
        return (
          <style key={font.id} dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: '${fontFam}';
              src: url('${previewFontUrl}');
              font-display: swap;
            }
          `}} />
        );
      })}

      {/* Absolute Side Gradients for fading effect */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Container holding label & marquee */}
      <div className="flex flex-col md:flex-row items-center gap-4 px-4 max-w-7xl mx-auto">
        {/* Label Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shrink-0 select-none z-10 shadow-lg shadow-black/30">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e599] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e599]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-gray-300 uppercase">
            Trending Downloads
          </span>
        </div>

        {/* Marquee Wrapper */}
        <div className="w-full overflow-hidden py-1 relative">
          <div className="animate-marquee hover:[animation-play-state:paused] flex gap-4 select-none">
            {marqueeItems.map((font, idx) => {
              const fontFam = `font-marquee-${font.id}`;
              const previewFontUrl = font.previewImageUrl || font.fontFileUrl;
              return (
                <Link
                  key={`${font.id}-${idx}`}
                  href={`/free-font/${font.slug}`}
                  className="flex items-center gap-3 bg-[#11131a]/80 hover:bg-[#161822] hover:border-[#00e599]/40 border border-white/5 px-4 py-2 rounded-xl transition-all duration-300 group shrink-0"
                >
                  <div className="flex flex-col items-start">
                    <span
                      className="text-md text-white group-hover:text-[#00e599] transition-colors"
                      style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit' }}
                    >
                      {font.banglaName || font.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans">
                      {font.designer?.name || "NextType"}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-white/10" />

                  <div className="flex items-center gap-1.5 text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded-lg text-xs font-semibold">
                    <IconDownload className="text-[10px]" />
                    <span className="font-mono">{(font.downloadCount || 0).toLocaleString()}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
