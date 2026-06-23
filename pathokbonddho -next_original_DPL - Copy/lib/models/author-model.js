import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const Author = sequelize.define("Author", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    websiteLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isSpecialAuthor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'authors',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

export default Author;
