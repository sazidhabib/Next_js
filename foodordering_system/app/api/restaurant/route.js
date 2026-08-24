import { NextResponse } from 'next/server';
import { getRestaurantBySlug } from '@/lib/dataStore';

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
