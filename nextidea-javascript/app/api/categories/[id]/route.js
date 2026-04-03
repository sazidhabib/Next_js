import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { validateInput, categorySchema, generateSlug } from '@/app/lib/validation';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const categories = await query('SELECT * FROM categories WHERE id = ?', [id]);

    if (categories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    return handleApiError(error, 'Category GET');
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { id } = await params;
    const body = await request.json();

    const existingCategories = await query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existingCategories.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const validation = validateInput(body, categorySchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.value;
    const slug = body.title ? generateSlug(data.title) : existingCategories[0].slug;

    await query(
      'UPDATE categories SET title = ?, slug = ?, description = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [data.title, slug, data.description || null, data.sort_order, data.is_active, id]
    );

    const [updatedCategory] = await query('SELECT * FROM categories WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    return handleApiError(error, 'Category PUT');
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { id } = await params;

    const portfolioCount = await query(
      'SELECT COUNT(*) as count FROM portfolio_items WHERE category_id = ?',
      [id]
    );

    if (portfolioCount[0].count > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with associated portfolio items' },
        { status: 400 }
      );
    }

    await query('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Category DELETE');
  }
}
