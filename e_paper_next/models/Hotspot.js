import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Hotspot = sequelize.define('Hotspot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'pages',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  articleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'articles',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  x: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'X position percentage 0-100',
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Y position percentage 0-100',
  },
  width: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Width percentage 0-100',
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Height percentage 0-100',
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'hotspots',
  timestamps: true,
  indexes: [
    { fields: ['pageId'] },
    { fields: ['articleId'] },
  ],
});

export default Hotspot;
