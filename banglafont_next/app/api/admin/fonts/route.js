import { NextResponse } from "next/server";
import { Font } from "../../../../models/index.js";

export async function GET(request) {
  return NextResponse.redirect(new URL("/api/fonts", request.url));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const font = await Font.create(body);
    return NextResponse.json({ font }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
