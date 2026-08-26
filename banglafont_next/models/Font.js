import { DataTypes } from "sequelize";
import { sequelize } from "../lib/db.js";

const Font = sequelize.define(
  "Font",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fontType: {
      type: DataTypes.ENUM("FREE", "PREMIUM"),
      defaultValue: "FREE",
    },
    style: {
      type: DataTypes.ENUM(
        "HANDWRITING",
        "HEADING",
        "PARAGRAPH",
        "STYLISH",
        "GENERAL"
      ),
      defaultValue: "GENERAL",
    },
    encoding: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    salePrice: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    downloadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    fontFileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    previewImageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    detailsDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    foundry: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    released: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING(50),
      defaultValue: "1.000",
    },
    formats: {
      type: DataTypes.STRING(100),
      defaultValue: "OTF, TTF, WOFF2",
    },
    designerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    developerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Font",
    timestamps: true,
    indexes: [
      { fields: ["fontType"] },
      { fields: ["style"] },
      { fields: ["designerId"] },
      { fields: ["downloadCount"] },
    ],
  }
);

export default Font;
