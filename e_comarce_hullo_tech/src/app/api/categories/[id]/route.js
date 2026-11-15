import { NextResponse } from 'next/server';
import { Category } from '@/lib/db';
import { verifyAdmin } from '@/lib/api-auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!Category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    const data = category.toJSON ? category.toJSON() : category;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, slug, image } = body;

    if (!Category) {
      return NextResponse.json({ success: false, message: 'Category model unavailable' }, { status: 500 });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    if (name !== undefined) category.name = name;
    if (icon !== undefined) category.icon = icon;
    if (slug !== undefined) category.slug = slug;
    if (image !== undefined) category.image = image;

    await category.save();
    const data = category.toJSON ? category.toJSON() : category;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!Category) {
      return NextResponse.json({ success: false, message: 'Category model unavailable' }, { status: 500 });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }

    await category.destroy();
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
