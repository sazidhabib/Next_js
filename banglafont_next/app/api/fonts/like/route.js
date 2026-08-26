import { NextResponse } from "next/server";
import { Font } from "../../../../models/index.js";

export async function POST(request) {
  try {
    const { fontId, action } = await request.json();
    if (!fontId) {
      return NextResponse.json({ error: "fontId is required" }, { status: 400 });
    }

    const font = await Font.findByPk(fontId);
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
    const newLikeCount = Math.max(0, (font.likeCount || 0) + incrementValue);

    await font.update({ likeCount: newLikeCount });

    return NextResponse.json({ success: true, likeCount: newLikeCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
