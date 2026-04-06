const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const About = sequelize.define("About", {
    // Banner / Hero
    heroTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    heroSubtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    // Introduction
    introTag: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    introTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    introDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imageUrl: { // Repurposed for Profile Image
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Socials (JSON Object for links)
    socialLinks: {
        type: DataTypes.JSON,
        allowNull: true,
    },

    // Stats Bar (JSON Array of entries)
    stats: {
        type: DataTypes.JSON,
        allowNull: true,
    },

    // Mission & Vision (JSON Object)
    missionVision: {
        type: DataTypes.JSON,
        allowNull: true,
    },

    // Our Values (JSON Array of cards)
    values: {
        type: DataTypes.JSON,
        allowNull: true,
    },

    // CTA Section
    ctaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ctaSubtitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Legacy fields for backward compatibility (optional but kept for internal use if needed)
    title: { type: DataTypes.STRING, allowNull: true },
    subtitle: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },

}, {
    tableName: 'abouts',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = About;