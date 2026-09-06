import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  editionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'editions',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  pageNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  pageTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'Page 1',
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  thumbUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  widthPx: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1200,
  },
  heightPx: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1800,
  },
}, {
  tableName: 'pages',
  timestamps: true,
  indexes: [
    { fields: ['editionId', 'pageNumber'] },
  ],
});

export default Page;
