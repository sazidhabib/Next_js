import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decryptSession } from '@/lib/session';

async function verifyAuth(request) {
  const sessionCookie = request.cookies.get('admin_session');
  if (!sessionCookie) return null;
  return decryptSession(sessionCookie.value);
}

export async function GET(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        activeCustomerTemplateId: true,
        activeKitchenTemplateId: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error('Error fetching printer settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch printer settings' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId, activeCustomerTemplateId, activeKitchenTemplateId } = body;

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

    // Verify templates exist and belong to the correct restaurant
    if (activeCustomerTemplateId) {
      const custTemp = await prisma.invoiceTemplate.findFirst({
        where: { id: activeCustomerTemplateId, restaurantId },
      });
      if (!custTemp) {
        return NextResponse.json({ success: false, error: 'Selected customer template not found' }, { status: 400 });
      }
    }

    if (activeKitchenTemplateId) {
      const kitTemp = await prisma.invoiceTemplate.findFirst({
        where: { id: activeKitchenTemplateId, restaurantId },
      });
      if (!kitTemp) {
        return NextResponse.json({ success: false, error: 'Selected kitchen template not found' }, { status: 400 });
      }
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        activeCustomerTemplateId: activeCustomerTemplateId || null,
        activeKitchenTemplateId: activeKitchenTemplateId || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        activeCustomerTemplateId: updated.activeCustomerTemplateId,
        activeKitchenTemplateId: updated.activeKitchenTemplateId,
      },
    });
  } catch (error) {
    console.error('Error updating printer settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update printer settings' }, { status: 500 });
  }
}
