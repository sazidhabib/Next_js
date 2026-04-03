import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { validateInput, portfolioSchema, generateSlug } from '@/app/lib/validation';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const items = await query(
      `SELECT pi.*, c.title as category_title, c.slug as category_slug
       FROM portfolio_items pi
       LEFT JOIN categories c ON pi.category_id = c.id
       WHERE pi.id = ?`,
      [id]
    );

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const item = items[0];

    const images = await query(
      'SELECT id, image_url, alt_text, sort_order, is_primary FROM portfolio_images WHERE portfolio_item_id = ? ORDER BY sort_order ASC',
      [id]
    );

    const technologies = await query(
      'SELECT technology FROM portfolio_technologies WHERE portfolio_item_id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        images,
        technologies: technologies.map((t) => t.technology),
      },
    });
  } catch (error) {
    return handleApiError(error, 'Portfolio GET by ID');
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'editor');
    if (!auth.success) return auth;

    const { id } = await params;
    const body = await request.json();

    const existingItems = await query('SELECT * FROM portfolio_items WHERE id = ?', [id]);
    if (existingItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const existingItem = existingItems[0];
    const updateData = { ...existingItem, ...body };

    const validation = validateInput(updateData, portfolioSchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.value;
    const slug = body.title ? generateSlug(data.title) : existingItem.slug;

    await query(
      'UPDATE portfolio_items SET title = ?, slug = ?, description = ?, category_id = ?, client_name = ?, client_website = ?, project_date = ?, completion_date = ?, featured = ?, is_active = ?, meta_title = ?, meta_description = ? WHERE id = ?',
      [
        data.title,
        slug,
        data.description || null,
        data.category_id || null,
        data.client_name || null,
        data.client_website || null,
        data.project_date || null,
        data.completion_date || null,
        data.featured,
        data.is_active,
        data.meta_title || null,
        data.meta_description || null,
        id,
      ]
    );

    const [updatedItem] = await query('SELECT * FROM portfolio_items WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      data: { portfolio_item: updatedItem[0] },
    });
  } catch (error) {
    return handleApiError(error, 'Portfolio PUT');
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { id } = await params;

    const existingItems = await query('SELECT * FROM portfolio_items WHERE id = ?', [id]);
    if (existingItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    await query('DELETE FROM portfolio_items WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Portfolio item deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Portfolio DELETE');
  }
}
