import { NextResponse } from 'next/server';
import { Order, OrderItem, Product } from '@/lib/db';
import { verifyAdmin } from '@/lib/api-auth';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!Order) {
      return NextResponse.json({ success: false, message: 'Order model unavailable' }, { status: 500 });
    }

    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }]
      }]
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const data = order.toJSON ? order.toJSON() : order;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid order status' }, { status: 400 });
    }

    if (!Order) {
      return NextResponse.json({ success: false, message: 'Order model unavailable' }, { status: 500 });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    order.status = status;
    await order.save();

    const data = order.toJSON ? order.toJSON() : order;
    return NextResponse.json({ success: true, message: 'Order status updated successfully', data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    if (!Order) {
      return NextResponse.json({ success: false, message: 'Order model unavailable' }, { status: 500 });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    await order.destroy();
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
