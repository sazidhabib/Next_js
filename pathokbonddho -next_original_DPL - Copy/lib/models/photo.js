import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const Photo = sequelize.define("Photo", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    caption: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    albumId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'albums',
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'photos'
});

export default Photo;
