import { Font } from "../../models/index.js";
import TypeTesterPage from "../../components/TypeTesterPage";

export const metadata = {
  title: "টাইপ টেস্টার — NextType",
  description:
    "আপনার পছন্দের বাংলা ফন্ট নির্বাচন করুন এবং রিয়েল-টাইমে টাইপোগ্রাফি টেস্ট করুন। ফন্ট সাইজ, স্পেসিং, কালার এবং আরও অনেক কিছু কাস্টমাইজ করুন।",
  alternates: {
    canonical: "/type-tester",
  },
};

export const dynamic = "force-dynamic";

async function getTypeTesterData() {
  try {
    const [fonts, totalFonts] = await Promise.all([
      Font.findAll({
        where: { published: true },
        attributes: [
          "id",
          "name",
          "banglaName",
          "slug",
          "style",
          "fontFileUrl",
          "previewImageUrl",
        ],
        order: [["name", "ASC"]],
      }),
      Font.count({ where: { published: true } }),
    ]);

    return { fonts: fonts.map((f) => f.toJSON()), totalFonts: totalFonts || 0 };
  } catch (error) {
    console.error("TypeTester DB Error:", error.message);
    return { fonts: [], totalFonts: 0 };
  }
}

export default async function TypeTesterRoute() {
  const { fonts, totalFonts } = await getTypeTesterData();

  return <TypeTesterPage fonts={fonts} totalFonts={totalFonts} />;
}
