import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const Developer = sequelize.define(
  "Developer",
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
  },
  {
    tableName: "developer",
    timestamps: true,
  }
);

export default Developer;
