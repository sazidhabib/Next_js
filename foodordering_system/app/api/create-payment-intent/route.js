import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Order, Restaurant, OrderStatusLog } from '@/lib/sequelize';
import { getOrderById } from '@/lib/dataStore';
import { autoPrintKitchenReceipt } from '@/lib/printerService';

// POST: Create Stripe PaymentIntent for in-modal Checkout
export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findOne({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const restaurant = await Restaurant.findOne({
      where: { id: order.restaurantId },
    });

    const stripeSecretKey = restaurant?.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = restaurant?.stripePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Online payments are not configured for this restaurant' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);
    const currency = (restaurant?.currency || 'gbp').toLowerCase();
    const amountInCents = Math.round(Number(order.totalAmount || 0) * 100);

    if (amountInCents <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order total amount' },
        { status: 400 }
      );
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: String(order.id),
        orderNumber: String(order.orderNumber || ''),
        restaurantId: String(order.restaurantId || ''),
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
      },
      description: `Order #${order.orderNumber || order.id} at ${restaurant?.name || 'Restaurant'}`,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      publishableKey: stripePublishableKey,
      amount: order.totalAmount,
      currency,
    });
  } catch (error) {
    console.error('Create PaymentIntent error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to initialize online payment' },
      { status: 500 }
    );
  }
}

// PUT: Confirm order payment when PaymentIntent succeeds in modal
export async function PUT(request) {
  try {
    const { orderId, paymentIntentId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Update order status to PENDING (for kitchen review) and paymentStatus to PAID
    order.paymentStatus = 'PAID';
    order.status = 'PENDING';
    order.notes = [order.notes, `Paid online via Stripe (Intent: ${paymentIntentId || 'Verified'})`].filter(Boolean).join(' | ');
    await order.save();

    // Also update runtime globalStore in case memory fallback is used
    try {
      const gStore = global.__foodOrderingStore;
      if (gStore && gStore.__orders) {
        const memIdx = gStore.__orders.findIndex(
          (o) => o.id === order.id || o.orderNumber === order.orderNumber
        );
        if (memIdx !== -1) {
          gStore.__orders[memIdx].paymentStatus = 'PAID';
          gStore.__orders[memIdx].status = 'PENDING';
        }
      }
    } catch (_memErr) {
      // ignore
    }

    // Log status transition
    try {
      await OrderStatusLog.create({
        orderId: order.id,
        status: 'PENDING',
        note: `Online payment verified via Stripe. Payment Intent ID: ${paymentIntentId}`,
      });
    } catch (_logErr) {
      console.warn('Non-blocking OrderStatusLog creation error:', _logErr.message);
    }

    // Trigger auto thermal print to kitchen
    getOrderById(order.id).then((fullOrder) => {
      if (fullOrder) {
        autoPrintKitchenReceipt(fullOrder).catch((err) => {
          console.error('Failed auto kitchen print after in-modal stripe payment:', err);
        });
      }
    }).catch((err) => console.error('Error fetching full order for print:', err));

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Confirm in-modal payment error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order payment status' },
      { status: 500 }
    );
  }
}
