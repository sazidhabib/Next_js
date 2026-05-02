import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import { authMiddleware } from "@/app/lib/middleware";

export async function GET(req, { params }) {
  try {
    const auth = await authMiddleware(req);
    if (!auth.success) return auth;

    const { id } = params;
    const services = await query("SELECT * FROM services WHERE id = ?", [id]);
    
    if (services.length === 0) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: services[0] });
  } catch (error) {
    console.error("Fetch service error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await authMiddleware(req, "admin");
    if (!auth.success) return auth;

    const { id } = params;
    const body = await req.json();
    const { 
      title, slug, tagline, hero_image, hero_icon, 
      about_title, about_description, about_image,
      features_title, features_items, 
      process_title, process_steps,
      related_services,
      meta_title, meta_description, is_active 
    } = body;

    await query(
      `UPDATE services SET 
        title = ?, slug = ?, tagline = ?, hero_image = ?, hero_icon = ?, 
        about_title = ?, about_description = ?, about_image = ?,
        features_title = ?, features_items = ?, 
        process_title = ?, process_steps = ?,
        related_services = ?,
        meta_title = ?, meta_description = ?, is_active = ?
      WHERE id = ?`,
      [
        title, slug, tagline, hero_image, hero_icon, 
        about_title, about_description, about_image,
        features_title, JSON.stringify(features_items), 
        process_title, JSON.stringify(process_steps),
        JSON.stringify(related_services),
        meta_title, meta_description, is_active ? 1 : 0,
        id
      ]
    );

    return NextResponse.json({ success: true, message: "Service updated successfully" });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await authMiddleware(req, "admin");
    if (!auth.success) return auth;

    const { id } = params;
    await query("DELETE FROM services WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
