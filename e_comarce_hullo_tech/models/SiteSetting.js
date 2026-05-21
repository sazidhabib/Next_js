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
    }
  }, {
    timestamps: true,
    tableName: 'site_settings'
  });

  module.exports = SiteSetting;
