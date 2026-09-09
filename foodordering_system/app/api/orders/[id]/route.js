import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/dataStore';
import { Restaurant, InvoiceTemplate } from '@/lib/sequelize';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Attempt to load restaurant & active customer template
    let restaurant = null;
    let customerTemplate = null;

    try {
      if (order.restaurantId) {
        restaurant = await Restaurant.findOne({
          where: { id: order.restaurantId },
          attributes: ['id', 'name', 'phone', 'email', 'address', 'vatNumber', 'legalName', 'website', 'activeCustomerTemplateId'],
        });

        if (restaurant?.activeCustomerTemplateId) {
          customerTemplate = await InvoiceTemplate.findOne({
            where: { id: restaurant.activeCustomerTemplateId },
          });
        }
      }
    } catch (dbErr) {
      console.warn('Could not fetch template/restaurant relation:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      data: order,
      restaurant: restaurant ? restaurant.get({ plain: true }) : null,
      customerTemplate: customerTemplate ? customerTemplate.get({ plain: true }) : null,
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, prepMinutes, rejectionReason } = body;

    if (!status && prepMinutes === undefined) {
      return NextResponse.json(
        { success: false, error: 'Status or prepMinutes is required' },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatus(id, {
      status,
      prepMinutes: prepMinutes !== undefined && prepMinutes !== null && prepMinutes !== '' ? Number(prepMinutes) : undefined,
      rejectionReason,
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
