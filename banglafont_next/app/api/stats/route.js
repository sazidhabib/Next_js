import { NextResponse } from "next/server";
import { Font } from "../../../models/index.js";

export async function GET() {
  const [totalFonts, totalDownloads, topFonts] = await Promise.all([
    Font.count({ where: { published: true } }),
    Font.sum("downloadCount", { where: { published: true } }),
    Font.findAll({
      where: { published: true },
      order: [["downloadCount", "DESC"]],
      limit: 5,
      attributes: ["name", "slug", "downloadCount"],
    }),
  ]);

  return NextResponse.json({
    totalFonts,
    totalDownloads: totalDownloads || 0,
    topFonts,
  });
}
