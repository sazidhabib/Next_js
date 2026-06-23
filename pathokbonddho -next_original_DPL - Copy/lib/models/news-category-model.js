import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const NewsCategory = sequelize.define("NewsCategory", {
    newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'news',
            key: 'id'
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'menus',
            key: 'id'
        }
    }
}, {
    tableName: 'news_categories',
    timestamps: false
});

export default NewsCategory;
