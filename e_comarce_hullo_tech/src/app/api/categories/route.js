import { NextResponse } from 'next/server';
import { Category } from '@/lib/db';
import { verifyAdmin } from '@/lib/api-auth';
import { categories as seedCategories } from '../../../../db/seedData';

let memoryCategories = [...seedCategories];

export async function GET() {
  try {
    if (!Category) {
      return NextResponse.json({ success: true, data: memoryCategories });
    }

    try {
      const categories = await Category.findAll({ order: [['id', 'ASC']] });
      const data = categories.map(c => c.toJSON ? c.toJSON() : c);
      return NextResponse.json({ success: true, data });
    } catch (dbErr) {
      console.warn('⚠️ DB read error during categories GET:', dbErr.message);
      return NextResponse.json({ success: true, data: memoryCategories });
    }
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json({ success: true, data: memoryCategories });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name, icon, slug, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: 'Name and slug are required' }, { status: 400 });
    }

    if (!Category) {
      const newCategory = {
        id: memoryCategories.length > 0 ? Math.max(...memoryCategories.map(c => c.id)) + 1 : 1,
        name,
        icon,
        slug,
        image
      };
      memoryCategories.push(newCategory);
      return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
    }

    try {
      const category = await Category.create({ name, icon, slug, image });
      const data = category.toJSON ? category.toJSON() : category;
      return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (dbErr) {
      console.warn('⚠️ DB write error during categories POST:', dbErr.message);
      const newCategory = {
        id: memoryCategories.length > 0 ? Math.max(...memoryCategories.map(c => c.id)) + 1 : 1,
        name,
        icon,
        slug,
        image
      };
      memoryCategories.push(newCategory);
      return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
    }
  } catch (error) {
    console.error('Categories POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
