import Link from "next/link";
import { prisma } from "../../lib/prisma";
import DarkFontCard from "../../components/DarkFontCard";

export const metadata = {
  title: "প্রিমিয়াম বাংলা ফন্ট সংগ্রহ — NextType",
  description: "আপনার প্রজেক্টকে অন্য স্তরে নিয়ে যেতে সেরা ডিজাইন ও কোয়ালিটির প্রিমিয়াম বাংলা ফন্ট সংগ্রহ।",
  alternates: {
    canonical: "/premium-font",
  },
};

export default async function PremiumFontPage() {
  const fonts = await prisma.font.findMany({
    where: { published: true, fontType: "PREMIUM" },
    include: { designer: true },
    orderBy: { downloadCount: "desc" },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="pb-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Pro Fonts</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              💎 Premium
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">আমাদের প্রিমিয়াম বাংলা ফন্ট কালেকশন দেখুন এবং কিনুন।</p>
        </div>
      </div>

      {fonts.length === 0 ? (
        <div className="text-center py-20 bg-[#121420] rounded-2xl border border-white/10">
          <p className="text-gray-400 mb-4 text-sm">কোনো প্রিমিয়াম ফন্ট পাওয়া যায়নি।</p>
          <Link href="/free-fonts" className="text-[#00e599] hover:underline text-xs">
            ফ্রি ফন্ট ব্রাউজ করুন &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fonts.map((font) => (
            <DarkFontCard key={font.id} font={font} />
          ))}
        </div>
      )}
    </div>
  );
}
