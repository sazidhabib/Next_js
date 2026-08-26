import Link from "next/link";
import { IconDownload } from "./Icons";
import { resolveFontUrl } from "../lib/fontUtils";

export default function DarkFontCard({ font }) {
  const isPro = font.fontType === "PREMIUM";
  const priceDisplay = font.price ? `৳ ${font.price.toLocaleString("bn-BD")}` : null;
  const fontFam = `font-card-preview-${font.id}`;

  // Card gradient variations matching stylesheet variables
  const gradientStyles = [
    { background: "var(--card-gradient-1)" },
    { background: "var(--card-gradient-2)" },
    { background: "var(--card-gradient-3)" },
    { background: "var(--card-gradient-4)" },
  ];
  const bgStyle = gradientStyles[(font.id || 0) % gradientStyles.length];
  const previewFontUrl = resolveFontUrl(font.previewImageUrl || font.fontFileUrl);

  return (
    <div className="group relative bg-surface-card border border-border hover:border-[#00e599]/50 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,229,153,0.15)] flex flex-col justify-between">
      {previewFontUrl && (
        <style dangerouslySetInnerHTML={{
          __html: `
          @font-face {
            font-family: '${fontFam}';
            src: url('${previewFontUrl}');
            font-display: swap;
          }
        `}} />
      )}

      {/* Top Header Row */}
      <div className="p-3 sm:p-4 pb-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 mr-2">
          <span
            className="text-[10px] sm:text-xs font-medium text-text-muted group-hover:text-foreground transition-colors truncate max-w-[65%]"
            style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit' }}
          >
            {font.banglaName || font.name}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-text-muted/80 shrink-0">
            <IconDownload className="text-[9px] sm:text-[10px] text-text-muted" />
            <span>{(font.downloadCount || 0).toLocaleString("bn-BD")}</span>
          </div>
        </div>
        <span
          className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 ${isPro
              ? "bg-purple-600/30 text-purple-400 border border-purple-500/30"
              : "bg-emerald-500/20 text-[#00e599] border border-emerald-500/30"
            }`}
        >
          {isPro ? "Pro" : "Free"}
        </span>
      </div>

      {/* Font Sample Text Banner */}
      <Link href={`/free-font/${font.slug}`} className="block p-3 sm:p-5 py-4 sm:py-6 my-1">
        <div 
          style={bgStyle}
          className="rounded-lg sm:rounded-xl p-3 sm:p-5 border border-border/50 group-hover:border-border transition-all text-center min-h-[80px] sm:min-h-[110px] flex items-center justify-center"
        >
          <h3
            className="text-xl sm:text-2xl md:text-3xl font-normal text-foreground tracking-tight leading-snug group-hover:scale-[1.02] transition-transform break-words"
            style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit' }}
          >
            {font.name === "SutonnyMJ"
              ? "সুন্দর এবং পাঠযোগ্য বাংলা টাইপফেস"
              : font.name === "NikoshBAN"
                ? "নিকষ এবং মডার্ন ডিজাইন"
                : font.name === "SolaimanLipi"
                  ? "সলেমান লিপি স্টাইলিশ ও মার্জিত"
                  : font.description || "বাংলা ফন্ট টাইপোগ্রাফি"}
          </h3>
        </div>
      </Link>

      {/* Bottom Metadata Bar */}
      <div className="p-3 sm:p-4 pt-2 flex items-center justify-between border-t border-border/50 mt-auto text-xs text-text-muted">
        <div className="min-w-0 flex-1 mr-2">
          <div className="text-foreground font-medium text-[11px] sm:text-xs truncate">{font.name}</div>
          <div className="text-[9px] sm:text-[10px] text-text-muted/80 truncate">
            {font.designer?.name || "NextType"} • {font.style || "Serif"}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {priceDisplay && (
            <span className="font-semibold text-foreground text-[11px] sm:text-xs">{priceDisplay}</span>
          )}
          <Link
            href={`/free-font/${font.slug}`}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-surface hover:bg-surface-card group-hover:bg-[#00e599] group-hover:text-gray-955 text-text-muted hover:text-foreground flex items-center justify-center transition-all border border-border"
            title="Download / Details"
          >
            <IconDownload className="text-xs sm:text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}
