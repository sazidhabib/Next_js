import { NextResponse } from "next/server";
import { Designer } from "../../../../models/index.js";
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

    const designer = await Designer.findByPk(decoded.id, {
      attributes: [
        "id",
        "name",
        "banglaName",
        "slug",
        "email",
        "photo",
        "bio",
        "socialLinks",
      ],
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

    const designer = await Designer.findByPk(decoded.id);
    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 });
    }

    await designer.update({
      name,
      banglaName,
      bio,
      photo,
      socialLinks,
    });

    const updated = await Designer.findByPk(decoded.id, {
      attributes: [
        "id",
        "name",
        "banglaName",
        "slug",
        "email",
        "photo",
        "bio",
        "socialLinks",
      ],
    });

    return NextResponse.json({ success: true, designer: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
