import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { authMiddleware } from "@/app/lib/middleware";

export async function GET(req) {
  try {
    const auth = await authMiddleware(req);
    if (!auth.success) return auth;

    const services = await query("SELECT * FROM services ORDER BY created_at DESC");
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("Fetch services error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await authMiddleware(req, "admin");
    if (!auth.success) return auth;

    const body = await req.json();
    const { 
      title, slug, tagline, hero_image, hero_icon, 
      about_title, about_description, about_image,
      features_title, features_items, 
      process_title, process_steps,
      related_services,
      meta_title, meta_description, is_active 
    } = body;

    const result = await query(
      `INSERT INTO services (
        title, slug, tagline, hero_image, hero_icon, 
        about_title, about_description, about_image,
        features_title, features_items, 
        process_title, process_steps,
        related_services,
        meta_title, meta_description, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, tagline, hero_image, hero_icon, 
        about_title, about_description, about_image,
        features_title, JSON.stringify(features_items), 
        process_title, JSON.stringify(process_steps),
        JSON.stringify(related_services),
        meta_title, meta_description, is_active ? 1 : 0
      ]
    );

    return NextResponse.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
