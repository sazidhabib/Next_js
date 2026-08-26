import { NextResponse } from "next/server";
import { Font, Designer, Developer } from "../../../../models/index.js";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const font = await Font.findOne({
    where: { slug: resolvedParams.slug },
    include: [
      { model: Designer, as: "designer" },
      { model: Developer, as: "developer" },
    ],
  });

  if (!font) {
    return NextResponse.json({ error: "Font not found" }, { status: 404 });
  }

  const plainFont = font.toJSON();
  let encoding = [];
  try {
    encoding = typeof plainFont.encoding === "string" ? JSON.parse(plainFont.encoding || "[]") : (plainFont.encoding || []);
  } catch (e) {
    encoding = [];
  }

  return NextResponse.json({
    ...plainFont,
    encoding,
  });
}
