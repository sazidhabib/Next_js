import Link from "next/link";
import { IconArrowRight } from "../../components/Icons";

export default function CollectionsPage() {
  const collections = [
    {
      id: 1,
      title: "আধুনিক বাংলা টাইপোগ্রাফি",
      englishTitle: "Modern Collection",
      tag: "Modern",
      tagColor: "bg-emerald-500/20 text-[#00e599] border-emerald-500/30",
      description: "পরিষ্কার, মিনিমাল এবং আধুনিক ডিজাইনের জন্য সেরা টাইপফেস কালেকশন।",
      fontCount: 32,
      foundryCount: 18,
      gradient: "from-emerald-950/40 via-[#121422] to-[#0f111a]",
    },
    {
      id: 2,
      title: "বিয়ের শুভ মুহূর্তের ফন্ট",
      englishTitle: "Wedding Collection",
      tag: "Wedding",
      tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      description: "বিয়ে, আমন্ত্রণপত্র এবং শুভ মুহূর্তের ডিজাইনের জন্য মার্জিত ফন্ট।",
      fontCount: 28,
      foundryCount: 14,
      gradient: "from-purple-950/40 via-[#121422] to-[#0f111a]",
    },
    {
      id: 3,
      title: "ইসলামিক আরবি ও বাংলা ফন্ট",
      englishTitle: "Islamic Collection",
      tag: "Islamic",
      tagColor: "bg-teal-500/20 text-teal-400 border-teal-500/30",
      description: "ইসলামিক ডিজাইন, কুরআন, হাদিস ও দাওয়াতের জন্য সুবিন্যস্ত ফন্ট।",
      fontCount: 26,
      foundryCount: 12,
      gradient: "from-teal-950/40 via-[#121422] to-[#0f111a]",
    },
    {
      id: 4,
      title: "ডিসপ্লে সৃজনশীল ও আকর্ষণীয়",
      englishTitle: "Display Collection",
      tag: "Display",
      tagColor: "bg-[#00e599]/20 text-[#00e599] border-[#00e599]/30",
      description: "শিরোনাম, পোস্টার এবং ক্রিয়েটিভ ডিজাইনের জন্য অসাধারণ ডিসপ্লে ফন্ট।",
      fontCount: 45,
      foundryCount: 20,
      gradient: "from-indigo-950/40 via-[#121422] to-[#0f111a]",
    },
    {
      id: 5,
      title: "সংবাদপত্রের ক্লাসিক বাংলা ফন্ট",
      englishTitle: "Newspaper Collection",
      tag: "Newspaper",
      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "সংবাদপত্র, ম্যাগাজিন এবং রিপোর্ট ডিজাইনের জন্য লেগিবল টাইপফেস।",
      fontCount: 22,
      foundryCount: 10,
      gradient: "from-blue-950/40 via-[#121422] to-[#0f111a]",
    },
    {
      id: 6,
      title: "ব্র্যান্ডিং কর্পোরেট ও লোগো ফন্ট",
      englishTitle: "Branding Collection",
      tag: "Branding",
      tagColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      description: "লোগো, ব্র্যান্ড আইডেন্টিটি ও কর্পোরেট ডিজাইনের জন্য প্রিমিয়াম লুক।",
      fontCount: 30,
      foundryCount: 16,
      gradient: "from-amber-950/40 via-[#121422] to-[#0f111a]",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Collections</h1>
          <p className="text-xs text-gray-400 mt-1">
            বিভিন্ন থিম এবং ব্যবহারের জন্য সাজানো আমাদের প্রিমিয়াম ফন্ট কালেকশনগুলো দেখুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search collections..."
            className="w-full sm:w-auto bg-[#161824] border border-white/10 text-xs text-white placeholder-gray-500 px-3 sm:px-4 py-2 rounded-xl focus:outline-none focus:border-[#00e599]"
          />
        </div>
      </div>

      {/* Collections Grid matching Screenshot 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {collections.map((item) => (
          <div
            key={item.id}
            className={`group bg-gradient-to-br ${item.gradient} border border-white/10 hover:border-[#00e599]/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between min-h-[220px] sm:min-h-[260px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,153,0.15)] relative overflow-hidden`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="text-xs text-gray-500">{item.fontCount} Fonts</span>
              </div>

              <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-[#00e599] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
              <div>
                <div className="text-xs font-semibold text-gray-200">{item.englishTitle}</div>
                <div className="text-[10px] text-gray-500">
                  {item.fontCount} Fonts • {item.foundryCount} Foundries
                </div>
              </div>

              <Link
                href="/free-fonts"
                className="w-9 h-9 rounded-2xl bg-[#1d202c] group-hover:bg-[#00e599] group-hover:text-gray-950 text-gray-300 flex items-center justify-center transition-all shadow-md"
              >
                <IconArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
