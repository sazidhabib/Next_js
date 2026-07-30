import Link from "next/link";
import { prisma } from "../lib/prisma";
import FontCard from "../components/FontCard";

async function getHomeData() {
  const [totalFonts, totalDownloads, featuredFonts, topFonts] = await Promise.all([
    prisma.font.count({ where: { published: true } }),
    prisma.font.aggregate({ _sum: { downloadCount: true } }),
    prisma.font.findMany({
      where: { published: true, featured: true },
      include: { designer: true },
      orderBy: { downloadCount: "desc" },
      take: 12,
    }),
    prisma.font.findMany({
      where: { published: true },
      include: { designer: true },
      orderBy: { downloadCount: "desc" },
      take: 7,
    }),
  ]);
  return { totalFonts, totalDownloads: totalDownloads._sum.downloadCount || 0, featuredFonts, topFonts };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            বিনামূল্যে ডাউনলোড করুন সুন্দর বাংলা ফন্ট। ফ্রি এবং প্রিমিয়াম ফন্টের বিশাল সংগ্রহ।
          </p>
          <div className="flex justify-center gap-12 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{data.totalFonts}+</div>
              <div className="text-sm text-gray-500 mt-1">মোট ফন্ট</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary">
                {formatNumber(data.totalDownloads)}+
              </div>
              <div className="text-sm text-gray-500 mt-1">মোট ডাউনলোড</div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Link
              href="/free-fonts"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              ফ্রি ফন্ট ব্রাউজ করুন
            </Link>
            <Link
              href="/premium-font"
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              প্রিমিয়াম ফন্ট দেখুন
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">সর্বাধিক ডাউনলোডকৃত ফন্টস</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {data.topFonts.slice(0, 7).map((font) => (
              <Link
                key={font.id}
                href={`/free-font/${font.slug}`}
                className="bg-surface border border-border rounded-lg p-3 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-medium text-primary truncate">{font.name}</div>
                <div className="text-[10px] text-text-muted truncate">{font.designer.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">আমাদের ফন্ট সংগ্রহ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.featuredFonts.map((font) => (
              <FontCard key={font.id} font={font} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/free-fonts"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              সকল ফন্ট দেখুন
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">অ্যাপ এ ইউনিকোড সাপোর্ট করছে না?</h2>
          <p className="text-lg mb-8 opacity-90">
            সহজেই কনভার্ট করুন ইউনিকোড টেক্সট আমাদের Unicode to ANSI কনভার্টার দিয়ে
          </p>
          <Link
            href="/unicode-to-ansi-converter"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Unicode to ANSI কনভার্টার
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">আমাদের প্রিমিয়াম সংগ্রহ</h2>
          <p className="text-gray-500 mb-8">প্রিমিয়াম ফন্টগুলোর জন্য আমাদের প্রিমিয়াম পেজ ভিজিট করুন।</p>
          <div className="text-center">
            <Link
              href="/premium-font"
              className="inline-block px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              সকল প্রিমিয়াম ফন্ট দেখুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatNumber(num) {
  return num.toLocaleString("bn-BD");
}
