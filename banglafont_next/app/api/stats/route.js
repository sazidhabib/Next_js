import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const [totalFonts, totalDownloads, topFonts] = await Promise.all([
    prisma.font.count({ where: { published: true } }),
    prisma.font.aggregate({ _sum: { downloadCount: true } }),
    prisma.font.findMany({
      where: { published: true },
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { name: true, slug: true, downloadCount: true },
    }),
  ]);

  return NextResponse.json({
    totalFonts,
    totalDownloads: totalDownloads._sum.downloadCount || 0,
    topFonts,
  });
}
