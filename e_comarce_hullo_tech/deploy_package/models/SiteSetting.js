const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

let SiteSetting = null;

if (sequelize) {
  SiteSetting = sequelize.define('SiteSetting', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    siteTitle: {
      type: DataTypes.STRING,
      defaultValue: 'HulloTech',
    },
    siteDescription: {
      type: DataTypes.TEXT,
      defaultValue: 'Your ultimate destination for tech.',
    },
    contactEmail: {
      type: DataTypes.STRING,
      defaultValue: 'support@hullotech.com',
    },
    contactPhone: {
      type: DataTypes.STRING,
      defaultValue: '+880 1234 567890',
    },
    contactAddress: {
      type: DataTypes.TEXT,
      defaultValue: 'Dhaka, Bangladesh',
    },
    footerText: {
      type: DataTypes.TEXT,
      defaultValue: '© 2026 HulloTech. All rights reserved.',
    },
    socialLinks: {
      type: DataTypes.JSON, // { facebook: 'url', twitter: 'url' }
      defaultValue: {},
    },
    deliveryCharge: {
      type: DataTypes.INTEGER,
      defaultValue: 120,
    },
    freeShippingThreshold: {
      type: DataTypes.INTEGER,
      defaultValue: 5000,
    },
    mainSlider: {
      type: DataTypes.JSON,
      defaultValue: [
        { image: "/1st-post.jpeg" },
        { image: "/2nd_post.jpeg" },
        { image: "/cover.jpeg" }
      ],
    },
    topSlider: {
      type: DataTypes.JSON,
      defaultValue: [
        { image: "/3rd_post.png", link: "/offers" },
        { image: "/1st-post.jpeg", link: "/offers" },
        { image: "/cover.jpeg", link: "/offers" }
      ],
    },
    bottomSlider: {
      type: DataTypes.JSON,
      defaultValue: [
        { image: "/4th_post.png", link: "/offers" },
        { image: "/2nd_post.jpeg", link: "/offers" },
        { image: "/cover.jpeg", link: "/offers" }
      ],
    },
    menuItems: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    brands: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  }, {
    timestamps: true,
    tableName: 'site_settings'
  });

}

module.exports = SiteSetting;
