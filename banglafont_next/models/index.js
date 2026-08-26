import { sequelize, Sequelize, Op } from "../lib/db.js";
import Font from "./Font.js";
import FontVariant from "./FontVariant.js";
import Designer from "./Designer.js";
import Developer from "./Developer.js";
import Download from "./Download.js";
import Order from "./Order.js";
import AdminUser from "./AdminUser.js";

// Font <-> Designer
Font.belongsTo(Designer, { foreignKey: "designerId", as: "designer" });
Designer.hasMany(Font, { foreignKey: "designerId", as: "fonts" });

// Font <-> Developer
Font.belongsTo(Developer, { foreignKey: "developerId", as: "developer" });
Developer.hasMany(Font, { foreignKey: "developerId", as: "fonts" });

// Font <-> FontVariant
Font.hasMany(FontVariant, { foreignKey: "fontId", as: "variants", onDelete: "CASCADE" });
FontVariant.belongsTo(Font, { foreignKey: "fontId", as: "font" });

// Font <-> Download
Font.hasMany(Download, { foreignKey: "fontId", as: "downloads" });
Download.belongsTo(Font, { foreignKey: "fontId", as: "font" });

// Font <-> Order
Font.hasMany(Order, { foreignKey: "fontId", as: "orders" });
Order.belongsTo(Font, { foreignKey: "fontId", as: "font" });

export {
  sequelize,
  Sequelize,
  Op,
  Font,
  FontVariant,
  Designer,
  Developer,
  Download,
  Order,
  AdminUser,
};

export default {
  sequelize,
  Sequelize,
  Op,
  Font,
  FontVariant,
  Designer,
  Developer,
  Download,
  Order,
  AdminUser,
};
