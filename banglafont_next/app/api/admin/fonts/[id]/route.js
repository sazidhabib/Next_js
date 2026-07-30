import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const font = await prisma.font.update({
      where: { id: parseInt(params.id) },
      data: body,
    });
    return NextResponse.json({ font });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.font.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
