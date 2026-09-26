import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  headEmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'head_employee_id',
  },
}, {
  tableName: 'departments',
  timestamps: true,
  underscored: true,
});

export default Department;
