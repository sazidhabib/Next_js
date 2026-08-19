import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import DarkFontDetailPage from "../../../components/DarkFontDetailPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const font = await prisma.font.findUnique({
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
  const font = await prisma.font.findUnique({
    where: { slug, published: true },
    include: { designer: true, developer: true, variants: true },
  });

  if (!font) notFound();

  const relatedFonts = await prisma.font.findMany({
    where: {
      style: font.style,
      id: { not: font.id },
      published: true,
    },
    include: { designer: true },
    take: 5,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": font.banglaName ? `${font.name} (${font.banglaName})` : font.name,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Windows, macOS, Android, iOS, Linux",
    "description": font.detailsDescription || font.description || "",
    "offers": {
      "@type": "Offer",
      "price": font.price ? font.price.toString() : "0",
      "priceCurrency": "BDT",
      "availability": "https://schema.org/InStock",
    },
    "author": {
      "@type": "Person",
      "name": font.designer?.name || "NextType",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DarkFontDetailPage font={font} relatedFonts={relatedFonts} />
    </>
  );
}


