import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function DesignersPage() {
  const designers = await prisma.designer.findMany({
    include: { _count: { select: { fonts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Foundries & Designers</h1>
        <p className="text-xs text-gray-400 mt-1">আমাদের সকল ফন্ট ফাউন্ড্রি ও টাইপোগ্রাফি ডিজাইনারদের তালিকা।</p>
      </div>

      {designers.length === 0 ? (
        <p className="text-gray-400 text-center py-12">কোনো ডিজাইনার পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {designers.map((designer) => (
            <Link
              key={designer.id}
              href={`/designer/${designer.slug}`}
              className="bg-[#121420] border border-white/10 hover:border-[#00e599]/50 rounded-2xl p-6 text-center hover:shadow-[0_0_25px_rgba(0,229,153,0.15)] transition-all group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00e599] to-teal-500 flex items-center justify-center text-gray-950 text-2xl font-black mx-auto mb-4 group-hover:scale-105 transition-transform shadow-lg shadow-[#00e599]/20">
                {designer.name.charAt(0)}
              </div>
              <h3 className="font-bold text-white group-hover:text-[#00e599] transition-colors">{designer.name}</h3>
              {designer.bio && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{designer.bio}</p>
              )}
              <p className="text-xs text-[#00e599] font-medium mt-3">{designer._count.fonts}টি ফন্ট</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
