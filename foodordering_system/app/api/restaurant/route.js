import { NextResponse } from 'next/server';
import { getRestaurantBySlug } from '@/lib/dataStore';
import { Restaurant } from '@/lib/sequelize';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'bellavista-pizza';
    const restaurant = await getRestaurantBySlug(slug);

    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant data' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      phone,
      email,
      address,
      taxRatePercent,
      estimatedPrepTime,
      enableDelivery,
      enablePickup,
      enableCash,
      enableCard,
      enableOnline,
      stripePublishableKey,
      stripeSecretKey,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

    await Restaurant.update({
      name,
      phone,
      email,
      address,
      taxRatePercent: parseFloat(taxRatePercent) || 0.0,
      estimatedPrepTime: parseInt(estimatedPrepTime) || 25,
      enableDelivery,
      enablePickup,
      enableCash,
      enableCard,
      enableOnline,
      stripePublishableKey: stripePublishableKey || null,
      stripeSecretKey: stripeSecretKey || null,
    }, {
      where: { id },
    });

    const updated = await Restaurant.findOne({ where: { id } });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update restaurant settings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
