import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';
import { hashPassword } from '@/app/lib/auth';

export async function GET(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { id } = await params;

    const users = await query(
      'SELECT id, username, email, role, is_active, created_at, updated_at, last_login FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    return handleApiError(error, 'User GET');
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { id } = await params;
    const body = await request.json();

    const existingUsers = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { username, email, role, is_active, password } = body;

    if (parseInt(id, 10) === auth.user.id && is_active === false) {
      return NextResponse.json(
        { success: false, error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    if (password) {
      const passwordHash = await hashPassword(password);
      await query(
        'UPDATE users SET username = ?, email = ?, role = ?, is_active = ?, password_hash = ? WHERE id = ?',
        [username, email, role, is_active, passwordHash, id]
      );
    } else {
      await query(
        'UPDATE users SET username = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
        [username, email, role, is_active, id]
      );
    }

    const [updatedUser] = await query(
      'SELECT id, username, email, role, is_active, created_at, updated_at, last_login FROM users WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return handleApiError(error, 'User PUT');
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const { id } = await params;

    if (parseInt(id, 10) === auth.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const existingUsers = await query('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUsers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    await query('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    return handleApiError(error, 'User DELETE');
  }
}
