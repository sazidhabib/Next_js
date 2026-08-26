import { NextResponse } from "next/server";
import { Font } from "../../../../../models/index.js";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const font = await Font.findByPk(parseInt(resolvedParams.id));
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }
    return NextResponse.json({ font });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const font = await Font.findByPk(parseInt(resolvedParams.id));
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }
    await font.update(body);
    return NextResponse.json({ font });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const font = await Font.findByPk(parseInt(resolvedParams.id));
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }
    await font.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
