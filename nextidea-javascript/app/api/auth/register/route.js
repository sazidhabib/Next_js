import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { hashPassword } from '@/app/lib/auth';
import { validateInput, registerSchema } from '@/app/lib/validation';
import { rateLimit, getClientIp } from '@/app/lib/middleware';

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);
    
    if (!rateLimit(`register_${clientIp}`, 3, 3600000)) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

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

    const [result] = await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, 'viewer']
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: {
          id: result.insertId,
          username,
          email,
          role: 'viewer',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
