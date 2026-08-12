import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(request) {
  try {
    const { fontId, action } = await request.json();
    if (!fontId) {
      return NextResponse.json({ error: "fontId is required" }, { status: 400 });
    }

    const font = await prisma.font.findUnique({ where: { id: fontId } });
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }

    let incrementValue = 0;
    if (action === "like") {
      incrementValue = 1;
    } else if (action === "unlike") {
      incrementValue = -1;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Clamp likeCount to 0 minimum
    const newLikeCount = Math.max(0, font.likeCount + incrementValue);

    await prisma.font.update({
      where: { id: fontId },
      data: { likeCount: newLikeCount },
    });

    return NextResponse.json({ success: true, likeCount: newLikeCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
