import { Op } from 'sequelize';
import { defaultRestaurant, initialOrders } from './mockData';
import {
  sequelize,
  User,
  Restaurant,
  Category,
  MenuItem,
  OptionGroup,
  MenuItemOptionGroup,
  OptionItem,
  DeliveryZone,
  OperatingHour,
  Order,
  OrderItem,
  OrderItemOption,
  OrderStatusLog,
  Invoice
} from './sequelize';

// In-memory runtime cache for fallback and fast real-time synchronization
const globalStore = globalThis;
if (!globalStore.__restaurantData) {
  globalStore.__restaurantData = JSON.parse(JSON.stringify(defaultRestaurant));
}
if (!globalStore.__orders) {
  globalStore.__orders = JSON.parse(JSON.stringify(initialOrders));
}

// Check if database is accessible
export async function isDbConnected() {
  try {
    await sequelize.authenticate();
    return true;
  } catch (err) {
    return false;
  }
}

// 1. Get Restaurant Details and Menu by Slug
export async function getRestaurantBySlug(slug = 'bellavista-pizza') {
  try {
    const connected = await isDbConnected();
    if (connected) {
      const resto = await Restaurant.findOne({
        where: { slug },
        include: [
          {
            model: Category,
            as: 'categories',
            where: { isActive: true },
            required: false,
            include: [
              {
                model: MenuItem,
                as: 'items',
                where: { isAvailable: true },
                required: false,
                include: [
                  {
                    model: MenuItemOptionGroup,
                    as: 'optionGroups',
                    include: [
                      {
                        model: OptionGroup,
                        as: 'optionGroup',
                        include: [
                          {
                            model: OptionItem,
                            as: 'items',
                            required: false,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: DeliveryZone,
            as: 'deliveryZones',
            where: { isActive: true },
            required: false,
          },
          {
            model: OperatingHour,
            as: 'operatingHours',
            required: false,
          },
        ],
      });

      if (resto) {
        const restoJson = resto.get({ plain: true });

        // Sort relations manually in memory to ensure correct order
        if (restoJson.categories) {
          restoJson.categories.sort((a, b) => a.displayOrder - b.displayOrder);
          restoJson.categories.forEach((cat) => {
            if (cat.items) {
              cat.items.sort((a, b) => a.displayOrder - b.displayOrder);
              cat.items.forEach((item) => {
                // Parse dietary tags
                item.dietaryTags = item.dietaryTags ? item.dietaryTags.split(',') : [];

                if (item.optionGroups) {
                  item.optionGroups.sort((a, b) => a.displayOrder - b.displayOrder);
                  // Format option groups to fit expected data structure
                  item.optionGroups = item.optionGroups.map((og) => {
                    const group = og.optionGroup || {};
                    const groupItems = group.items ? [...group.items] : [];
                    groupItems.sort((a, b) => a.displayOrder - b.displayOrder);

                    return {
                      id: group.id,
                      name: group.name,
                      minSelections: group.minSelections,
                      maxSelections: group.maxSelections,
                      items: groupItems,
                    };
                  });
                } else {
                  item.optionGroups = [];
                }
              });
            }
          });
        }

        return restoJson;
      }
    }
  } catch (err) {
    console.warn('Sequelize DB query fallback to memory store:', err.message);
  }

  // Fallback to runtime store
  return globalStore.__restaurantData;
}

// 2. Get All Orders
export async function getOrders(restaurantId = null) {
  try {
    const connected = await isDbConnected();
    if (connected) {
      const where = restaurantId ? { restaurantId } : {};
      const orders = await Order.findAll({
        where,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: OrderItemOption,
                as: 'selectedOptions',
              },
            ],
          },
          {
            model: Invoice,
            as: 'invoice',
          },
        ],
      });
      if (orders && orders.length > 0) {
        return orders.map((o) => o.get({ plain: true }));
      }
    }
  } catch (err) {
    console.warn('Sequelize getOrders fallback:', err.message);
  }

  return globalStore.__orders;
}

// 3. Get Single Order by ID or Order Number
export async function getOrderById(idOrOrderNum) {
  try {
    const connected = await isDbConnected();
    if (connected) {
      const order = await Order.findOne({
        where: {
          [Op.or]: [{ id: idOrOrderNum }, { orderNumber: idOrOrderNum }],
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: OrderItemOption,
                as: 'selectedOptions',
              },
            ],
          },
          {
            model: Invoice,
            as: 'invoice',
          },
          {
            model: OrderStatusLog,
            as: 'statusLogs',
          },
        ],
      });
      if (order) {
        const orderJson = order.get({ plain: true });
        if (orderJson.statusLogs) {
          orderJson.statusLogs.sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );
        }
        return orderJson;
      }
    }
  } catch (err) {
    console.warn('Sequelize getOrderById fallback:', err.message);
  }

  return (
    globalStore.__orders.find(
      (o) => o.id === idOrOrderNum || o.orderNumber === idOrOrderNum
    ) || null
  );
}

