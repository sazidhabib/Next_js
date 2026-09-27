import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const MediaFile = sequelize.define('MediaFile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'original_name',
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING(80),
    allowNull: true,
    defaultValue: 'image/png',
    field: 'file_type',
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'file_size',
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'GENERAL',
  },
  uploadedBy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Admin',
    field: 'uploaded_by',
  },
}, {
  tableName: 'media_files',
  timestamps: true,
  underscored: true,
});

export default MediaFile;
