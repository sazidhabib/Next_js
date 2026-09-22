import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Restaurant, User } from '@/lib/sequelize';
import { decryptSession } from '@/lib/session';
import { getOffersByRestaurant, createOffer } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function verifyAuth(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie.value);
}

// Helper to resolve the correct target restaurant
async function resolveTargetRestaurant(restaurantParam, session) {
  let targetRestaurant = null;

  // 1. Try by provided ID or Slug
  if (restaurantParam && restaurantParam !== 'undefined' && restaurantParam !== 'null' && restaurantParam !== 'resto-bella-vista-001') {
    try {
      targetRestaurant = await Restaurant.findOne({
        where: {
          [Op.or]: [{ id: restaurantParam }, { slug: restaurantParam }],
        },
      });
    } catch (e) {
      // Fallback
    }
  }

  // 2. If not found, check the logged-in user's assigned restaurant
  if (!targetRestaurant && session?.userId) {
    try {
      const user = await User.findOne({
        where: { id: session.userId },
        include: [{ association: 'restaurantRoles', include: [{ model: Restaurant, as: 'restaurant' }] }],
      });
      if (user && user.restaurantRoles && user.restaurantRoles.length > 0 && user.restaurantRoles[0].restaurant) {
        targetRestaurant = user.restaurantRoles[0].restaurant;
      }
    } catch (e) {
      // Fallback
    }
  }

  // 3. If still not found, fallback to the first active restaurant
  if (!targetRestaurant) {
    try {
      targetRestaurant = await Restaurant.findOne();
    } catch (e) {
      // Fallback
    }
  }

  return targetRestaurant;
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

    const targetRestaurant = await resolveTargetRestaurant(restaurantIdParam, session);
    const restaurantId = targetRestaurant ? targetRestaurant.id : (restaurantIdParam || 'resto-bella-vista-001');

    const offers = await getOffersByRestaurant(restaurantId);

    return NextResponse.json({ success: true, data: offers, restaurantId });
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

    const requestedResto = body.restaurantId || body.slug;
    const targetRestaurant = await resolveTargetRestaurant(requestedResto, session);
    const targetRestaurantId = targetRestaurant ? targetRestaurant.id : (requestedResto || 'resto-bella-vista-001');

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
