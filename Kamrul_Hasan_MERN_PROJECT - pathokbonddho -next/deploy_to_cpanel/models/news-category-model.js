const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

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

module.exports = NewsCategory;