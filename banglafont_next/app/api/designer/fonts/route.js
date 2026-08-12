import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

function getDesignerFromRequest(request) {
  const token = request.cookies.get("designer_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export async function GET(request) {
  try {
    const decoded = getDesignerFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get designer's fonts
    const fonts = await prisma.font.findMany({
      where: { designerId: decoded.id },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculate aggregate metrics
    const totalDownloads = fonts.reduce((sum, f) => sum + (f.downloadCount || 0), 0);
    const totalLikes = fonts.reduce((sum, f) => sum + (f.likeCount || 0), 0);
    const totalViews = fonts.reduce((sum, f) => sum + (f.viewCount || 0), 0);

    return NextResponse.json({
      success: true,
      fonts,
      stats: {
        totalFonts: fonts.length,
        totalDownloads,
        totalLikes,
        totalViews,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decoded = getDesignerFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      banglaName,
      description,
      detailsDescription,
      price,
      fontFileUrl,
      previewImageUrl,
      style,
      encoding,
      foundry,
      released,
      version,
      formats,
    } = await request.json();

    if (!name || !fontFileUrl) {
      return NextResponse.json({ error: "ফন্টের নাম এবং ডাউনলোড ফাইল আবশ্যক।" }, { status: 400 });
    }

    // Create unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
    if (!baseSlug) baseSlug = "font";

    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const match = await prisma.font.findUnique({ where: { slug } });
      if (!match) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const fontType = price && parseFloat(price) > 0 ? "PREMIUM" : "FREE";

    const font = await prisma.font.create({
      data: {
        name,
        banglaName: banglaName || null,
        slug,
        description: description || null,
        detailsDescription: detailsDescription || null,
        fontType,
        price: price ? parseFloat(price) : null,
        fontFileUrl,
        previewImageUrl: previewImageUrl || null,
        style: style || "GENERAL",
        encoding: encoding || "[]",
        foundry: foundry || null,
        released: released || null,
        version: version || "1.000",
        formats: formats || "OTF, TTF, WOFF2",
        designerId: decoded.id,
      },
    });

    return NextResponse.json({ success: true, font });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
