const sequelize = require('../db/database');

let Category;
let Product;
let User;
let SiteSetting;
let Order;
let OrderItem;

// Only load models if sequelize is available
if (sequelize) {
  Category = require('./Category');
  Product = require('./Product');
  User = require('./User');
  SiteSetting = require('./SiteSetting');
  Order = require('./Order');
  OrderItem = require('./OrderItem');

  // Associations
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
} else {
  console.warn('⚠️  Database not initialized - models will be unavailable');
}

module.exports = {
  sequelize,
  Category,
  Product,
  User,
  SiteSetting,
  Order,
  OrderItem,
};
