import { Sequelize, DataTypes } from 'sequelize';

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'foodordering_db';
const dbPort = process.env.DB_PORT || process.env.Db_port || '3306';

const connectionString = process.env.DATABASE_URL || `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const globalForSequelize = globalThis;

export const sequelize =
  globalForSequelize.sequelize ||
  new Sequelize(connectionString, {
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true, // Default to having createdAt/updatedAt
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSequelize.sequelize = sequelize;
}

// 1. User Model
export const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'RESTAURANT_ADMIN', 'STAFF_OPERATOR', 'CUSTOMER'),
    defaultValue: 'CUSTOMER',
  },
}, {
  tableName: 'users',
});

// 2. Restaurant Model
export const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bannerUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  currencySymbol: {
    type: DataTypes.STRING,
    defaultValue: '$',
  },
  taxRatePercent: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  enableDelivery: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enablePickup: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enableDineIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  enableCash: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enableCard: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  enableOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stripePublishableKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stripeSecretKey: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  autoAcceptOrders: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  estimatedPrepTime: {
    type: DataTypes.INTEGER,
    defaultValue: 25,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  activeCustomerTemplateId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  activeKitchenTemplateId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kitchenPrinterIp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kitchenPrinterPort: {
    type: DataTypes.INTEGER,
    defaultValue: 9100,
  },
}, {
  tableName: 'restaurants',
});

// 3. UserRestaurantRole Model
export const UserRestaurantRole = sequelize.define('UserRestaurantRole', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'RESTAURANT_ADMIN', 'STAFF_OPERATOR', 'CUSTOMER'),
    allowNull: false,
  },
}, {
  tableName: 'user_restaurant_roles',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'restaurantId'],
    },
  ],
});

// 4. Category Model
export const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'categories',
  timestamps: false,
});

// 5. MenuItem Model
export const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  basePrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dietaryTags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'menu_items',
  timestamps: false,
});

// 6. OptionGroup Model
export const OptionGroup = sequelize.define('OptionGroup', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minSelections: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maxSelections: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'option_groups',
  timestamps: false,
});

// 7. MenuItemOptionGroup Model
export const MenuItemOptionGroup = sequelize.define('MenuItemOptionGroup', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  menuItemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionGroupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'menu_item_option_groups',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['menuItemId', 'optionGroupId'],
    },
  ],
});

// 8. OptionItem Model
export const OptionItem = sequelize.define('OptionItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  optionGroupId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'option_items',
  timestamps: false,
});

// 9. DeliveryZone Model
export const DeliveryZone = sequelize.define('DeliveryZone', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zoneType: {
    type: DataTypes.STRING,
    defaultValue: 'RADIUS',
  },
  radiusKm: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  polygonGeoJson: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  postalCodes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  minOrderAmount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  deliveryFee: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  freeDeliveryThreshold: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  estimatedTimeMin: {
    type: DataTypes.INTEGER,
    defaultValue: 35,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'delivery_zones',
  timestamps: false,
});

// 10. OperatingHour Model
export const OperatingHour = sequelize.define('OperatingHour', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  openTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  closeTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serviceType: {
    type: DataTypes.ENUM('DELIVERY', 'PICKUP', 'DINE_IN'),
    defaultValue: 'DELIVERY',
  },
  isClosed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'operating_hours',
  timestamps: false,
});

// 11. Order Model
export const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderType: {
    type: DataTypes.ENUM('DELIVERY', 'PICKUP', 'DINE_IN'),
    defaultValue: 'DELIVERY',
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'REJECTED', 'CANCELLED'),
    defaultValue: 'PENDING',
  },
  deliveryAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deliveryLat: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  deliveryLng: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  deliveryZoneId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  specialNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  taxAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  deliveryFee: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  discountAmount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('CASH_ON_DELIVERY', 'CASH_ON_PICKUP', 'CARD_ONLINE', 'CARD_ON_DELIVERY', 'CARD_ON_PICKUP'),
    defaultValue: 'CASH_ON_DELIVERY',
  },
  paymentStatus: {
    type: DataTypes.ENUM('UNPAID', 'PAID', 'REFUNDED'),
    defaultValue: 'UNPAID',
  },
  scheduledFor: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  estimatedReadyAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  prepMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'orders',
});

// 12. OrderItem Model
export const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  menuItemId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  itemTotal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  specialNotes: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'order_items',
  timestamps: false,
});

// 13. OrderItemOption Model
export const OrderItemOption = sequelize.define('OrderItemOption', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  orderItemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionItemId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optionPrice: {
    type: DataTypes.DOUBLE,
    defaultValue: 0.0,
  },
}, {
  tableName: 'order_item_options',
  timestamps: false,
});

// 14. OrderStatusLog Model
export const OrderStatusLog = sequelize.define('OrderStatusLog', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'REJECTED', 'CANCELLED'),
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'order_status_logs',
  timestamps: false,
});

// 15. Invoice Model
export const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  taxAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  deliveryFee: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('CASH_ON_DELIVERY', 'CASH_ON_PICKUP', 'CARD_ONLINE', 'CARD_ON_DELIVERY', 'CARD_ON_PICKUP'),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('UNPAID', 'PAID', 'REFUNDED'),
    allowNull: false,
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  issuedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'invoices',
  timestamps: false,
});

// 16. InvoiceTemplate Model
export const InvoiceTemplate = sequelize.define('InvoiceTemplate', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  restaurantId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fontSize: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
  },
  config: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'invoice_templates',
});

// ASSOCIATIONS

// UserRestaurantRole relations
User.hasMany(UserRestaurantRole, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'restaurantRoles' });
UserRestaurantRole.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Restaurant.hasMany(UserRestaurantRole, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
UserRestaurantRole.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Category relations
Restaurant.hasMany(Category, { foreignKey: 'restaurantId', onDelete: 'CASCADE', as: 'categories' });
Category.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Category.hasMany(MenuItem, { foreignKey: 'categoryId', onDelete: 'CASCADE', as: 'items' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// MenuItemOptionGroup relations
MenuItem.hasMany(MenuItemOptionGroup, { foreignKey: 'menuItemId', onDelete: 'CASCADE', as: 'optionGroups' });
MenuItemOptionGroup.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

OptionGroup.hasMany(MenuItemOptionGroup, { foreignKey: 'optionGroupId', onDelete: 'CASCADE' });
MenuItemOptionGroup.belongsTo(OptionGroup, { foreignKey: 'optionGroupId', as: 'optionGroup' });

// OptionGroup relations
Restaurant.hasMany(OptionGroup, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
OptionGroup.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

OptionGroup.hasMany(OptionItem, { foreignKey: 'optionGroupId', onDelete: 'CASCADE', as: 'items' });
OptionItem.belongsTo(OptionGroup, { foreignKey: 'optionGroupId', as: 'optionGroup' });

// DeliveryZone relations
Restaurant.hasMany(DeliveryZone, { foreignKey: 'restaurantId', onDelete: 'CASCADE', as: 'deliveryZones' });
DeliveryZone.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// OperatingHour relations
Restaurant.hasMany(OperatingHour, { foreignKey: 'restaurantId', onDelete: 'CASCADE', as: 'operatingHours' });
OperatingHour.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Order relations
Restaurant.hasMany(Order, { foreignKey: 'restaurantId' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });
MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId' });

OrderItem.hasMany(OrderItemOption, { foreignKey: 'orderItemId', onDelete: 'CASCADE', as: 'selectedOptions' });
OrderItemOption.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });

OrderItemOption.belongsTo(OptionItem, { foreignKey: 'optionItemId', as: 'optionItem' });
OptionItem.hasMany(OrderItemOption, { foreignKey: 'optionItemId' });

Order.hasMany(OrderStatusLog, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'statusLogs' });
OrderStatusLog.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Order.hasOne(Invoice, { foreignKey: 'orderId', onDelete: 'CASCADE', as: 'invoice' });
Invoice.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Restaurant.hasMany(Invoice, { foreignKey: 'restaurantId' });
Invoice.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

Restaurant.hasMany(InvoiceTemplate, { foreignKey: 'restaurantId', onDelete: 'CASCADE' });
InvoiceTemplate.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

let dbInitPromise = null;

export async function ensureDatabaseReady() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    try {
      console.log('🔄 [DB Init] Checking database tables...');
      // Syncs missing tables, does not drop existing tables
      await sequelize.sync({ force: false });
      console.log('✅ [DB Init] Database tables checked/created.');

      // Ensure new printer fields exist on restaurants table
      try {
        const [results] = await sequelize.query("SHOW COLUMNS FROM restaurants LIKE 'kitchenPrinterIp'");
        if (results.length === 0) {
          console.log('➕ [DB Init] Adding kitchenPrinterIp and kitchenPrinterPort columns to restaurants table...');
          await sequelize.query("ALTER TABLE restaurants ADD COLUMN kitchenPrinterIp VARCHAR(255) NULL");
          await sequelize.query("ALTER TABLE restaurants ADD COLUMN kitchenPrinterPort INT DEFAULT 9100");
          console.log('✅ [DB Init] Columns added.');
        }
      } catch (err) {
        console.warn('⚠️ [DB Init] Warning checking/adding printer columns:', err.message);
      }

      // Ensure prepMinutes exists on orders table
      try {
        const [orderColResults] = await sequelize.query("SHOW COLUMNS FROM orders LIKE 'prepMinutes'");
        if (orderColResults.length === 0) {
          console.log('➕ [DB Init] Adding prepMinutes column to orders table...');
          await sequelize.query("ALTER TABLE orders ADD COLUMN prepMinutes INT NULL AFTER estimatedReadyAt");
          console.log('✅ [DB Init] prepMinutes column added to orders table.');
        }
      } catch (err) {
        console.warn('⚠️ [DB Init] Warning checking/adding prepMinutes column:', err.message);
      }

      // Check if we need to seed default data (e.g. if the users table has 0 users)
      const userCount = await User.count();
      if (userCount === 0) {
        console.log('🌱 [DB Init] Users table is empty. Seeding default data...');
        const { seedDatabaseWithoutForce } = await import('./sequelizeSeed.js');
        await seedDatabaseWithoutForce();
        console.log('✅ [DB Init] Seeding completed.');
      } else {
        console.log('ℹ️ [DB Init] Database already has data. Skipping seeding.');
      }
    } catch (error) {
      console.error('❌ [DB Init] Database initialization failed:', error);
      dbInitPromise = null; // Reset promise to allow retry on next access if it failed
      throw error;
    }
  })();

  return dbInitPromise;
}

// Automatically trigger on import in a non-blocking floating promise
ensureDatabaseReady().catch((err) => {
  console.error('⚠️ [DB Init] Auto database initialization failed:', err);
});

export default {
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
  ensureDatabaseReady,
};
