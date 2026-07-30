import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({
      user: { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
