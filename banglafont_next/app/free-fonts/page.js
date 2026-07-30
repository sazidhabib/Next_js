import { prisma } from "../../lib/prisma";
import FontCard from "../../components/FontCard";

const STYLES = [
  { value: "ALL", label: "সকল" },
  { value: "HANDWRITING", label: "Handwriting" },
  { value: "HEADING", label: "Heading" },
  { value: "PARAGRAPH", label: "Paragraph" },
  { value: "STYLISH", label: "Stylish" },
  { value: "GENERAL", label: "সাধারণ" },
];

export default async function FreeFontsPage({ searchParams }) {
  const style = searchParams?.style || "ALL";
  const page = parseInt(searchParams?.page || "1", 10);
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ফ্রি বাংলা ফন্টস</h1>
      <p className="text-gray-500 mb-8">আমাদের সকল ফ্রি বাংলা ফন্ট ব্রাউজ করুন।</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {STYLES.map((s) => (
          <a
            key={s.value}
            href={s.value === "ALL" ? "/free-fonts" : `?style=${s.value}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              style === s.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>

      {fonts.length === 0 ? (
        <p className="text-gray-500 text-center py-12">কোনো ফন্ট পাওয়া যায়নি।</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fonts.map((font) => (
              <FontCard key={font.id} font={font} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {page > 1 && (
                <a
                  href={`?style=${style}&page=${page - 1}`}
                  className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-gray-50"
                >
                  পূর্ববর্তী
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <a
                      href={`?style=${style}&page=${p}`}
                      className={`px-4 py-2 border border-border rounded-lg text-sm ${
                        p === page
                          ? "bg-primary text-white border-primary"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </a>
                  </span>
                ))}
              {page < totalPages && (
                <a
                  href={`?style=${style}&page=${page + 1}`}
                  className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-gray-50"
                >
                  পরবর্তী
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
