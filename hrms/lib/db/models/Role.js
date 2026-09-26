import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true,
});

export default Role;
