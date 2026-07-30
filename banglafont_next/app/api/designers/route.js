import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const designers = await prisma.designer.findMany({
    include: { _count: { select: { fonts: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ designers });
}
