import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const font = await prisma.font.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    });
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
    const font = await prisma.font.update({
      where: { id: parseInt(resolvedParams.id) },
      data: body,
    });
    return NextResponse.json({ font });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    await prisma.font.delete({ where: { id: parseInt(resolvedParams.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
