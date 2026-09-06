import { NextResponse } from 'next/server';
import { getRestaurantBySlug, saveDeliveryZones, updateDeliveryStatus } from '@/lib/dataStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug') || 'bellavista-pizza';
    const restaurant = await getRestaurantBySlug(slug);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        enableDelivery: restaurant.enableDelivery,
        deliveryZones: restaurant.deliveryZones || [],
        restaurantLocation: {
          lat: restaurant.latitude || 51.5133,
          lng: restaurant.longitude || -0.1362,
          address: restaurant.address || '42 Dean Street, Soho, London W1D 4PG, UK',
          name: restaurant.name || 'Bella Vista Gourmet Kitchen & Pizzeria',
        },
        currency: restaurant.currency || 'GBP',
        currencySymbol: restaurant.currencySymbol || '£',
      },
    });
  } catch (error) {
    console.error('Error fetching admin delivery zones:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { deliveryZones, enableDelivery } = body;

    if (enableDelivery !== undefined) {
      updateDeliveryStatus(enableDelivery);
    }

    if (Array.isArray(deliveryZones)) {
      saveDeliveryZones(deliveryZones);
    }

    return NextResponse.json({
      success: true,
      message: 'Delivery zones updated successfully',
      data: {
        enableDelivery,
        deliveryZones,
      },
    });
  } catch (error) {
    console.error('Error saving admin delivery zones:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
