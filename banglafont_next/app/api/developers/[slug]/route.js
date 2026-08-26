import { NextResponse } from "next/server";
import { Developer, Font, Designer } from "../../../../models/index.js";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const developer = await Developer.findOne({
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

  if (!developer) {
    return NextResponse.json({ error: "Developer not found" }, { status: 404 });
  }

  return NextResponse.json(developer);
}
