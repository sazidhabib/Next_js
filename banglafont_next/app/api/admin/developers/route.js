import { NextResponse } from "next/server";
import { Developer } from "../../../../models/index.js";

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    // Check if slug is already in use
    const existing = await Developer.findOne({
      where: { slug: body.slug }
    });
    if (existing) {
      return NextResponse.json(
        { error: "এই স্লাগটি ইতিমধ্যে ব্যবহার করা হয়েছে, অনুগ্রহ করে অন্য একটি স্লাগ ব্যবহার করুন।" },
        { status: 400 }
      );
    }

    const developer = await Developer.create(body);
    return NextResponse.json({ developer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
