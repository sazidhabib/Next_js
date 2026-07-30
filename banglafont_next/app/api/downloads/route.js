import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { createHash } from "crypto";

export async function POST(request) {
  try {
    const { fontId } = await request.json();
    if (!fontId) {
      return NextResponse.json({ error: "fontId is required" }, { status: 400 });
    }

    const font = await prisma.font.findUnique({ where: { id: fontId } });
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").substring(0, 16);

    await Promise.all([
      prisma.download.create({
        data: {
          fontId,
          ipHash,
          userAgent: request.headers.get("user-agent") || "",
        },
      }),
      prisma.font.update({
        where: { id: fontId },
        data: { downloadCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
