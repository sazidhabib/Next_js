import { defaultRestaurant, initialOrders } from './mockData';
import prisma from './prisma';

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
    await prisma.$queryRaw`SELECT 1`;
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
      const resto = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
          categories: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
            include: {
              items: {
                where: { isAvailable: true },
                orderBy: { displayOrder: 'asc' },
                include: {
                  optionGroups: {
                    include: {
                      optionGroup: {
                        include: {
                          items: {
                            orderBy: { displayOrder: 'asc' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          deliveryZones: {
            where: { isActive: true },
          },
          operatingHours: true,
        },
      });

      if (resto) {
        // Format to normalized structure
        return {
          ...resto,
          categories: resto.categories.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              dietaryTags: item.dietaryTags ? item.dietaryTags.split(',') : [],
              optionGroups: item.optionGroups.map((og) => ({
                id: og.optionGroup.id,
                name: og.optionGroup.name,
                minSelections: og.optionGroup.minSelections,
                maxSelections: og.optionGroup.maxSelections,
                items: og.optionGroup.items,
              })),
            })),
          })),
        };
      }
    }
  } catch (err) {
    console.warn('Prisma DB query fallback to memory store:', err.message);
  }

  // Fallback to runtime store
  return globalStore.__restaurantData;
}

// 2. Get All Orders
export async function getOrders(restaurantId = null) {
  try {
    const connected = await isDbConnected();
    if (connected) {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              selectedOptions: true,
            },
          },
          invoice: true,
        },
      });
      if (orders && orders.length > 0) return orders;
    }
  } catch (err) {
    console.warn('Prisma getOrders fallback:', err.message);
  }

  return globalStore.__orders;
}

// 3. Get Single Order by ID or Order Number
export async function getOrderById(idOrOrderNum) {
  try {
    const connected = await isDbConnected();
    if (connected) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ id: idOrOrderNum }, { orderNumber: idOrOrderNum }],
        },
        include: {
          items: {
            include: {
              selectedOptions: true,
            },
          },
          invoice: true,
          statusLogs: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });
      if (order) return order;
    }
  } catch (err) {
    console.warn('Prisma getOrderById fallback:', err.message);
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
      const dbOrder = await prisma.order.create({
        data: {
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
          items: {
            create: newOrder.items.map((it) => ({
              itemName: it.itemName,
              itemPrice: it.itemPrice,
              quantity: it.quantity,
              itemTotal: it.itemTotal,
              specialNotes: it.specialNotes,
              selectedOptions: {
                create: it.selectedOptions.map((opt) => ({
                  groupName: opt.groupName,
                  optionName: opt.optionName,
                  optionPrice: opt.optionPrice,
                })),
              },
            })),
          },
          statusLogs: {
            create: [{ status: 'PENDING', note: 'Customer submitted new order' }],
          },
        },
        include: {
          items: { include: { selectedOptions: true } },
        },
      });

      // Update runtime store as well
      globalStore.__orders.unshift(newOrder);
      return dbOrder;
    }
  } catch (err) {
    console.warn('Prisma createOrder DB insert fallback:', err.message);
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
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          acceptedAt: status === 'ACCEPTED' ? now : undefined,
          estimatedReadyAt: estimatedReadyAt ? new Date(estimatedReadyAt) : undefined,
          rejectionReason: rejectionReason || undefined,
          statusLogs: {
            create: {
              status,
              note:
                status === 'ACCEPTED'
                  ? `Accepted with ${prepMinutes || 25} min prep time`
                  : status === 'REJECTED'
                  ? `Rejected: ${rejectionReason}`
                  : `Order updated to ${status}`,
            },
          },
        },
      });
    }
  } catch (err) {
    console.warn('Prisma updateOrderStatus fallback:', err.message);
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
