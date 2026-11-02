import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Setting = sequelize.define('Setting', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'settings',
});

export default Setting;

