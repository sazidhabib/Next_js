import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Restaurant } from '@/lib/sequelize';
import { validateOfferCode, getOffersByRestaurant } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/offers/validate
export async function POST(request) {
  try {
    const body = await request.json();
    const { restaurantId: reqRestoId, slug, code, subtotal = 0, serviceType = 'DELIVERY', deliveryFee = 0, items = [] } = body;

    let targetRestaurantId = reqRestoId;
    if (!targetRestaurantId && slug) {
      try {
        const resto = await Restaurant.findOne({ where: { slug } });
        if (resto) targetRestaurantId = resto.id;
      } catch (e) {
        // Fallback
      }
    }

    if (!targetRestaurantId) {
      targetRestaurantId = 'resto-bella-vista-001';
    }

    // If no specific code is sent, but checkAutomatic is true, find best eligible auto-offer
    if (!code && body.checkAutomatic) {
      const allOffers = await getOffersByRestaurant(targetRestaurantId);
      const autoOffers = allOffers.filter(
        (o) => o.isActive && o.isAutomatic && (o.serviceType === 'ALL' || o.serviceType === serviceType)
      );

      let bestOfferResult = null;
      let highestDiscount = 0;

      for (const autoOffer of autoOffers) {
        const res = await validateOfferCode({
          restaurantId: targetRestaurantId,
          code: autoOffer.code,
          subtotal: parseFloat(subtotal),
          serviceType,
          deliveryFee: parseFloat(deliveryFee),
          items,
        });

        if (res.valid && res.discountAmount > highestDiscount) {
          highestDiscount = res.discountAmount;
          bestOfferResult = res;
        }
      }

      if (bestOfferResult) {
        return NextResponse.json({ success: true, ...bestOfferResult });
      }

      return NextResponse.json({ success: false, message: 'No automatic offers qualify for this basket.' });
    }

    const validationResult = await validateOfferCode({
      restaurantId: targetRestaurantId,
      code,
      subtotal: parseFloat(subtotal),
      serviceType,
      deliveryFee: parseFloat(deliveryFee),
      items,
    });

    if (!validationResult.valid) {
      return NextResponse.json({
        success: false,
        message: validationResult.message,
        minOrderAmount: validationResult.minOrderAmount,
        shortfall: validationResult.shortfall,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      ...validationResult,
    });
  } catch (error) {
    console.error('Error validating offer:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
