import { NextResponse } from 'next/server';
import { Op } from 'sequelize';
import { Restaurant } from '@/lib/sequelize';
import { decryptSession } from '@/lib/session';

async function checkSuperAdmin(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  const session = decryptSession(sessionCookie.value);
  if (!session || session.role !== 'SUPER_ADMIN') return null;
  return session;
}

// GET: List all restaurants
export async function GET(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const restaurants = await Restaurant.findAll({
      order: [['name', 'ASC']],
    });

    return NextResponse.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Fetch restaurants error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new restaurant
export async function POST(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
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

    if (!name || !slug || !phone || !email || !address) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Verify slug uniqueness
    const existing = await Restaurant.findOne({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug is already taken' }, { status: 400 });
    }

    const newResto = await Restaurant.create({
      name,
      slug,
      description: description || null,
      phone,
      email,
      address,
      taxRatePercent: parseFloat(taxRatePercent) || 0.0,
      estimatedPrepTime: parseInt(estimatedPrepTime) || 25,
      enableDelivery: enableDelivery !== undefined ? enableDelivery : true,
      enablePickup: enablePickup !== undefined ? enablePickup : true,
      enableCash: enableCash !== undefined ? enableCash : true,
      enableCard: enableCard !== undefined ? enableCard : true,
      enableOnline: enableOnline !== undefined ? enableOnline : false,
      stripePublishableKey: stripePublishableKey || null,
      stripeSecretKey: stripeSecretKey || null,
    });

    return NextResponse.json({ success: true, data: newResto }, { status: 201 });
  } catch (error) {
    console.error('Create restaurant error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update a restaurant
export async function PUT(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      name,
      slug,
      description,
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

    if (!id || !name || !slug || !phone || !email || !address) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Verify slug uniqueness for other stores
    const existing = await Restaurant.findOne({
      where: {
        slug,
        id: { [Op.ne]: id },
      },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug is already in use by another restaurant' }, { status: 400 });
    }

    await Restaurant.update({
      name,
      slug,
      description: description || null,
      phone,
      email,
      address,
      taxRatePercent: parseFloat(taxRatePercent) || 0.0,
      estimatedPrepTime: parseInt(estimatedPrepTime) || 25,
      enableDelivery: enableDelivery !== undefined ? enableDelivery : true,
      enablePickup: enablePickup !== undefined ? enablePickup : true,
      enableCash: enableCash !== undefined ? enableCash : true,
      enableCard: enableCard !== undefined ? enableCard : true,
      enableOnline: enableOnline !== undefined ? enableOnline : false,
      stripePublishableKey: stripePublishableKey || null,
      stripeSecretKey: stripeSecretKey || null,
    }, {
      where: { id },
    });

    const updated = await Restaurant.findOne({ where: { id } });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Update restaurant error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Delete a restaurant
export async function DELETE(request) {
  try {
    const isSuper = await checkSuperAdmin(request);
    if (!isSuper) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

    await Restaurant.destroy({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