// 4. Create New Customer Order
export async function createOrder(orderPayload) {
  const generatedOrderNum = `#BV-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderId = `ord-${Date.now()}`;

  const newOrder = {
    id: orderId,
    orderNumber: generatedOrderNum,
    restaurantId: orderPayload.restaurantId || 'resto-bella-vista-001',
    customerName: orderPayload.customerName,
    customerEmail: orderPayload.customerEmail,
    customerPhone: orderPayload.customerPhone,
    orderType: orderPayload.orderType || 'DELIVERY',
    status: 'PENDING',
    deliveryAddress: orderPayload.deliveryAddress || null,
    deliveryZoneName: orderPayload.deliveryZoneName || 'Standard Delivery',
    specialNotes: orderPayload.specialNotes || '',
    subtotal: Number(orderPayload.subtotal.toFixed(2)),
    taxAmount: Number(orderPayload.taxAmount.toFixed(2)),
    deliveryFee: Number(orderPayload.deliveryFee.toFixed(2)),
    discountAmount: Number((orderPayload.discountAmount || 0).toFixed(2)),
    totalAmount: Number(orderPayload.totalAmount.toFixed(2)),
    paymentMethod: orderPayload.paymentMethod || 'CASH_ON_DELIVERY',
    paymentStatus: orderPayload.paymentMethod === 'CARD_ONLINE' ? 'PAID' : 'UNPAID',
    scheduledFor: orderPayload.scheduledFor || null,
    createdAt: new Date().toISOString(),
    items: orderPayload.items.map((item, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      itemName: item.name,
      itemPrice: item.basePrice,
      quantity: item.quantity,
      itemTotal: Number((item.itemTotal * item.quantity).toFixed(2)),
      specialNotes: item.specialNotes || '',
      selectedOptions: (item.selectedOptions || []).map((opt) => ({
        groupName: opt.groupName,
        optionName: opt.optionName,
        optionPrice: opt.optionPrice,
      })),
    })),
  };

  // Try DB persistence
  try {
    const connected = await isDbConnected();
    if (connected) {
      const dbOrder = await Order.create(
        {
          orderNumber: newOrder.orderNumber,
          restaurantId: newOrder.restaurantId,
          customerName: newOrder.customerName,
          customerEmail: newOrder.customerEmail,
          customerPhone: newOrder.customerPhone,
          orderType: newOrder.orderType,
          status: newOrder.status,
          deliveryAddress: newOrder.deliveryAddress,
          specialNotes: newOrder.specialNotes,
          subtotal: newOrder.subtotal,
          taxAmount: newOrder.taxAmount,
          deliveryFee: newOrder.deliveryFee,
          discountAmount: newOrder.discountAmount,
          totalAmount: newOrder.totalAmount,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          items: newOrder.items.map((it) => ({
            itemName: it.itemName,
            itemPrice: it.itemPrice,
            quantity: it.quantity,
            itemTotal: it.itemTotal,
            specialNotes: it.specialNotes,
            selectedOptions: it.selectedOptions.map((opt) => ({
              groupName: opt.groupName,
              optionName: opt.optionName,
              optionPrice: opt.optionPrice,
            })),
          })),
          statusLogs: [
            { status: 'PENDING', note: 'Customer submitted new order' },
          ],
        },
        {
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [
                {
                  model: OrderItemOption,
                  as: 'selectedOptions',
                },
              ],
            },
            {
              model: OrderStatusLog,
              as: 'statusLogs',
            },
          ],
        }
      );

      // Update runtime store as well
      globalStore.__orders.unshift(newOrder);
      return dbOrder.get({ plain: true });
    }
  } catch (err) {
    console.warn('Sequelize createOrder DB insert fallback:', err.message);
  }

  // Prepend to runtime store
  globalStore.__orders.unshift(newOrder);
  return newOrder;
}

// 5. Update Order Status (GloriaFood-style Actions: ACCEPT, REJECT, PREPARE, COMPLETE)
export async function updateOrderStatus(orderId, { status, prepMinutes, rejectionReason }) {
  const now = new Date();
  let estimatedReadyAt = null;

  if (prepMinutes) {
    estimatedReadyAt = new Date(now.getTime() + prepMinutes * 60 * 1000).toISOString();
  }

  // Check runtime memory
  const orderIndex = globalStore.__orders.findIndex(
    (o) => o.id === orderId || o.orderNumber === orderId
  );

  if (orderIndex !== -1) {
    const existing = globalStore.__orders[orderIndex];
    existing.status = status;
    if (status === 'ACCEPTED') {
      existing.acceptedAt = now.toISOString();
      existing.estimatedReadyAt = estimatedReadyAt;
      existing.prepMinutes = prepMinutes;
    } else if (status === 'REJECTED') {
      existing.rejectionReason = rejectionReason || 'Kitchen currently unavailable';
    }

    // Auto-generate invoice upon completion or acceptance if paid
    if (status === 'ACCEPTED' || status === 'COMPLETED') {
      if (!existing.invoiceNumber) {
        existing.invoiceNumber = `INV-BV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }
  }

  // Also update MySQL if connected
  try {
    const connected = await isDbConnected();
    if (connected) {
      const updateData = { status };
      if (status === 'ACCEPTED') {
        updateData.acceptedAt = now;
        if (estimatedReadyAt) {
          updateData.estimatedReadyAt = new Date(estimatedReadyAt);
        }
      }
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      await Order.update(updateData, {
        where: { id: orderId },
      });

      await OrderStatusLog.create({
        orderId,
        status,
        note:
          status === 'ACCEPTED'
            ? `Accepted with ${prepMinutes || 25} min prep time`
            : status === 'REJECTED'
            ? `Rejected: ${rejectionReason}`
            : `Order updated to ${status}`,
      });
    }
  } catch (err) {
    console.warn('Sequelize updateOrderStatus fallback:', err.message);
  }

  return globalStore.__orders[orderIndex] || null;
}

