import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const Download = sequelize.define(
  "Download",
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
    ipHash: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Download",
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ["fontId"] }, { fields: ["createdAt"] }],
  }
);

export default Download;
