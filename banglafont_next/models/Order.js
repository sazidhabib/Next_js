import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fontId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "BDT",
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: true,
    },
    transactionId: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "REFUNDED", "FAILED"),
      defaultValue: "PENDING",
    },
    downloadToken: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "order",
    timestamps: true,
    indexes: [
      { fields: ["fontId"] },
      { fields: ["status"] },
      { fields: ["customerEmail"] },
    ],
  }
);

export default Order;
