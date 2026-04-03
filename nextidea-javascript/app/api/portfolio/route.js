import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { validateInput, portfolioSchema, generateSlug, paginate } from '@/app/lib/validation';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 10;
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');
    const lang = searchParams.get('lang') || 'en';
    const featured = searchParams.get('featured');

    const offset = (page - 1) * limit;

    let whereConditions = ['pi.is_active = TRUE'];
    let params = [];

    if (categoryId) {
      whereConditions.push('pi.category_id = ?');
      params.push(categoryId);
    }

    if (search) {
      whereConditions.push('(pi.title LIKE ? OR pi.description LIKE ? OR pi.client_name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (featured !== null) {
      whereConditions.push('pi.featured = ?');
      params.push(featured === 'true' ? 1 : 0);
    }

    const whereClause = whereConditions.join(' AND ');

    const countResult = await query(
      `SELECT COUNT(*) as total FROM portfolio_items pi WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    const items = await query(
      `SELECT pi.id, pi.title, pi.slug, pi.description, pi.client_name, 
              pi.project_date, pi.featured, pi.meta_title,
              c.title as category_title, c.slug as category_slug,
              (SELECT image_url FROM portfolio_images WHERE portfolio_item_id = pi.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as thumbnail_url
       FROM portfolio_items pi
       LEFT JOIN categories c ON pi.category_id = c.id
       WHERE ${whereClause}
       ORDER BY pi.featured DESC, pi.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const images = await query(
          'SELECT id, image_url, alt_text, sort_order, is_primary FROM portfolio_images WHERE portfolio_item_id = ? ORDER BY sort_order ASC',
          [item.id]
        );

        const technologies = await query(
          'SELECT technology FROM portfolio_technologies WHERE portfolio_item_id = ?',
          [item.id]
        );

        return {
          ...item,
          images,
          technologies: technologies.map((t) => t.technology),
        };
      })
    );

    const paginated = paginate(itemsWithImages, page, limit, total);

    return NextResponse.json({
      success: true,
      data: {
        demos: paginated.items,
        pagination: paginated.pagination,
      },
    });
  } catch (error) {
    return handleApiError(error, 'Portfolio GET');
  }
}

export async function POST(request) {
  try {
    const auth = await authMiddleware(request, 'editor');
    if (!auth.success) return auth;

    const body = await request.json();
    const validation = validateInput(body, portfolioSchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.value;
    const slug = generateSlug(data.title);

    const connection = await require('@/app/lib/db').getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        'INSERT INTO portfolio_items (title, slug, description, category_id, client_name, client_website, project_date, completion_date, featured, is_active, meta_title, meta_description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
          auth.user.id,
        ]
      );

      const portfolioId = result.insertId;

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          await connection.execute(
            'INSERT INTO portfolio_images (portfolio_item_id, image_url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
            [portfolioId, img.url, img.alt_text || null, img.sort_order || i, img.is_primary || false]
          );
        }
      }

      if (data.technologies && data.technologies.length > 0) {
        for (const tech of data.technologies) {
          await connection.execute(
            'INSERT INTO portfolio_technologies (portfolio_item_id, technology) VALUES (?, ?)',
            [portfolioId, tech]
          );
        }
      }

      await connection.commit();

      const [newItem] = await connection.execute(
        'SELECT * FROM portfolio_items WHERE id = ?',
        [portfolioId]
      );

      return NextResponse.json(
        { success: true, data: { portfolio_item: newItem[0] } },
        { status: 201 }
      );
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return handleApiError(error, 'Portfolio POST');
  }
}
