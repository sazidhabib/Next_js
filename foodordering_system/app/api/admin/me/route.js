import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptSession } from '@/lib/session';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 });
    }

    // Load fresh user data from database to reflect changes instantly
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        restaurantRoles: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User no longer exists' }, { status: 401 });
    }

    let associatedRestaurant = null;
    if (user.role !== 'SUPER_ADMIN' && user.restaurantRoles.length > 0) {
      associatedRestaurant = user.restaurantRoles[0].restaurant;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        associatedRestaurant,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
