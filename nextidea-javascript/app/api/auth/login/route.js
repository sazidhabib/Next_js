import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { verifyPassword, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/app/lib/auth';
import { validateInput, loginSchema } from '@/app/lib/validation';
import { rateLimit, getClientIp } from '@/app/lib/middleware';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);
    
    if (!rateLimit(`login_${clientIp}`, 5, 900000)) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = validateInput(body, loginSchema);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.value;

    const users = await query(
      'SELECT id, username, email, password_hash, role, is_active FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      await verifyPassword(password, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILp92S.0i');
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0];

    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenHash = await require('bcryptjs').hash(refreshToken, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    await setAuthCookies(accessToken, refreshToken);

    const sessionId = uuidv4();
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.SESSION_SECURE === 'true',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
