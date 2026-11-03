import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  media: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  sourceCodeLink: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  liveLink: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'projects',
});

export default Project;
