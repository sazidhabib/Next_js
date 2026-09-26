import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const VisaType = sequelize.define('VisaType', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(80),
    allowNull: false,
    unique: true,
  },
  code: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Work / Study',
  },
  requiresSponsorship: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'requires_sponsorship',
  },
  maxWeeklyHours: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 37,
    field: 'max_weekly_hours',
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'visa_types',
  timestamps: true,
  underscored: true,
});

export default VisaType;
