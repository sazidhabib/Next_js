import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';

export async function POST(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'editor');
    if (!auth.success) return auth;

    const { id } = await params;
    const body = await request.json();

    const portfolioItems = await query('SELECT id FROM portfolio_items WHERE id = ?', [id]);
    if (portfolioItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Portfolio item not found' },
        { status: 404 }
      );
    }

    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Images array is required' },
        { status: 400 }
      );
    }

    const insertedImages = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const [result] = await query(
        'INSERT INTO portfolio_images (portfolio_item_id, image_url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
        [id, img.url, img.alt_text || null, img.sort_order || i, img.is_primary || false]
      );

      insertedImages.push({
        id: result.insertId,
        portfolio_item_id: id,
        image_url: img.url,
        alt_text: img.alt_text || null,
        sort_order: img.sort_order || i,
        is_primary: img.is_primary || false,
      });
    }

    return NextResponse.json(
      { success: true, data: { images: insertedImages } },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'Portfolio Images POST');
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'editor');
    if (!auth.success) return auth;

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('image_id');

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'image_id query parameter is required' },
        { status: 400 }
      );
    }

    await query('DELETE FROM portfolio_images WHERE id = ? AND portfolio_item_id = ?', [imageId, id]);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Portfolio Images DELETE');
  }
}
