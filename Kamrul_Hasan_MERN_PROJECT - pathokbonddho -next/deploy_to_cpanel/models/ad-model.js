// models/ad-model.js
const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const Ad = sequelize.define("Ad", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('image', 'google_adsense'),
        allowNull: false,
    },
    // For image ads
    image: {
        type: DataTypes.STRING, // store image path
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING, // URL where image should link to
        allowNull: true,
    },
    // For Google Adsense
    headCode: {
        type: DataTypes.TEXT, // Adsense head code
        allowNull: true,
    },
    bodyCode: {
        type: DataTypes.TEXT, // Adsense body code
        allowNull: true,
    },
    // Ad positioning and display
    position: {
        type: DataTypes.ENUM('header', 'sidebar', 'footer', 'in_content', 'popup'),
        allowNull: false,
    },
    displayPages: {
        type: DataTypes.TEXT, // JSON string of pages where ad should show
        allowNull: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    maxImpressions: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    currentImpressions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    clickCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'ads',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = Ad;