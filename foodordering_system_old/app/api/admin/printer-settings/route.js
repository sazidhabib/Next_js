import { NextResponse } from 'next/server';
import { Restaurant, InvoiceTemplate } from '@/lib/sequelize';
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

    const restaurant = await Restaurant.findOne({
      where: { id: restaurantId },
      attributes: ['activeCustomerTemplateId', 'activeKitchenTemplateId', 'kitchenPrinterIp', 'kitchenPrinterPort'],
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
    const { restaurantId, activeCustomerTemplateId, activeKitchenTemplateId, kitchenPrinterIp, kitchenPrinterPort } = body;

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
    }

    // Verify templates exist and belong to the correct restaurant
    if (activeCustomerTemplateId) {
      const custTemp = await InvoiceTemplate.findOne({
        where: { id: activeCustomerTemplateId, restaurantId },
      });
      if (!custTemp) {
        return NextResponse.json({ success: false, error: 'Selected customer template not found' }, { status: 400 });
      }
    }

    if (activeKitchenTemplateId) {
      const kitTemp = await InvoiceTemplate.findOne({
        where: { id: activeKitchenTemplateId, restaurantId },
      });
      if (!kitTemp) {
        return NextResponse.json({ success: false, error: 'Selected kitchen template not found' }, { status: 400 });
      }
    }

    await Restaurant.update({
      activeCustomerTemplateId: activeCustomerTemplateId || null,
      activeKitchenTemplateId: activeKitchenTemplateId || null,
      kitchenPrinterIp: kitchenPrinterIp || null,
      kitchenPrinterPort: kitchenPrinterPort ? parseInt(kitchenPrinterPort) : 9100,
    }, {
      where: { id: restaurantId },
    });

    const updated = await Restaurant.findOne({
      where: { id: restaurantId },
      attributes: ['activeCustomerTemplateId', 'activeKitchenTemplateId', 'kitchenPrinterIp', 'kitchenPrinterPort'],
    });

    return NextResponse.json({
      success: true,
      data: {
        activeCustomerTemplateId: updated.activeCustomerTemplateId,
        activeKitchenTemplateId: updated.activeKitchenTemplateId,
        kitchenPrinterIp: updated.kitchenPrinterIp,
        kitchenPrinterPort: updated.kitchenPrinterPort,
      },
    });
  } catch (error) {
    console.error('Error updating printer settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update printer settings' }, { status: 500 });
  }
}
