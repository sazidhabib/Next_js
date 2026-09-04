import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const AdminUser = sequelize.define(
  "AdminUser",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "SUPERADMIN"),
      defaultValue: "ADMIN",
    },
  },
  {
    tableName: "adminuser",
    timestamps: true,
  }
);

export default AdminUser;
