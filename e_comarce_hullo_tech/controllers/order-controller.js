const { Order, OrderItem, Product } = require('../models');

// Fallback in-memory orders list in case DB is not available
const fallbackOrders = [];

const createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, totalAmount } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !paymentMethod || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing required order details' });
    }

    if (!Order || !OrderItem) {
      // Database not available, use fallback
      const orderId = fallbackOrders.length + 1;
      const newOrder = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        totalAmount,
        status: 'pending',
        items: items.map((item, index) => ({
          id: index + 1,
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        createdAt: new Date(),
      };
      fallbackOrders.push(newOrder);
      console.log('✅ Created order in fallback mode (in-memory):', newOrder);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (Fallback mode)',
        data: newOrder,
      });
    }

    try {
      // Create order in Sequelize
      const order = await Order.create({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        totalAmount,
        status: 'pending',
      });

      // Create order items
      const orderItemsData = items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await OrderItem.bulkCreate(orderItemsData);

      console.log(`✅ Order ${order.id} saved in database.`);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: {
          id: order.id,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
        },
      });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during order creation, using fallback in-memory order:', dbError.message);
      
      const orderId = fallbackOrders.length + 1;
      const newOrder = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        totalAmount,
        status: 'pending',
        items: items.map((item, index) => ({
          id: index + 1,
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        createdAt: new Date(),
      };
      fallbackOrders.push(newOrder);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully (Fallback mode - DB error)',
        data: newOrder,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    if (!Order || !OrderItem) {
      return res.json({ success: true, data: fallbackOrders });
    }

    try {
      const orders = await Order.findAll({
        include: [{ model: OrderItem, as: 'items' }],
        order: [['id', 'DESC']],
      });
      return res.json({ success: true, data: orders });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during getOrders, using fallback:', dbError.message);
      return res.json({ success: true, data: fallbackOrders });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
};
