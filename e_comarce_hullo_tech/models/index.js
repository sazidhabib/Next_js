const sequelize = require('../db/database');
const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const SiteSetting = require('./SiteSetting');

// Associations (if any)
// E.g. Category.hasMany(Product, { foreignKey: 'categoryId' })
// Product.belongsTo(Category, { foreignKey: 'categoryId' })

module.exports = {
  sequelize,
  Category,
  Product,
  User,
  SiteSetting,
};
