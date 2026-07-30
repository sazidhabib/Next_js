import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  const where = { published: true };
  if (style && style !== "ALL") where.style = style;
  if (type && type !== "ALL") where.fontType = type;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [fonts, total] = await Promise.all([
    prisma.font.findMany({
      where,
      include: { designer: true, developer: true },
      orderBy: { downloadCount: "desc" },
      skip,
      take: limit,
    }),
    prisma.font.count({ where }),
  ]);

  return NextResponse.json({
    fonts: fonts.map(formatFont),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

function formatFont(font) {
  return {
    ...font,
    encoding: JSON.parse(font.encoding || "[]"),
  };
}
