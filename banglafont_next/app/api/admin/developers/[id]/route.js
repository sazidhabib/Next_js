import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const developer = await prisma.developer.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    });
    if (!developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }
    return NextResponse.json({ developer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const developerId = parseInt(resolvedParams.id);

    if (body.slug) {
      const existing = await prisma.developer.findFirst({
        where: {
          slug: body.slug,
          NOT: { id: developerId }
        }
      });
      if (existing) {
        return NextResponse.json(
          { error: "এই স্লাগটি ইতিমধ্যে ব্যবহার করা হয়েছে, অনুগ্রহ করে অন্য একটি স্লাগ ব্যবহার করুন।" },
          { status: 400 }
        );
      }
    }

    const developer = await prisma.developer.update({
      where: { id: developerId },
      data: body,
    });
    return NextResponse.json({ developer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const developerId = parseInt(resolvedParams.id);

    // Dissociate from any fonts
    await prisma.font.updateMany({
      where: { developerId },
      data: { developerId: null },
    });

    await prisma.developer.delete({
      where: { id: developerId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
