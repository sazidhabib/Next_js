const sequelize = require('../db/database');

let Category;
let Product;
let User;
let SiteSetting;

// Only load models if sequelize is available
if (sequelize) {
  Category = require('./Category');
  Product = require('./Product');
  User = require('./User');
  SiteSetting = require('./SiteSetting');

  // Associations (if any)
  // E.g. Category.hasMany(Product, { foreignKey: 'categoryId' })
  // Product.belongsTo(Category, { foreignKey: 'categoryId' })
} else {
  console.warn('⚠️  Database not initialized - models will be unavailable');
}

module.exports = {
  sequelize,
  Category,
  Product,
  User,
  SiteSetting,
};
