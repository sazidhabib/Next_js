import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export async function generateMetadata({ params }) {
  const font = await prisma.font.findUnique({
    where: { slug: params.slug },
  });
  if (!font) return {};
  return {
    title: `${font.name} - Free Bangla Font Download | FontBD`,
    description: font.description?.substring(0, 160) || "",
  };
}

const styleLabels = {
  HANDWRITING: "Handwriting",
  HEADING: "Heading",
  PARAGRAPH: "Paragraph",
  STYLISH: "Stylish",
  GENERAL: "সাধারণ",
};

export default async function FontDetailPage({ params }) {
  const font = await prisma.font.findUnique({
    where: { slug: params.slug, published: true },
    include: { designer: true, developer: true },
  });

  if (!font) notFound();

  const encodings = JSON.parse(font.encoding || "[]");

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white border border-border rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{font.name}</h1>
            <p className="text-gray-600 mb-4 max-w-2xl">{font.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span>ডিজাইনার: <Link href={`/designer/${font.designer.slug}`} className="text-primary hover:underline">{font.designer.name}</Link></span>
              {font.developer && (
                <span>ডেভেলপার: <Link href={`/developer/${font.developer.slug}`} className="text-primary hover:underline">{font.developer.name}</Link></span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {encodings.map((enc) => (
                <span key={enc} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{enc}</span>
              ))}
              {font.style && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">{styleLabels[font.style]}</span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              এ পর্যন্ত {font.name} ফন্টটি ডাউনলোড করা হয়েছে <strong className="text-primary">{font.downloadCount.toLocaleString("bn-BD")}+</strong> বার
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href={font.fontFileUrl}
              download
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold text-center hover:bg-primary-dark transition-colors"
            >
              ডাউনলোড করুন
            </a>
            {font.fontType === "PREMIUM" && font.price && (
              <Link
                href={`/checkout?font=${font.slug}`}
                className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold text-center hover:bg-amber-600 transition-colors"
              >
                কিনুন - ৳{font.price}
              </Link>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">টাইপ টেস্টার প্রিভিউ</h2>
          <TypeTester fontName={font.name} />
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">গ্লিফস</h2>
        <GlyphTable />
      </div>

      {font.designer && (
        <div className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ডিজাইনার সম্পর্কে</h2>
          <div className="flex items-center gap-4">
            {font.designer.photo && (
              <img src={font.designer.photo} alt={font.designer.name} className="w-16 h-16 rounded-full object-cover" />
            )}
            <div>
              <Link href={`/designer/${font.designer.slug}`} className="font-semibold text-primary hover:underline">{font.designer.name}</Link>
              {font.designer.bio && <p className="text-sm text-gray-500 mt-1">{font.designer.bio}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TypeTester({ fontName }) {
  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-xs text-gray-500 block mb-1">সাইজ</label>
          <input type="range" min="12" max="120" defaultValue="72" className="w-32" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">লেটার স্পেসিং</label>
          <input type="range" min="0" max="20" defaultValue="0" className="w-32" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">লাইন স্পেসিং</label>
          <input type="range" min="1" max="3" step="0.1" defaultValue="1.5" className="w-32" />
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 border border-border">
        <p className="text-[72px] leading-tight break-all" style={{ fontFamily: "Noto Sans Bengali" }}>
          আমার সোনার বাংলা, আমি তোমায় ভালোবাসি।
        </p>
      </div>
    </div>
  );
}

function GlyphTable() {
  const chars = [
    "অ", "আ", "ই", "ঈ", "উ", "ঊ", "ঋ", "এ", "ঐ", "ও", "ঔ",
    "ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ",
    "ট", "ঠ", "ড", "ঢ", "ণ", "ত", "থ", "দ", "ধ", "ন",
    "প", "ফ", "ব", "ভ", "ম", "য", "র", "ল", "শ", "ষ", "স", "হ",
    "ড়", "ঢ়", "য়", "ৎ", "ং", "ঃ", "ঁ",
    "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯", "০",
  ];

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
      {chars.map((ch) => (
        <div
          key={ch}
          className="aspect-square flex items-center justify-center bg-gray-50 rounded-lg border border-border text-2xl hover:bg-blue-50 hover:border-blue-200 transition-colors"
        >
          {ch}
        </div>
      ))}
    </div>
  );
}
