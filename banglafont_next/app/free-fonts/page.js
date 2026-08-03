import Link from "next/link";
import { prisma } from "../../lib/prisma";
import DarkFontCard from "../../components/DarkFontCard";

const CATEGORIES = [
  { name: "All Fonts", count: 2438, active: true },
  { name: "Sans-Serif", count: 856 },
  { name: "Serif", count: 632 },
  { name: "Display", count: 482 },
  { name: "Handwritten", count: 286 },
  { name: "Monospace", count: 182 },
  { name: "Calligraphic", count: 134 },
  { name: "Blackletter", count: 96 },
];

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
  const page = parseInt(params?.page || "1", 10);
  const limit = 12;
  const skip = (page - 1) * limit;

  const where = { published: true, fontType: "FREE" };
  if (style !== "ALL") {
    where.style = style;
  }

  const [fonts, total] = await Promise.all([
    prisma.font.findMany({
      where,
      include: { designer: true },
      orderBy: { downloadCount: "desc" },
      skip,
      take: limit,
    }),
    prisma.font.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>Browse All Fonts</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#161824] text-[#00e599] border border-white/10 font-normal">
              {total.toLocaleString()} fonts
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Explore and download our handcrafted collection of Bangla typefaces.
          </p>
        </div>

        {/* Filter Badges Top Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {STYLES.map((s) => (
            <Link
              key={s.value}
              href={s.value === "ALL" ? "/free-fonts" : `?style=${s.value}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 border transition-all ${
                style === s.value
                  ? "bg-[#00e599] text-gray-950 border-[#00e599] font-semibold"
                  : "bg-[#141622] text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar matching Screenshot 3 */}
        <div className="lg:col-span-3 bg-[#11131a] border border-white/10 rounded-2xl p-5 space-y-6 hidden lg:block">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.name}>
                  <button
                    type="button"
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      cat.active
                        ? "bg-[#00e599]/10 text-[#00e599] font-bold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-500">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/5 pt-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Price</h3>
            <div className="space-y-2 text-xs text-gray-400">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#00e599] rounded" /> Free
                </span>
                <span className="text-[10px] text-gray-500">1,243</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#00e599] rounded" /> Pro
                </span>
                <span className="text-[10px] text-gray-500">1,195</span>
              </label>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <button
              type="button"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs rounded-xl hover:opacity-90 transition-opacity"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Right Fonts Grid */}
        <div className="lg:col-span-9 space-y-8">
          {fonts.length === 0 ? (
            <div className="text-center py-20 bg-[#12141f] rounded-2xl border border-white/10">
              <p className="text-gray-400 text-sm">কোনো ফন্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {fonts.map((font) => (
                  <DarkFontCard key={font.id} font={font} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-6">
                  {page > 1 && (
                    <a
                      href={`?style=${style}&page=${page - 1}`}
                      className="px-4 py-2 border border-white/10 rounded-xl text-xs text-gray-300 hover:bg-white/10"
                    >
                      &larr; Prev
                    </a>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p) => (
                      <a
                        key={p}
                        href={`?style=${style}&page=${p}`}
                        className={`px-4 py-2 border rounded-xl text-xs font-semibold ${
                          p === page
                            ? "bg-[#00e599] text-gray-950 border-[#00e599]"
                            : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  {page < totalPages && (
                    <a
                      href={`?style=${style}&page=${page + 1}`}
                      className="px-4 py-2 border border-white/10 rounded-xl text-xs text-gray-300 hover:bg-white/10"
                    >
                      Next &rarr;
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
