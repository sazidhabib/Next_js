import Link from "next/link";
import { prisma } from "../../lib/prisma";

export default async function DesignersPage() {
  const designers = await prisma.designer.findMany({
    include: { _count: { select: { fonts: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">আমাদের ডিজাইনারগণ</h1>
      <p className="text-gray-500 mb-8">আমাদের সকল টাইপোগ্রাফি ডিজাইনারদের তালিকা।</p>

      {designers.length === 0 ? (
        <p className="text-gray-500 text-center py-12">কোনো ডিজাইনার পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {designers.map((designer) => (
            <Link
              key={designer.id}
              href={`/designer/${designer.slug}`}
              className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-300 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {designer.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900">{designer.name}</h3>
              {designer.bio && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{designer.bio}</p>
              )}
              <p className="text-xs text-primary mt-3">{designer._count.fonts}টি ফন্ট</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
