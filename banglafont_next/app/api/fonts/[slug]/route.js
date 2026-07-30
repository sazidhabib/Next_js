import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request, { params }) {
  const font = await prisma.font.findUnique({
    where: { slug: params.slug },
    include: { designer: true, developer: true },
  });

  if (!font) {
    return NextResponse.json({ error: "Font not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...font,
    encoding: JSON.parse(font.encoding || "[]"),
  });
}
