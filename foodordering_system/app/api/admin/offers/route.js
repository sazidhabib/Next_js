import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Restaurant } from '@/lib/sequelize';
import { decryptSession } from '@/lib/session';
import { getOffersByRestaurant, createOffer } from '@/lib/dataStore';

async function verifyAuth(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie.value);
}

// GET /api/admin/offers?restaurantId=...
export async function GET(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantIdParam = searchParams.get('restaurantId') || searchParams.get('slug');

    let targetRestaurant = null;
    if (restaurantIdParam && restaurantIdParam !== 'undefined' && restaurantIdParam !== 'null') {
      try {
        targetRestaurant = await Restaurant.findOne({
          where: {
            [Op.or]: [{ id: restaurantIdParam }, { slug: restaurantIdParam }],
          },
        });
      } catch (e) {
        // Fallback
      }
    }

    const restaurantId = targetRestaurant ? targetRestaurant.id : (restaurantIdParam || 'resto-bella-vista-001');
    const offers = await getOffersByRestaurant(restaurantId);

    return NextResponse.json({ success: true, data: offers });
  } catch (error) {
    console.error('Error fetching admin offers:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/admin/offers - Create a new offer
export async function POST(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Offer title is required' }, { status: 400 });
    }

    let targetRestaurantId = body.restaurantId;
    if (!targetRestaurantId || targetRestaurantId === 'undefined') {
      try {
        const firstResto = await Restaurant.findOne();
        targetRestaurantId = firstResto ? firstResto.id : 'resto-bella-vista-001';
      } catch (e) {
        targetRestaurantId = 'resto-bella-vista-001';
      }
    }

    const newOffer = await createOffer({
      ...body,
      restaurantId: targetRestaurantId,
    });

    return NextResponse.json({ success: true, data: newOffer });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
