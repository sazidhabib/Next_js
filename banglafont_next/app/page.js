import Link from "next/link";
import { prisma } from "../lib/prisma";
import DarkFontCard from "../components/DarkFontCard";
import HomeTypeTester from "../components/HomeTypeTester";

async function getHomeData() {
  const [totalFonts, totalDownloads, featuredFonts, topFonts, allFonts] = await Promise.all([
    prisma.font.count({ where: { published: true } }),
    prisma.font.aggregate({ _sum: { downloadCount: true } }),
    prisma.font.findMany({
      where: { published: true, featured: true },
      include: { designer: true },
      orderBy: { downloadCount: "desc" },
      take: 8,
    }),
    prisma.font.findMany({
      where: { published: true },
      include: { designer: true },
      orderBy: { downloadCount: "desc" },
      take: 6,
    }),
    prisma.font.findMany({
      where: { published: true },
      select: {
        id: true,
        name: true,
        slug: true,
        style: true,
        fontFileUrl: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);
  return {
    totalFonts,
    totalDownloads: totalDownloads._sum.downloadCount || 0,
    featuredFonts,
    topFonts,
    allFonts,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  const categories = [
    { label: "All Fonts", active: true },
    { label: "Sans-Serif" },
    { label: "Serif" },
    { label: "Display" },
    { label: "Handwritten" },
    { label: "Monospace" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero Banner Container */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#121422] via-[#0f111a] to-[#090a0f] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Glow orb in background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00e599]/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Heading & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#00e599] font-medium">
              <span>✨</span>
              <span>Next Generation Typography</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              বাংলা ফন্ট <br />
              <span className="bg-gradient-to-r from-[#00e599] via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                টাইপোগ্রাফির নতুন দিগন্ত
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              প্রিমিয়াম বাংলা ফন্টের বিশাল সংগ্রহ। ডিজাইন, ব্র্যান্ডিং, প্রকাশনা এবং ব্যক্তিগত ব্যবহারের জন্য সেরা টাইপোগ্রাফি সমাধান।
            </p>

            {/* Hero Search Box */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search fonts, foundry or styles..."
                className="w-full bg-[#171a26] text-sm text-white placeholder-gray-500 pl-10 pr-28 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-[#00e599]/60 transition-all shadow-inner"
              />
              <span className="absolute left-3.5 top-4 text-gray-400 text-sm">🔍</span>
              <Link
                href="/free-fonts"
                className="absolute right-2 top-2 px-4 py-2 bg-[#00e599] text-gray-950 font-bold text-xs rounded-xl hover:bg-[#00c784] transition-colors flex items-center gap-1.5"
              >
                <span>Browse All</span>
                <span>➔</span>
              </Link>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {categories.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    c.active
                      ? "bg-[#00e599] text-gray-950 border-[#00e599] font-semibold"
                      : "bg-[#161824] text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: 3D Artwork Visual */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-teal-900/30 border border-white/10 p-8 flex items-center justify-center shadow-2xl backdrop-blur-md">
              {/* Center 3D styled lettermark */}
              <div className="relative text-[160px] font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#00e599] via-emerald-300 to-indigo-400 drop-shadow-[0_10px_35px_rgba(0,229,153,0.3)] select-none">
                অ
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Footer Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-8 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-[#00e599]/10 text-[#00e599] flex items-center justify-center text-base">
              💎
            </div>
            <div>
              <div className="text-xs font-bold text-white">Premium Quality</div>
              <div className="text-[10px] text-gray-400">Handcrafted by expert type designers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-base">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-white">OpenType Features</div>
              <div className="text-[10px] text-gray-400">Ligatures, stylistic sets, and more</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-base">
              💻
            </div>
            <div>
              <div className="text-xs font-bold text-white">Multi-Platform</div>
              <div className="text-[10px] text-gray-400">Works on all devices and platforms</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-base">
              🛡️
            </div>
            <div>
              <div className="text-xs font-bold text-white">Secure & Licensed</div>
              <div className="text-[10px] text-gray-400">100% secure and licensed fonts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Fonts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Popular Fonts</h2>
            <span className="w-2 h-2 rounded-full bg-[#00e599]" />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/free-fonts"
              className="text-xs text-[#00e599] hover:underline font-medium"
            >
              View All Fonts &rarr;
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {data.topFonts.map((font) => (
            <DarkFontCard key={font.id} font={font} />
          ))}
        </div>
      </section>

      {/* Type Tester Component */}
      <section className="pt-4">
        <HomeTypeTester fonts={data.allFonts} />
      </section>
    </div>
  );
}
