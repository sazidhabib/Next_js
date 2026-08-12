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

    const designer = await prisma.designer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        banglaName: true,
        slug: true,
        email: true,
        photo: true,
        bio: true,
        socialLinks: true,
      },
    });

    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, designer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const decoded = getDesignerFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, banglaName, bio, photo, socialLinks } = await request.json();

    const updated = await prisma.designer.update({
      where: { id: decoded.id },
      data: {
        name,
        banglaName,
        bio,
        photo,
        socialLinks,
      },
      select: {
        id: true,
        name: true,
        banglaName: true,
        slug: true,
        email: true,
        photo: true,
        bio: true,
        socialLinks: true,
      },
    });

    return NextResponse.json({ success: true, designer: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
