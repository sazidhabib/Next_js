import { NextResponse } from 'next/server';
import { getOrders, createOrder, getOrderById } from '@/lib/dataStore';
import { autoPrintKitchenReceipt } from '@/lib/printerService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const orders = await getOrders(restaurantId);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty. Please add items to place an order.' },
        { status: 400 }
      );
    }

    if (!body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone number are required.' },
        { status: 400 }
      );
    }

    const order = await createOrder(body);

    // Asynchronously trigger ESC/POS kitchen print
    getOrderById(order.id).then((fullOrder) => {
      if (fullOrder) {
        autoPrintKitchenReceipt(fullOrder).catch(err => {
          console.error('Failed to auto print kitchen receipt:', err);
        });
      }
    }).catch(err => {
      console.error('Failed to get full order details for print:', err);
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to place order: ' + error.message },
      { status: 500 }
    );
  }
}
