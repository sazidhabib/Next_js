import bcrypt from 'bcryptjs';
import {
  sequelize,
  User,
  Restaurant,
  UserRestaurantRole,
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
  Invoice,
  InvoiceTemplate,
} from './sequelize.js';
export async function seedDatabaseWithoutForce() {
  // 2. Hash default password
  const passwordHash = await bcrypt.hash('password123', 10);

  // 3. Create Users
  const superAdmin = await User.create({
    name: 'Alexander Rossi (Super Admin)',
    email: 'admin@foodplatform.com',
    passwordHash,
    role: 'SUPER_ADMIN',
    phone: '+1 (555) 010-9999',
  });

  const restaurantAdmin = await User.create({
    name: 'Chef Marco Bellini',
    email: 'owner@bellavista.com',
    passwordHash,
    role: 'RESTAURANT_ADMIN',
    phone: '+1 (555) 012-3456',
  });

  const staffOperator = await User.create({
    name: 'Sofia Kitchen Manager',
    email: 'staff@bellavista.com',
    passwordHash,
    role: 'STAFF_OPERATOR',
    phone: '+1 (555) 014-7890',
  });

  const customerUser = await User.create({
    name: 'Emma Watson',
    email: 'customer@example.com',
    passwordHash,
    role: 'CUSTOMER',
    phone: '+1 (555) 019-8765',
  });

  console.log('👤 Users created successfully.');

  // 4. Create Restaurant: Bella Vista Gourmet Kitchen & Pizzeria
  const restaurant = await Restaurant.create({
    name: 'Bella Vista Gourmet Kitchen & Pizzeria',
    slug: 'bellavista-pizza',
    description: 'Authentic stone-oven Neapolitan pizzas, artisan smashed burgers, fresh handmade pastas and handcrafted Italian dolci. Voted #1 Downtown Dining Experience.',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    email: 'contact@bellavistapizzeria.com',
    address: '742 Evergreen Terrace, Downtown Gourmet Plaza, San Francisco, CA 94103',
    latitude: 37.7749,
    longitude: -122.4194,
    currency: 'USD',
    currencySymbol: '$',
    taxRatePercent: 8.5,
    enableDelivery: true,
    enablePickup: true,
    enableDineIn: true,
    autoAcceptOrders: false,
    estimatedPrepTime: 25,
    isActive: true,
  });

  // Assign roles
  await UserRestaurantRole.bulkCreate([
    { userId: restaurantAdmin.id, restaurantId: restaurant.id, role: 'RESTAURANT_ADMIN' },
    { userId: staffOperator.id, restaurantId: restaurant.id, role: 'STAFF_OPERATOR' },
  ]);

  console.log('🍕 Restaurant created:', restaurant.name);

  // Create Default Invoice Templates
  const customerTemplate = await InvoiceTemplate.create({
    restaurantId: restaurant.id,
    name: 'Default Client Receipt',
    type: 'CUSTOMER',
    fontSize: 12,
    config: JSON.stringify({
      paymentMethod: true,
      time: true,
      estimatedDriveTime: true,
      direction: true,
      onPremiseNumber: true,
      orderDetails: true,
      clientInfo: true,
      clientComment: true,
      items: true,
      isPaid: true,
      orderOnline: true,
      contactDetails: true,
      infoBox1: false,
      infoBox2: false,
      infoBox3: false,
      clientConfirmation: false,
    }),
  });

  const kitchenTemplate = await InvoiceTemplate.create({
    restaurantId: restaurant.id,
    name: 'Default Kitchen Essentials',
    type: 'KITCHEN',
    fontSize: 12,
    config: JSON.stringify({
      header: true,
      onPremiseNumber: true,
      orderDetails: true,
      clientComment: true,
      items: true,
      isPaid: true,
      packagingStationQualityControl: false,
      previewOptions: true,
      ticketHolderSpace: true,
    }),
  });

  // Update restaurant with active templates
  await restaurant.update({
    activeCustomerTemplateId: customerTemplate.id,
    activeKitchenTemplateId: kitchenTemplate.id,
  });

  console.log('📄 Default invoice templates created and assigned.');

  // 5. Operating Hours
  const days = [0, 1, 2, 3, 4, 5, 6];
  for (const day of days) {
    await OperatingHour.create({
      restaurantId: restaurant.id,
      dayOfWeek: day,
      openTime: '10:30',
      closeTime: '23:00',
      serviceType: 'DELIVERY',
      isClosed: false,
    });
  }

  // 6. Delivery Zones
  const zone1 = await DeliveryZone.create({
    restaurantId: restaurant.id,
    name: 'Zone 1: Downtown & Financial District (0-3 km)',
    zoneType: 'RADIUS',
    radiusKm: 3.0,
    minOrderAmount: 15.0,
    deliveryFee: 2.99,
    freeDeliveryThreshold: 40.0,
    estimatedTimeMin: 25,
    isActive: true,
  });

  const zone2 = await DeliveryZone.create({
    restaurantId: restaurant.id,
    name: 'Zone 2: Midtown & Waterfront (3-7 km)',
    zoneType: 'RADIUS',
    radiusKm: 7.0,
    minOrderAmount: 25.0,
    deliveryFee: 4.99,
    freeDeliveryThreshold: 55.0,
    estimatedTimeMin: 40,
    isActive: true,
  });

  const zone3 = await DeliveryZone.create({
    restaurantId: restaurant.id,
    name: 'Zone 3: Outer Suburbs & Heights (7-12 km)',
    zoneType: 'RADIUS',
    radiusKm: 12.0,
    minOrderAmount: 35.0,
    deliveryFee: 7.99,
    freeDeliveryThreshold: 80.0,
    estimatedTimeMin: 55,
    isActive: true,
  });

  console.log('📍 Delivery zones configured.');

  // 7. Option / Modifier Groups
  const pizzaSizeGroup = await OptionGroup.create({
    restaurantId: restaurant.id,
    name: 'Select Pizza Size',
    minSelections: 1,
    maxSelections: 1,
  });
  await OptionItem.bulkCreate([
    { optionGroupId: pizzaSizeGroup.id, name: 'Medium 12" (6 Slices)', price: 0.0, isDefault: true, displayOrder: 1 },
    { optionGroupId: pizzaSizeGroup.id, name: 'Large 14" (8 Slices)', price: 4.5, isDefault: false, displayOrder: 2 },
    { optionGroupId: pizzaSizeGroup.id, name: 'Family Grand 18" (12 Slices)', price: 9.5, isDefault: false, displayOrder: 3 },
  ]);

  const crustGroup = await OptionGroup.create({
    restaurantId: restaurant.id,
    name: 'Crust Choice',
    minSelections: 1,
    maxSelections: 1,
  });
  await OptionItem.bulkCreate([
    { optionGroupId: crustGroup.id, name: 'Traditional Neapolitan Stone Crust', price: 0.0, isDefault: true, displayOrder: 1 },
    { optionGroupId: crustGroup.id, name: 'Thin & Crispy Roman Style', price: 0.0, isDefault: false, displayOrder: 2 },
    { optionGroupId: crustGroup.id, name: 'Stuffed Garlic & Mozzarella Crust', price: 3.0, isDefault: false, displayOrder: 3 },
    { optionGroupId: crustGroup.id, name: 'Gluten-Free Cauliflower Crust', price: 4.0, isDefault: false, displayOrder: 4 },
  ]);

  const extraToppingsGroup = await OptionGroup.create({
    restaurantId: restaurant.id,
    name: 'Extra Gourmet Toppings',
    minSelections: 0,
    maxSelections: 6,
  });
  await OptionItem.bulkCreate([
    { optionGroupId: extraToppingsGroup.id, name: 'Extra Buffalo Mozzarella D.O.P', price: 2.5, displayOrder: 1 },
    { optionGroupId: extraToppingsGroup.id, name: 'Artisan Spicy Pepperoni', price: 2.75, displayOrder: 2 },
    { optionGroupId: extraToppingsGroup.id, name: 'Prosciutto di Parma Riserva', price: 3.5, displayOrder: 3 },
    { optionGroupId: extraToppingsGroup.id, name: 'Wild Truffle Cremini Mushrooms', price: 2.25, displayOrder: 4 },
    { optionGroupId: extraToppingsGroup.id, name: 'Spicy Calabrian Chili Crunch', price: 1.25, displayOrder: 5 },
    { optionGroupId: extraToppingsGroup.id, name: 'Fresh Sweet Basil & EVOO Drizzle', price: 0.75, displayOrder: 6 },
  ]);

  const burgerDonenessGroup = await OptionGroup.create({
    restaurantId: restaurant.id,
    name: 'Meat Doneness & Temperature',
    minSelections: 1,
    maxSelections: 1,
  });
  await OptionItem.bulkCreate([
    { optionGroupId: burgerDonenessGroup.id, name: 'Medium Pink (Juicy)', price: 0.0, isDefault: true, displayOrder: 1 },
    { optionGroupId: burgerDonenessGroup.id, name: 'Medium Well', price: 0.0, isDefault: false, displayOrder: 2 },
    { optionGroupId: burgerDonenessGroup.id, name: 'Well Done (Charred)', price: 0.0, isDefault: false, displayOrder: 3 },
  ]);

  const burgerAddonsGroup = await OptionGroup.create({
    restaurantId: restaurant.id,
    name: 'Burger Boosters & Sides',
    minSelections: 0,
    maxSelections: 4,
  });
  await OptionItem.bulkCreate([
    { optionGroupId: burgerAddonsGroup.id, name: 'Thick Applewood Smoked Bacon', price: 2.5, displayOrder: 1 },
    { optionGroupId: burgerAddonsGroup.id, name: 'Aged White Truffle Cheddar', price: 1.75, displayOrder: 2 },
    { optionGroupId: burgerAddonsGroup.id, name: 'Crispy Sunny-Side Organic Fried Egg', price: 1.5, displayOrder: 3 },
    { optionGroupId: burgerAddonsGroup.id, name: 'Double Meat Patty (Extra 1/3 lb Angus)', price: 4.5, displayOrder: 4 },
  ]);

  console.log('⚙️ Modifier groups created.');

  // 8. Categories & Menu Items
  // Category 1: Pizzas
  const catPizzas = await Category.create({
    restaurantId: restaurant.id,
    name: 'Artisan Wood-Fired Pizzas',
    description: 'Slow-fermented 48-hour sourdough dough, hand-stretched and fired in our 900°F Marra Forni volcanic stone oven.',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    displayOrder: 1,
  });

  const pizzas = await MenuItem.bulkCreate([
    {
      categoryId: catPizzas.id,
      name: 'Margherita D.O.P. Classica',
      description: 'San Marzano tomatoes, Campania buffalo mozzarella, fresh sweet basil, fleur de sel, cold-pressed olive oil.',
      imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop&q=80',
      basePrice: 16.99,
      dietaryTags: 'Vegetarian,Popular',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      categoryId: catPizzas.id,
      name: 'Diavola Piccante & Hot Honey',
      description: 'Spicy Calabrian salami, smoked provolone, roasted red chili peppers, fresh oregano, hot infused chili blossom honey.',
      imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
      basePrice: 19.5,
      dietaryTags: 'Spicy,Chef Special',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      categoryId: catPizzas.id,
      name: 'Black Truffle & Wild Forest Mushroom',
      description: 'White garlic truffle cream base, fontina cheese, sautéed cremini & shiitake mushrooms, thyme, white truffle oil.',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
      basePrice: 21.0,
      dietaryTags: 'Vegetarian,Gourmet',
      isFeatured: true,
      displayOrder: 3,
    },
    {
      categoryId: catPizzas.id,
      name: 'Prosciutto San Daniele & Arugula',
      description: 'Crispy mozzarella base topped fresh out of the oven with 24-month aged Prosciutto, organic baby wild arugula, shaved parmigiano reggiano.',
      imageUrl: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80',
      basePrice: 22.5,
      dietaryTags: 'Premium',
      isFeatured: false,
      displayOrder: 4,
    },
  ]);

  // Link Pizza items to Pizza modifiers
  for (const item of pizzas) {
    await MenuItemOptionGroup.bulkCreate([
      { menuItemId: item.id, optionGroupId: pizzaSizeGroup.id, displayOrder: 1 },
      { menuItemId: item.id, optionGroupId: crustGroup.id, displayOrder: 2 },
      { menuItemId: item.id, optionGroupId: extraToppingsGroup.id, displayOrder: 3 },
    ]);
  }

  // Category 2: Gourmet Smash Burgers
  const catBurgers = await Category.create({
    restaurantId: restaurant.id,
    name: 'Gourmet Smashed Burgers & Sandwiches',
    description: 'Double-seared custom blend Certified Angus Beef on toasted golden brioche buns, served with homemade signature dipping sauces.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    displayOrder: 2,
  });

  const burgers = await MenuItem.bulkCreate([
    {
      categoryId: catBurgers.id,
      name: 'The Bella Vista Truffle Smokehouse Smash',
      description: 'Double smashed Angus patties, crispy onion strings, smoked gouda, truffle garlic aioli, butter brioche bun.',
      imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
      basePrice: 17.5,
      dietaryTags: 'Bestseller,Halal',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      categoryId: catBurgers.id,
      name: 'Crispy Nashville Hot Honey Chicken Crunch',
      description: 'Buttermilk 24h marinated chicken thigh, spicy cayenne honey glaze, house dill pickles, cool garlic slaw.',
      imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
      basePrice: 16.25,
      dietaryTags: 'Spicy,Popular',
      isFeatured: true,
      displayOrder: 2,
    },
    {
      categoryId: catBurgers.id,
      name: 'Beyond Truffle Herb Plant Burger',
      description: 'Plant-based 100% vegan patty, dairy-free smoked provolone, avocado smash, arugula, tomato on potato bun.',
      imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
      basePrice: 16.99,
      dietaryTags: 'Vegan,Vegetarian',
      isFeatured: false,
      displayOrder: 3,
    },
  ]);

  for (const item of burgers) {
    await MenuItemOptionGroup.bulkCreate([
      { menuItemId: item.id, optionGroupId: burgerDonenessGroup.id, displayOrder: 1 },
      { menuItemId: item.id, optionGroupId: burgerAddonsGroup.id, displayOrder: 2 },
    ]);
  }

  // Category 3: Fresh Handmade Pasta
  const catPastas = await Category.create({
    restaurantId: restaurant.id,
    name: 'Fresh Handmade Pasta Fresca',
    description: 'Extruded daily using 100% Italian semolina rimacinata and organic pasture-raised egg yolks.',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    displayOrder: 3,
  });

  await MenuItem.bulkCreate([
    {
      categoryId: catPastas.id,
      name: 'Rigatoni Bolognese Tradizionale',
      description: 'Slow-braised 8-hour beef & veal ragù, San Marzano tomatoes, fresh rosemary, aged 24-month Parmigiano Reggiano.',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=600&auto=format&fit=crop&q=80',
      basePrice: 19.75,
      dietaryTags: 'Popular,Chef Special',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      categoryId: catPastas.id,
      name: 'Truffle & Porcini Wild Ravioli',
      description: 'Stuffed with ricotta and black summer truffles, tossed in creamy sage brown butter sauce with toasted hazelnuts.',
      imageUrl: 'https://images.unsplash.com/photo-1587740908075-9e245070dfaa?w=600&auto=format&fit=crop&q=80',
      basePrice: 22.0,
      dietaryTags: 'Vegetarian,Gourmet',
      isFeatured: false,
      displayOrder: 2,
    },
  ]);

  // Category 4: Starters & Sides
  const catSides = await Category.create({
    restaurantId: restaurant.id,
    name: 'Antipasti & Crispy Sides',
    description: 'Irresistible bites to start your feast or accompany your mains.',
    imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80',
    displayOrder: 4,
  });

  await MenuItem.bulkCreate([
    {
      categoryId: catSides.id,
      name: 'Truffle Parmesan Hand-Cut Fries',
      description: 'Double-fried Idaho potatoes tossed in white truffle essence, sea salt flakes, and aged parmesan with herb aioli dip.',
      imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
      basePrice: 8.5,
      dietaryTags: 'Vegetarian,Popular',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      categoryId: catSides.id,
      name: 'Crispy Calamari Fritti & Lemon Aioli',
      description: 'Flash-fried tender Rhode Island calamari rings, charred lemon cheek, homemade smoked paprika aioli.',
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
      basePrice: 13.5,
      dietaryTags: 'Seafood',
      isFeatured: false,
      displayOrder: 2,
    },
    {
      categoryId: catSides.id,
      name: 'Garlic Herb & Rosemary Focaccia Bites',
      description: 'Fresh out of the wood oven, infused with confit garlic cloves, fresh rosemary sprigs, and olive tapenade.',
      imageUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
      basePrice: 7.0,
      dietaryTags: 'Vegan,Vegetarian',
      isFeatured: false,
      displayOrder: 3,
    },
  ]);

  // Category 5: Dolci / Desserts & Drinks
  const catDolci = await Category.create({
    restaurantId: restaurant.id,
    name: 'Dolci & Handcrafted Beverages',
    description: 'Sweet finishes and refreshing sparkling Italian sodas.',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
    displayOrder: 5,
  });

  await MenuItem.bulkCreate([
    {
      categoryId: catDolci.id,
      name: 'Classic Venetian Tiramisù al Mascarpone',
      description: 'Savoiardi ladyfingers soaked in espresso & Marsala wine, layered with velvety whipped mascarpone cream and Valrhona cocoa.',
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
      basePrice: 9.5,
      dietaryTags: 'Vegetarian,Bestseller',
      isFeatured: true,
      displayOrder: 1,
    },
    {
      categoryId: catDolci.id,
      name: 'Sicilian Pistachio Cannoli (2 pcs)',
      description: 'Crispy cinnamon pastry tubes piped with sweet sheep ricotta and crushed Bronte pistachios.',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
      basePrice: 8.0,
      dietaryTags: 'Vegetarian',
      isFeatured: false,
      displayOrder: 2,
    },
    {
      categoryId: catDolci.id,
      name: 'San Pellegrino Sparkling Limonata (330ml)',
      description: 'Craft sparkling Sicilian lemon soda.',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
      basePrice: 3.75,
      dietaryTags: 'Refreshing',
      isFeatured: false,
      displayOrder: 3,
    },
  ]);

  console.log('📋 All categories and dishes seeded.');

  // 9. Create Sample Orders for testing the Order Receiver & Invoices
  await Order.create(
    {
      orderNumber: '#BV-80124',
      restaurantId: restaurant.id,
      userId: customerUser.id,
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      customerPhone: '+1 (555) 789-0123',
      orderType: 'DELIVERY',
      status: 'PENDING',
      deliveryAddress: '450 Mission Street, Apt 14B, San Francisco, CA 94105',
      deliveryZoneId: zone1.id,
      specialNotes: 'Please ring bell 14B and leave on door mat. Extra napkins appreciated!',
      subtotal: 41.99,
      taxAmount: 3.57,
      deliveryFee: 2.99,
      discountAmount: 0.0,
      totalAmount: 48.55,
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'UNPAID',
      items: [
        {
          itemName: 'Margherita D.O.P. Classica',
          itemPrice: 16.99,
          quantity: 1,
          itemTotal: 21.49,
          selectedOptions: [
            { groupName: 'Select Pizza Size', optionName: 'Large 14" (8 Slices)', optionPrice: 4.5 },
            { groupName: 'Crust Choice', optionName: 'Traditional Neapolitan Stone Crust', optionPrice: 0.0 },
          ],
        },
        {
          itemName: 'The Bella Vista Truffle Smokehouse Smash',
          itemPrice: 17.5,
          quantity: 1,
          itemTotal: 20.0,
          selectedOptions: [
            { groupName: 'Meat Doneness & Temperature', optionName: 'Medium Pink (Juicy)', optionPrice: 0.0 },
            { groupName: 'Burger Boosters & Sides', optionName: 'Thick Applewood Smoked Bacon', optionPrice: 2.5 },
          ],
        },
      ],
      statusLogs: [
        { status: 'PENDING', note: 'Customer submitted new online delivery order.' },
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

  await Order.create(
    {
      orderNumber: '#BV-80120',
      restaurantId: restaurant.id,
      customerName: 'David Miller',
      customerEmail: 'david.m@example.com',
      customerPhone: '+1 (555) 432-8765',
      orderType: 'PICKUP',
      status: 'ACCEPTED',
      acceptedAt: new Date(Date.now() - 10 * 60 * 1000),
      estimatedReadyAt: new Date(Date.now() + 15 * 60 * 1000),
      subtotal: 30.5,
      taxAmount: 2.59,
      deliveryFee: 0.0,
      discountAmount: 0.0,
      totalAmount: 33.09,
      paymentMethod: 'CARD_ONLINE',
      paymentStatus: 'PAID',
      items: [
        {
          itemName: 'Rigatoni Bolognese Tradizionale',
          itemPrice: 19.75,
          quantity: 1,
          itemTotal: 19.75,
        },
        {
          itemName: 'Truffle Parmesan Hand-Cut Fries',
          itemPrice: 8.5,
          quantity: 1,
          itemTotal: 8.5,
        },
      ],
      statusLogs: [
        { status: 'PENDING', note: 'Order placed' },
        { status: 'ACCEPTED', note: 'Kitchen accepted with 25 min prep time' },
      ],
      invoice: {
        invoiceNumber: 'INV-BV-2026-0089',
        restaurantId: restaurant.id,
        subtotal: 30.5,
        taxAmount: 2.59,
        deliveryFee: 0.0,
        totalAmount: 33.09,
        paymentMethod: 'CARD_ONLINE',
        paymentStatus: 'PAID',
      },
    },
    {
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
        {
          model: OrderStatusLog,
          as: 'statusLogs',
        },
        {
          model: Invoice,
          as: 'invoice',
        },
      ],
    }
  );

  console.log('📦 Sample orders & invoices created.');
  console.log('🎉 Seed complete!');
}

export async function seedDatabase() {
  console.log('🌱 Starting database seed via Sequelize...');

  // 1. Clean existing records in reverse dependency order
  try {
    // Drop / Sync tables to ensure clean slate
    await sequelize.sync({ force: true });
    console.log('🧹 Cleaned and synchronized tables.');
  } catch (err) {
    console.log('Note: DB clean/sync skipped:', err.message);
  }

  await seedDatabaseWithoutForce();
}

