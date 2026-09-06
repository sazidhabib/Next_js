import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Article = sequelize.define('Article', {
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
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  subHeadline: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'Staff Reporter',
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'General',
  },
  featuredImageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'articles',
  timestamps: true,
  indexes: [
    { fields: ['editionId'] },
    { fields: ['category'] },
  ],
});

export default Article;
