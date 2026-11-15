import models from '../../models';

const actualModels = (models && models.User) ? models : ((models && models.default) || {});

export const sequelize = actualModels.sequelize;
export const Category = actualModels.Category;
export const Product = actualModels.Product;
export const User = actualModels.User;
export const SiteSetting = actualModels.SiteSetting;
export const Order = actualModels.Order;
export const OrderItem = actualModels.OrderItem;

export default actualModels;
