import { notFound } from "next/navigation";
import { Font, Designer, Developer, FontVariant, Op } from "../../../models/index.js";
import DarkFontDetailPage from "../../../components/DarkFontDetailPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const font = await Font.findOne({
    where: { slug },
  });

  if (!font) {
    return {
      title: "ফন্ট ডাউনলোড | NextType",
    };
  }

  const title = font.banglaName
    ? `${font.name} (${font.banglaName}) ফন্ট ফ্রি ডাউনলোড | NextType`
    : `${font.name} ফন্ট ফ্রি ডাউনলোড | NextType`;

  const description = `ডাউনলোড করুন ${font.name} বাংলা ফন্ট সম্পূর্ণ বিনামূল্যে। ইউনিকোড ও এএনএসআই সাপোর্ট সহ গ্রাফিক্স ডিজাইন ও টাইপোগ্রাফির জন্য সেরা ফন্ট।`;

  return {
    title,
    description,
    alternates: {
      canonical: `/free-font/${slug}`,
    },
  };
}

export default async function FontDetailPage({ params }) {
  const { slug } = await params;
  const font = await Font.findOne({
    where: { slug, published: true },
    include: [
      { model: Designer, as: "designer" },
      { model: Developer, as: "developer" },
      { model: FontVariant, as: "variants" },
    ],
  });

  if (!font) notFound();

  const relatedFonts = await Font.findAll({
    where: {
      style: font.style,
      id: { [Op.ne]: font.id },
      published: true,
    },
    include: [{ model: Designer, as: "designer" }],
    limit: 5,
  });

  const plainFont = font.toJSON();
  const plainRelated = relatedFonts.map((f) => f.toJSON());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": plainFont.banglaName ? `${plainFont.name} (${plainFont.banglaName})` : plainFont.name,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Windows, macOS, Android, iOS, Linux",
    "description": plainFont.detailsDescription || plainFont.description || "",
    "offers": {
      "@type": "Offer",
      "price": plainFont.price ? plainFont.price.toString() : "0",
      "priceCurrency": "BDT",
      "availability": "https://schema.org/InStock",
    },
    "author": {
      "@type": "Person",
      "name": plainFont.designer?.name || "NextType",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DarkFontDetailPage font={plainFont} relatedFonts={plainRelated} />
    </>
  );
}


