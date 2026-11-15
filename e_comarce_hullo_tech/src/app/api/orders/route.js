import { NextResponse } from 'next/server';
import { Order, OrderItem, Product } from '@/lib/db';
import { verifyAdmin } from '@/lib/api-auth';
import notificationDispatcher from '../../../../utils/notification-dispatcher';

const sendOrderNotification = (notificationDispatcher && notificationDispatcher.sendOrderNotification) ||
  (notificationDispatcher && notificationDispatcher.default && notificationDispatcher.default.sendOrderNotification) ||
  (() => {});

let memoryOrders = [];

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const auth = await verifyAdmin(request);
      if (!auth.authorized) {
        return NextResponse.json({ success: false, message: auth.error }, { status: auth.status });
      }
    }

    if (!Order || !OrderItem) {
      return NextResponse.json({ success: true, data: memoryOrders });
    }

    try {
      const orders = await Order.findAll({
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name']
          }]
        }],
        order: [['id', 'DESC']]
      });
      const data = orders.map(o => o.toJSON ? o.toJSON() : o);
      return NextResponse.json({ success: true, data });
    } catch (dbErr) {
      console.warn('⚠️ DB query error during orders GET:', dbErr.message);
      return NextResponse.json({ success: true, data: memoryOrders });
    }
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ success: true, data: memoryOrders });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, totalAmount, deliveryCharge } = body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !paymentMethod || !items || !items.length) {
      return NextResponse.json({ success: false, message: 'Missing required order details' }, { status: 400 });
    }

    if (!Order || !OrderItem) {
      const orderId = memoryOrders.length + 1;
      const newOrder = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        totalAmount,
        deliveryCharge: deliveryCharge || 120.0,
        status: 'pending',
        items: items.map((item, index) => ({
          id: index + 1,
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        createdAt: new Date()
      };
      memoryOrders.unshift(newOrder);
      sendOrderNotification(newOrder);
      return NextResponse.json({
        success: true,
        message: 'Order placed successfully',
        data: newOrder
      }, { status: 201 });
    }

    try {
      const order = await Order.create({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        totalAmount,
        deliveryCharge: deliveryCharge || 120.0,
        status: 'pending'
      });

      const orderItemsData = items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      await OrderItem.bulkCreate(orderItemsData);
      sendOrderNotification(order);

      return NextResponse.json({
        success: true,
        message: 'Order placed successfully',
        data: {
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          totalAmount: order.totalAmount,
          deliveryCharge: order.deliveryCharge,
          items: orderItemsData,
          createdAt: order.createdAt
        }
      }, { status: 201 });
    } catch (dbErr) {
      console.warn('⚠️ DB write error during order POST:', dbErr.message);
      const orderId = memoryOrders.length + 1;
      const newOrder = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        totalAmount,
        deliveryCharge: deliveryCharge || 120.0,
        status: 'pending',
        items: items.map((item, index) => ({
          id: index + 1,
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        createdAt: new Date()
      };
      memoryOrders.unshift(newOrder);
      sendOrderNotification(newOrder);
      return NextResponse.json({
        success: true,
        message: 'Order placed successfully',
        data: newOrder
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
