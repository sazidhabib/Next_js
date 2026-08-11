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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#00e599] to-teal-500 flex items-center justify-center text-gray-950 text-2xl sm:text-3xl font-bold shrink-0 shadow-lg shadow-[#00e599]/20">
          {designer.name.charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {designer.name} {designer.banglaName && <span className="text-sm sm:text-lg font-medium text-gray-400 sm:ml-2 block sm:inline">({designer.banglaName})</span>}
          </h1>
          {designer.bio && <p className="text-xs sm:text-sm text-gray-400 mt-1">{designer.bio}</p>}
          <p className="text-xs text-[#00e599] font-medium mt-1">{designer.fonts.length}টি ফন্ট</p>
        </div>
      </div>

      {designer.fonts.length === 0 ? (
        <p className="text-gray-500 text-center py-12 text-sm">এই ডিজাইনারের কোনো ফন্ট নেই।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {designer.fonts.map((font) => (
            <FontCard key={font.id} font={font} />
          ))}
        </div>
      )}

      <div className="mt-8 sm:mt-10">
        <Link href="/designer" className="text-[#00e599] hover:underline text-xs sm:text-sm">&larr; সকল ডিজাইনার</Link>
      </div>
    </div>
  );
}
