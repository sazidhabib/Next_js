import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const Designer = sequelize.define(
  "Designer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    banglaName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    photo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    socialLinks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    tableName: "designer",
    timestamps: true,
  }
);

export default Designer;
