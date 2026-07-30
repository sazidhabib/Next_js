import Link from "next/link";
import { prisma } from "../../lib/prisma";
import FontCard from "../../components/FontCard";

export default async function PremiumFontPage() {
  const fonts = await prisma.font.findMany({
    where: { published: true, fontType: "PREMIUM" },
    include: { designer: true },
    orderBy: { downloadCount: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">প্রিমিয়াম বাংলা ফন্টস</h1>
      <p className="text-gray-500 mb-8">আমাদের প্রিমিয়াম বাংলা ফন্ট কালেকশন দেখুন এবং কিনুন।</p>

      {fonts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">কোনো প্রিমিয়াম ফন্ট পাওয়া যায়নি।</p>
          <Link href="/free-fonts" className="text-primary hover:underline">ফ্রি ফন্ট ব্রাউজ করুন</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fonts.map((font) => (
            <FontCard key={font.id} font={font} />
          ))}
        </div>
      )}
    </div>
  );
}
