import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Edition = sequelize.define('Edition', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Daily Main Edition',
  },
  publishDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  editionType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'National',
  },
  language: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'bn',
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'published',
  },
}, {
  tableName: 'editions',
  timestamps: true,
  indexes: [
    { fields: ['publishDate'] },
    { fields: ['status'] },
  ],
});

export default Edition;
