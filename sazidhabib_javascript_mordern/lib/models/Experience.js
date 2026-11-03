import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyLogo: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'experiences',
});

export default Experience;
