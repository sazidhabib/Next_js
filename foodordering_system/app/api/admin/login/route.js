import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encryptSession } from '@/lib/session';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Only allow SUPER_ADMIN, RESTAURANT_ADMIN, STAFF_OPERATOR
    if (user.role === 'CUSTOMER') {
      return NextResponse.json(
        { success: false, error: 'Access denied: Insufficient permissions' },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Fetch associated restaurant if not Super Admin
    let associatedRestaurant = null;
    if (user.role !== 'SUPER_ADMIN') {
      const userRole = await prisma.userRestaurantRole.findFirst({
        where: { userId: user.id },
        include: { restaurant: true },
      });
      if (userRole) {
        associatedRestaurant = userRole.restaurant;
      }
    }

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      associatedRestaurant,
    };

    const token = encryptSession(sessionData);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        associatedRestaurant,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
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
