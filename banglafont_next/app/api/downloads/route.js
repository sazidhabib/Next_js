import { NextResponse } from "next/server";
import { Font, Download } from "../../../models/index.js";
import { createHash } from "crypto";

export async function POST(request) {
  try {
    const { fontId } = await request.json();
    if (!fontId) {
      return NextResponse.json({ error: "fontId is required" }, { status: 400 });
    }

    const font = await Font.findByPk(fontId);
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16);

    await Promise.all([
      Download.create({
        fontId,
        ipHash,
        userAgent: request.headers.get("user-agent") || "",
      }),
      font.increment("downloadCount", { by: 1 }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
