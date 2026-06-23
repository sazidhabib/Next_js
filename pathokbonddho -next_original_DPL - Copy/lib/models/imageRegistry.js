import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const ImageRegistry = sequelize.define("ImageRegistry", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sourceType: {
        type: DataTypes.ENUM('article', 'blog', 'photo', 'news', 'other'),
        allowNull: false
    },
    sourceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mimeType: {
        type: DataTypes.STRING
    },
    fileSize: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'image_registry',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

export default ImageRegistry;
