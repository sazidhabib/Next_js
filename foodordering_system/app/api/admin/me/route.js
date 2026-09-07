import { NextResponse } from 'next/server';
import { User, Restaurant } from '@/lib/sequelize';
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

    let user = null;
    let associatedRestaurant = null;

    try {
      user = await User.findOne({
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
      });
    } catch (queryErr) {
      console.warn('Eager loading restaurantRoles failed, fallback to basic user query:', queryErr.message);
      user = await User.findOne({ where: { id: session.userId } });
    }

    if (!user) {
      return NextResponse.json({ success: false, error: 'User no longer exists' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN' && user.restaurantRoles && user.restaurantRoles.length > 0) {
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
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
