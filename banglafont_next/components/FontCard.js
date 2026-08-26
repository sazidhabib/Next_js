import Link from "next/link";

const styleLabels = {
  HANDWRITING: "Handwriting",
  HEADING: "Heading",
  PARAGRAPH: "Paragraph",
  STYLISH: "Stylish",
  GENERAL: "সাধারণ",
};

const styleColors = {
  HANDWRITING: "bg-pink-100 text-pink-700",
  HEADING: "bg-purple-100 text-purple-700",
  PARAGRAPH: "bg-green-100 text-green-700",
  STYLISH: "bg-amber-100 text-amber-700",
  GENERAL: "bg-gray-100 text-gray-700",
};

export default function FontCard({ font }) {
  let encodings = [];
  try {
    encodings = typeof font.encoding === "string" ? JSON.parse(font.encoding || "[]") : (font.encoding || []);
  } catch (e) {
    encodings = [];
  }
  const styleLabel = styleLabels[font.style] || font.style;
  const styleColor = styleColors[font.style] || styleColors.GENERAL;

  return (
    <Link
      href={`/free-font/${font.slug}`}
      className="block bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{font.name}</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styleColor}`}>
            {styleLabel}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{font.designer?.name}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {encodings.map((enc) => (
            <span
              key={enc}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
            >
              {enc}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1">
            {font.downloadCount.toLocaleString("bn-BD")} ডাউনলোড
          </span>
        </div>
      </div>
    </Link>
  );
}
