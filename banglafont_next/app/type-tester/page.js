import { prisma } from "../../lib/prisma";
import TypeTesterPage from "../../components/TypeTesterPage";

export const metadata = {
  title: "টাইপ টেস্টার — BanglaType",
  description:
    "আপনার পছন্দের বাংলা ফন্ট নির্বাচন করুন এবং রিয়েল-টাইমে টাইপোগ্রাফি টেস্ট করুন। ফন্ট সাইজ, স্পেসিং, কালার এবং আরও অনেক কিছু কাস্টমাইজ করুন।",
};

export const dynamic = "force-dynamic";

async function getTypeTesterData() {
  const [fonts, totalFonts] = await Promise.all([
    prisma.font.findMany({
      where: { published: true },
      select: {
        id: true,
        name: true,
        banglaName: true,
        slug: true,
        style: true,
        fontFileUrl: true,
        previewImageUrl: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.font.count({ where: { published: true } }),
  ]);

  return { fonts, totalFonts };
}

export default async function TypeTesterRoute() {
  const { fonts, totalFonts } = await getTypeTesterData();

  return <TypeTesterPage fonts={fonts} totalFonts={totalFonts} />;
}
