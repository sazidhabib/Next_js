import { NextResponse } from 'next/server';
import { User, Restaurant } from '@/lib/sequelize';
import { decryptSession } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const withTimeout = (promise, ms = 1500) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), ms)),
  ]);

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

    let user = null;
    let associatedRestaurant = session.associatedRestaurant || null;

    try {
      user = await withTimeout(
        User.findOne({
          where: { id: session.userId },
          include: [
            {
              association: 'restaurantRoles',
              required: false,
              include: [
                {
                  model: Restaurant,
                  as: 'restaurant',
                  required: false,
                },
              ],
            },
          ],
        }),
        1500
      );
    } catch (queryErr) {
      // Fallback
    }

    if (user && user.role !== 'SUPER_ADMIN' && user.restaurantRoles && user.restaurantRoles.length > 0) {
      associatedRestaurant = user.restaurantRoles[0].restaurant;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        name: user ? user.name : session.name,
        email: user ? user.email : session.email,
        role: user ? user.role : session.role,
        associatedRestaurant,
      },
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
