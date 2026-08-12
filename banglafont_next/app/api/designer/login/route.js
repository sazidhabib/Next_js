import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const designer = await prisma.designer.findFirst({ where: { email } });
    if (!designer || !designer.password) {
      return NextResponse.json({ error: "ভুল ইমেইল বা পাসওয়ার্ড।" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, designer.password);
    if (!valid) {
      return NextResponse.json({ error: "ভুল ইমেইল বা পাসওয়ার্ড।" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: designer.id, name: designer.name, email: designer.email, slug: designer.slug },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    const response = NextResponse.json({
      success: true,
      designer: { id: designer.id, name: designer.name, email: designer.email, slug: designer.slug },
    });

    response.cookies.set("designer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
