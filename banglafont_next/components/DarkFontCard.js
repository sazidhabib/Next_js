import Link from "next/link";
import { IconDownload } from "./Icons";

export default function DarkFontCard({ font }) {
  const isPro = font.fontType === "PREMIUM";
  const priceDisplay = font.price ? `৳ ${font.price.toLocaleString("bn-BD")}` : "Free";
  const fontFam = `font-card-preview-${font.id}`;

  // Card gradient variations matching screenshot cards
  const gradients = [
    "from-[#19152b] via-[#121422] to-[#0f111a]",
    "from-[#111a2e] via-[#111422] to-[#0f111a]",
    "from-[#181d1a] via-[#11161a] to-[#0f111a]",
    "from-[#241322] via-[#15121c] to-[#0f111a]",
  ];
  const bgGradient = gradients[(font.id || 0) % gradients.length];
  const previewFontUrl = font.previewImageUrl || font.fontFileUrl;

  return (
    <div className="group relative bg-[#13151f] border border-white/10 hover:border-[#00e599]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,229,153,0.15)] flex flex-col justify-between">
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
      <div className="p-4 pb-0 flex items-center justify-between z-10">
        <span
          className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors"
          style={{ fontFamily: previewFontUrl ? `'${fontFam}', sans-serif` : 'inherit' }}
        >
          {font.banglaName || font.name}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isPro
              ? "bg-purple-600/30 text-purple-400 border border-purple-500/30"
              : "bg-emerald-500/20 text-[#00e599] border border-emerald-500/30"
            }`}
        >
          {isPro ? "Pro" : "Free"}
        </span>
      </div>

      {/* Font Sample Text Banner */}
      <Link href={`/free-font/${font.slug}`} className="block p-5 py-6 my-1">
        <div className={`rounded-xl p-5 bg-gradient-to-br ${bgGradient} border border-white/5 group-hover:border-white/10 transition-all text-center min-h-[110px] flex items-center justify-center`}>
          <h3
            className="text-2xl sm:text-3xl font-normal text-gray-100 tracking-tight leading-snug group-hover:scale-[1.02] transition-transform"
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
      <div className="p-4 pt-2 flex items-center justify-between border-t border-white/5 mt-auto text-xs text-gray-400">
        <div>
          <div className="text-gray-200 font-medium text-xs">{font.name}</div>
          <div className="text-[10px] text-gray-500">
            {font.designer?.name || "BanglaType"} • {font.style || "Serif"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-200 text-xs">{priceDisplay}</span>
          <Link
            href={`/free-font/${font.slug}`}
            className="w-8 h-8 rounded-xl bg-[#1d202c] group-hover:bg-[#00e599] group-hover:text-gray-950 text-gray-300 flex items-center justify-center transition-all"
            title="Download / Details"
          >
            <IconDownload className="text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
}

