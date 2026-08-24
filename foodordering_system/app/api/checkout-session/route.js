import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Get the restaurant's Stripe Secret Key
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: order.restaurantId },
    });

    const stripeSecretKey = restaurant?.stripeSecretKey || process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Online payment is not configured for this restaurant' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map((item) => ({
        price_data: {
          currency: restaurant?.currency?.toLowerCase() || 'usd',
          product_data: {
            name: item.itemName,
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/api/checkout-session?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${request.nextUrl.origin}/order/${order.id}?payment_cancelled=true`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Handle redirect success callback
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: 'Missing session or order ID' }, { status: 400 });
    }

    // Retrieve order and restaurant to get secret key
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: order.restaurantId },
    });

    const stripeSecretKey = restaurant?.stripeSecretKey || process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 400 });
    }

    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update order payment status and status in DB
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'ACCEPTED', // Auto-accept order on paid success
        },
      });

      // Create a status log
      await prisma.orderStatusLog.create({
        data: {
          orderId,
          status: 'ACCEPTED',
          notes: 'Payment verified successfully via Stripe Checkout.',
        },
      });
    }

    // Redirect user to the order tracking page
    return NextResponse.redirect(`${request.nextUrl.origin}/order/${orderId}`);
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}
