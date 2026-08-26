import { NextResponse } from "next/server";
import { Font, Designer, Developer, Op } from "../../../models/index.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style");
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const offset = (page - 1) * limit;

  const where = { published: true };
  if (style && style !== "ALL") where.style = style;
  if (type && type !== "ALL") where.fontType = type;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows: fonts, count: total } = await Font.findAndCountAll({
    where,
    include: [
      { model: Designer, as: "designer" },
      { model: Developer, as: "developer" },
    ],
    order: [["downloadCount", "DESC"]],
    offset,
    limit,
  });

  return NextResponse.json({
    fonts: fonts.map((f) => formatFont(f.toJSON())),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

function formatFont(font) {
  let encoding = [];
  try {
    encoding = typeof font.encoding === "string" ? JSON.parse(font.encoding || "[]") : (font.encoding || []);
  } catch (e) {
    encoding = [];
  }
  return {
    ...font,
    encoding,
  };
}
