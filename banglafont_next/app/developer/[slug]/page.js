import Link from "next/link";
import { notFound } from "next/navigation";
import { Developer, Font, Designer } from "../../../models/index.js";
import FontCard from "../../../components/FontCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const developer = await Developer.findOne({
    where: { slug },
  });
  if (!developer) return {};
  return {
    title: `${developer.name} — NextType Developer Profile`,
    description: developer.bio?.substring(0, 160) || `${developer.name}-এর ডেভেলপ করা বাংলা ফন্টগুলোর চমৎকার সংগ্রহ।`,
    alternates: {
      canonical: `/developer/${slug}`,
    },
  };
}

export default async function DeveloperDetailPage({ params }) {
  const resolvedParams = await params;
  const developer = await Developer.findOne({
    where: { slug: resolvedParams.slug },
    include: [
      {
        model: Font,
        as: "fonts",
        where: { published: true },
        required: false,
        include: [{ model: Designer, as: "designer" }],
      },
    ],
    order: [[{ model: Font, as: "fonts" }, "downloadCount", "DESC"]],
  });

  if (!developer) notFound();

  const plainDeveloper = developer.toJSON();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-300 flex items-center justify-center text-white text-3xl font-bold shrink-0">
          {plainDeveloper.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {plainDeveloper.name} {plainDeveloper.banglaName && <span className="text-lg font-medium text-gray-500 ml-2">({plainDeveloper.banglaName})</span>}
          </h1>
          {plainDeveloper.bio && <p className="text-gray-500 mt-1">{plainDeveloper.bio}</p>}
          <p className="text-sm text-gray-400 mt-1">{(plainDeveloper.fonts || []).length}টি ফন্ট</p>
        </div>
      </div>

      {!plainDeveloper.fonts || plainDeveloper.fonts.length === 0 ? (
        <p className="text-gray-500 text-center py-12">এই ডেভেলপারের কোনো ফন্ট নেই।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plainDeveloper.fonts.map((font) => (
            <FontCard key={font.id} font={font} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href="/developer" className="text-primary hover:underline text-sm">&larr; সকল ডেভেলপার</Link>
      </div>
    </div>
  );
}
