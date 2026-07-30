import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function DevelopersPage() {
  const developers = await prisma.developer.findMany({
    include: { _count: { select: { fonts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">আমাদের ডেভেলপারগণ</h1>
      <p className="text-gray-500 mb-8">আমাদের সকল ফন্ট ডেভেলপারদের তালিকা।</p>

      {developers.length === 0 ? (
        <p className="text-gray-500 text-center py-12">কোনো ডেভেলপার পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {developers.map((dev) => (
            <Link
              key={dev.id}
              href={`/developer/${dev.slug}`}
              className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-300 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {dev.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900">{dev.name}</h3>
              {dev.bio && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dev.bio}</p>}
              <p className="text-xs text-green-600 mt-3">{dev._count.fonts}টি ফন্ট</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
