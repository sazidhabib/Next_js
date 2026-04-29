import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";

export async function GET() {
  try {
    await query("ALTER TABLE services ADD COLUMN extra_content JSON NULL AFTER related_services");
    return NextResponse.json({ success: true, message: "Table altered successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
