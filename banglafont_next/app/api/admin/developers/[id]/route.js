import { NextResponse } from "next/server";
import { Developer, Font, Op } from "../../../../../models/index.js";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const developer = await Developer.findByPk(parseInt(resolvedParams.id));
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

    const developer = await Developer.findByPk(developerId);
    if (!developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    if (body.slug) {
      const existing = await Developer.findOne({
        where: {
          slug: body.slug,
          id: { [Op.ne]: developerId },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "এই স্লাগটি ইতিমধ্যে ব্যবহার করা হয়েছে, অনুগ্রহ করে অন্য একটি স্লাগ ব্যবহার করুন।" },
          { status: 400 }
        );
      }
    }

    await developer.update(body);
    return NextResponse.json({ developer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const developerId = parseInt(resolvedParams.id);

    const developer = await Developer.findByPk(developerId);
    if (!developer) {
      return NextResponse.json({ error: "Developer not found" }, { status: 404 });
    }

    // Dissociate from any fonts
    await Font.update(
      { developerId: null },
      { where: { developerId } }
    );

    await developer.destroy();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
