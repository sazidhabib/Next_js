import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/dataStore';

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

    return NextResponse.json({ success: true, data: order });
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
