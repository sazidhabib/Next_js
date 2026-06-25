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
    mobileImage: {
        type: DataTypes.STRING, // store mobile image path
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
    // Popup-specific controls
    popupAutoCloseSeconds: {
        type: DataTypes.INTEGER,   // auto-close after N seconds (null = no auto-close)
        allowNull: true,
        defaultValue: null,
    },
    popupMaxShowCount: {
        type: DataTypes.INTEGER,   // max times to show per user (null = show once per session)
        allowNull: true,
        defaultValue: null,
    },
}, {
    tableName: 'ads',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = Ad;