import Link from "next/link";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    include: { _count: { select: { fonts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Developers</h1>
        <p className="text-xs text-gray-400 mt-1">আমাদের সকল ফন্ট ডেভেলপারদের তালিকা।</p>
      </div>

      {developers.length === 0 ? (
        <p className="text-gray-400 text-center py-12">কোনো ডেভেলপার পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {developers.map((dev) => (
            <Link
              key={dev.id}
              href={`/developer/${dev.slug}`}
              className="bg-[#121420] border border-white/10 hover:border-purple-500/50 rounded-2xl p-6 text-center hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] transition-all group"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 group-hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
                {dev.name.charAt(0)}
              </div>
              <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{dev.name}</h3>
              {dev.bio && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{dev.bio}</p>}
              <p className="text-xs text-purple-400 font-medium mt-3">{dev._count.fonts}টি ফন্ট</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
