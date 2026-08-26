import { NextResponse } from "next/server";
import { Designer, Font } from "../../../../models/index.js";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const designer = await Designer.findOne({
    where: { slug: resolvedParams.slug },
    include: [
      {
        model: Font,
        as: "fonts",
        include: [{ model: Designer, as: "designer" }],
      },
    ],
    order: [[{ model: Font, as: "fonts" }, "downloadCount", "DESC"]],
  });

  if (!designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  return NextResponse.json(designer);
}
