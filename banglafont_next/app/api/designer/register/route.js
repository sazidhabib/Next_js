import { NextResponse } from "next/server";
import { Designer } from "../../../../models/index.js";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    // Check if designer already exists
    const existing = await Designer.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "ইমেইলটি ইতিমধ্যে নিবন্ধিত রয়েছে।" }, { status: 400 });
    }

    // Create unique slug
    let baseSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
    
    if (!baseSlug) baseSlug = "designer";

    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const match = await Designer.findOne({ where: { slug } });
      if (!match) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const designer = await Designer.create({
      name,
      email,
      password: hashedPassword,
      slug,
    });

    return NextResponse.json({
      success: true,
      designer: { id: designer.id, name: designer.name, email: designer.email, slug: designer.slug },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
