import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const FontVariant = sequelize.define(
  "FontVariant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    weight: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    fontId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "FontVariant",
    timestamps: false,
    indexes: [{ fields: ["fontId"] }],
  }
);

export default FontVariant;