// 6. Menu Management: Update Item Availability & Add New Item
export function toggleItemAvailability(itemId) {
  for (const cat of globalStore.__restaurantData.categories) {
    for (const item of cat.items) {
      if (item.id === itemId) {
        item.isAvailable = !item.isAvailable;
        return item;
      }
    }
  }
  return null;
}

export function addMenuItem(categoryId, itemData) {
  const cat = globalStore.__restaurantData.categories.find((c) => c.id === categoryId);
  if (!cat) return null;

  const newItem = {
    id: `item-${Date.now()}`,
    name: itemData.name,
    description: itemData.description || '',
    imageUrl:
      itemData.imageUrl ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    basePrice: Number(itemData.basePrice),
    dietaryTags: itemData.dietaryTags || [],
    isFeatured: itemData.isFeatured || false,
    isAvailable: true,
    optionGroups: itemData.optionGroups || [],
  };

  cat.items.push(newItem);
  return newItem;
}

export function updateDeliveryZone(zoneId, zoneData) {
  const zoneIndex = globalStore.__restaurantData.deliveryZones.findIndex(
    (z) => z.id === zoneId
  );
  if (zoneIndex !== -1) {
    globalStore.__restaurantData.deliveryZones[zoneIndex] = {
      ...globalStore.__restaurantData.deliveryZones[zoneIndex],
      ...zoneData,
    };
    return globalStore.__restaurantData.deliveryZones[zoneIndex];
  }
  return null;
}
