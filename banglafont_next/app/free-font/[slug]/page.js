import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import DarkFontDetailPage from "../../../components/DarkFontDetailPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const font = await prisma.font.findUnique({
    where: { slug },
  });
  return {
    title: `${font.name} - NextType Font Download`,
    description: font.description?.substring(0, 160) || "",
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

  return <DarkFontDetailPage font={font} relatedFonts={relatedFonts} />;
}


