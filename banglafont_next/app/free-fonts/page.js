import Link from "next/link";
import { Font, Designer } from "../../models/index.js";
import FontGridWithLoadMore from "../../components/FontGridWithLoadMore";

export const metadata = {
  title: "ফ্রি বাংলা ফন্ট ডাউনলোড — NextType",
  description: "সেরা এবং সম্পূর্ণ ফ্রি বাংলা ফন্টগুলোর বিশাল সংগ্রহ। সহজে ডাউনলোড করুন এবং প্রজেক্টে ব্যবহার করুন।",
  alternates: {
    canonical: "/free-fonts",
  },
};

const STYLES = [
  { value: "ALL", label: "All Fonts" },
  { value: "HANDWRITING", label: "Handwritten" },
  { value: "HEADING", label: "Heading" },
  { value: "PARAGRAPH", label: "Paragraph" },
  { value: "STYLISH", label: "Display" },
  { value: "GENERAL", label: "Sans-Serif" },
];

export default async function FreeFontsPage({ searchParams }) {
  const params = await searchParams;
  const style = params?.style || "ALL";
  const limit = 20;

  const where = { published: true, fontType: "FREE" };
  if (style !== "ALL") {
    where.style = style;
  }

  let fonts = [];
  let total = 0;
  try {
    const { rows: fontRows, count: totalCount } = await Font.findAndCountAll({
      where,
      include: [{ model: Designer, as: "designer" }],
      order: [["downloadCount", "DESC"]],
      limit,
    });
    fonts = fontRows.map((f) => f.toJSON());
    total = totalCount;
  } catch (error) {
    console.error("FreeFonts DB Error:", error.message);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 flex-wrap">
            <span>Browse All Fonts</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface text-[#00e599] border border-border font-normal">
              {total.toLocaleString()} fonts
            </span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Explore and download our handcrafted collection of Bangla typefaces.
          </p>
        </div>

        {/* Filter Badges Top Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {STYLES.map((s) => (
            <Link
              key={s.value}
              href={s.value === "ALL" ? "/free-fonts" : `?style=${s.value}`}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium shrink-0 border transition-all ${
                style === s.value
                  ? "bg-[#00e599] text-gray-955 border-[#00e599] font-bold"
                  : "bg-surface text-text-muted border-border hover:text-foreground hover:bg-surface-card"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right Fonts Grid - Now spans full width */}
        <div className="lg:col-span-12 space-y-8">
          {fonts.length === 0 ? (
            <div className="text-center py-20 bg-surface-card rounded-2xl border border-border">
              <p className="text-text-muted text-sm">কোনো ফন্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            <FontGridWithLoadMore initialFonts={fonts} totalCount={total} currentStyle={style} />
          )}
        </div>
      </div>
    </div>
  );
}
