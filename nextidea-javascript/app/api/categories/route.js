import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { validateInput, categorySchema, generateSlug } from '@/app/lib/validation';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    let whereConditions = [];
    let params = [];

    if (active === 'true') {
      whereConditions.push('is_active = TRUE');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const categories = await query(
      `SELECT id, title, slug, description, sort_order, is_active, created_at, updated_at
       FROM categories
       ${whereClause}
       ORDER BY sort_order ASC, title ASC`,
      params
    );

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return handleApiError(error, 'Categories GET');
  }
}

export async function POST(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const body = await request.json();
    const validation = validateInput(body, categorySchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.value;
    const slug = generateSlug(data.title);

    const [result] = await query(
      'INSERT INTO categories (title, slug, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [data.title, slug, data.description || null, data.sort_order, data.is_active]
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.insertId,
          title: data.title,
          slug,
          description: data.description || null,
          sort_order: data.sort_order,
          is_active: data.is_active,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'Categories POST');
  }
}
