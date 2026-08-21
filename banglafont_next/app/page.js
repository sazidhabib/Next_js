import Link from "next/link";
import { prisma } from "../lib/prisma";
import DarkFontCard from "../components/DarkFontCard";
import HomeTypeTester from "../components/HomeTypeTester";
import HomeUnicodeConverter from "../components/HomeUnicodeConverter";
import Hero from "../components/Hero";
import DownloadMarquee from "../components/DownloadMarquee";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [totalFonts, totalDownloads, featuredFonts, topFonts, allFonts, newFonts] = await Promise.all([
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
        banglaName: true,
        slug: true,
        style: true,
        fontFileUrl: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.font.findMany({
      where: { published: true },
      include: { designer: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  return {
    totalFonts,
    totalDownloads: totalDownloads._sum.downloadCount || 0,
    featuredFonts,
    topFonts,
    allFonts,
    newFonts,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Hero Banner Slider Component */}
      <Hero />

      {/* Highest Downloads Marquee */}
      <DownloadMarquee fonts={data.topFonts} />

      {/* Type Tester Component */}
      <section className="pt-4">
        <HomeTypeTester fonts={data.allFonts} />
      </section>

      {/* Featured Fonts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Featured Fonts</h2>
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
          {data.featuredFonts.map((font) => (
            <DarkFontCard key={font.id} font={font} />
          ))}
        </div>
      </section>

      {/* New Fonts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-foreground tracking-tight">New Fonts</h2>
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
          {data.newFonts.map((font) => (
            <DarkFontCard key={font.id} font={font} />
          ))}
        </div>
      </section>

      {/* Unicode to ANSI Converter Section */}
      <section className="pt-4">
        <HomeUnicodeConverter />
      </section>

    </div>
  );
}

