import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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

    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' },
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
    const existing = await prisma.restaurant.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug is already taken' }, { status: 400 });
    }

    const newResto = await prisma.restaurant.create({
      data: {
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
      },
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
    const existing = await prisma.restaurant.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug is already in use by another restaurant' }, { status: 400 });
    }

    const updated = await prisma.restaurant.update({
      where: { id },
      data: {
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
      },
    });

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

    await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
