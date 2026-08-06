import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import FontCard from "../../../components/FontCard";

export const dynamic = "force-dynamic";

export default async function DesignerDetailPage({ params }) {
  const resolvedParams = await params;
  const designer = await prisma.designer.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      fonts: {
        where: { published: true },
        include: { designer: true },
        orderBy: { downloadCount: "desc" },
      },
    },
  });

  if (!designer) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-300 flex items-center justify-center text-white text-3xl font-bold shrink-0">
          {designer.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {designer.name} {designer.banglaName && <span className="text-lg font-medium text-gray-500 ml-2">({designer.banglaName})</span>}
          </h1>
          {designer.bio && <p className="text-gray-500 mt-1">{designer.bio}</p>}
          <p className="text-sm text-gray-400 mt-1">{designer.fonts.length}টি ফন্ট</p>
        </div>
      </div>

      {designer.fonts.length === 0 ? (
        <p className="text-gray-500 text-center py-12">এই ডিজাইনারের কোনো ফন্ট নেই।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designer.fonts.map((font) => (
            <FontCard key={font.id} font={font} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href="/designer" className="text-primary hover:underline text-sm">&larr; সকল ডিজাইনার</Link>
      </div>
    </div>
  );
}
