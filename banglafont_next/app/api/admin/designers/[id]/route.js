import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const designer = await prisma.designer.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    });
    if (!designer) {
      return NextResponse.json({ error: "Designer not found" }, { status: 404 });
    }
    return NextResponse.json({ designer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const designerId = parseInt(resolvedParams.id);

    if (body.slug) {
      const existing = await prisma.designer.findFirst({
        where: {
          slug: body.slug,
          NOT: { id: designerId }
        }
      });
      if (existing) {
        return NextResponse.json(
          { error: "এই স্লাগটি ইতিমধ্যে ব্যবহার করা হয়েছে, অনুগ্রহ করে অন্য একটি স্লাগ ব্যবহার করুন।" },
          { status: 400 }
        );
      }
    }

    const designer = await prisma.designer.update({
      where: { id: designerId },
      data: body,
    });
    return NextResponse.json({ designer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const designerId = parseInt(resolvedParams.id);

    // Check if designer has fonts associated with them
    const count = await prisma.font.count({
      where: { designerId },
    });
    if (count > 0) {
      return NextResponse.json(
        { error: "এই ডিজাইনারের অধীনে ফন্ট রয়েছে, তাই ডিলিট করা সম্ভব নয়।" },
        { status: 400 }
      );
    }

    await prisma.designer.delete({
      where: { id: designerId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
