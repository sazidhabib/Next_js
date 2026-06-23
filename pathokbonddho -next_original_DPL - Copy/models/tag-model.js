// models/tag-model.js
const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const Tag = sequelize.define("Tag", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    tagTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tagDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING, // store image path
        allowNull: true,
    },
    metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    metaKeywords: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'tags',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = Tag;