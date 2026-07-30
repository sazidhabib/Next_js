import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request, { params }) {
  const designer = await prisma.designer.findUnique({
    where: { slug: params.slug },
    include: {
      fonts: { include: { designer: true }, orderBy: { downloadCount: "desc" } },
    },
  });

  if (!designer) {
    return NextResponse.json({ error: "Designer not found" }, { status: 404 });
  }

  return NextResponse.json(designer);
}
