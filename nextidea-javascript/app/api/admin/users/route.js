import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { hashPassword } from '@/app/lib/auth';
import { validateInput, registerSchema } from '@/app/lib/validation';

export async function GET(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page'), 10) || 1;
    const limit = parseInt(searchParams.get('limit'), 10) || 20;
    const role = searchParams.get('role');

    const offset = (page - 1) * limit;

    let whereConditions = [];
    let params = [];

    if (role) {
      whereConditions.push('role = ?');
      params.push(role);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) as total FROM users ${whereClause}`, params);
    const total = countResult[0].total;

    const users = await query(
      `SELECT id, username, email, role, is_active, created_at, updated_at, last_login
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: total,
          total_pages: totalPages,
          has_next: page < totalPages,
          has_prev: page > 1,
        },
      },
    });
  } catch (error) {
    return handleApiError(error, 'Users GET');
  }
}

export async function POST(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const body = await request.json();
    const validation = validateInput(body, registerSchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { username, email, password } = validation.value;

    const existingUser = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email or username already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const role = body.role || 'viewer';

    const [result] = await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, role]
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.insertId,
          username,
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'Users POST');
  }
}
