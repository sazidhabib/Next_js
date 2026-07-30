import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(request, { params }) {
  const developer = await prisma.developer.findUnique({
    where: { slug: params.slug },
    include: {
      fonts: { include: { designer: true }, orderBy: { downloadCount: "desc" } },
    },
  });

  if (!developer) {
    return NextResponse.json({ error: "Developer not found" }, { status: 404 });
  }

  return NextResponse.json(developer);
}
