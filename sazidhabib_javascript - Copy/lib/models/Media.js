import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'media',
});

export default Media;
