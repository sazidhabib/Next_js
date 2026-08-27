import { NextResponse } from 'next/server';
import { User, Restaurant } from '@/lib/sequelize';
import { decryptSession } from '@/lib/session';

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const session = decryptSession(sessionCookie.value);
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const [userCount, restaurantCount, restaurants] = await Promise.all([
      User.count(),
      Restaurant.count(),
      Restaurant.findAll({
        order: [['name', 'ASC']],
      }),
    ]);

    return NextResponse.json({
      success: true,
      metrics: {
        userCount,
        restaurantCount,
      },
      restaurants,
    });
  } catch (error) {
    console.error('Failed to load super admin metrics:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
