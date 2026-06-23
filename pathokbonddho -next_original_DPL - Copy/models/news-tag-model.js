const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const NewsTag = sequelize.define("NewsTag", {
    newsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'news',
            key: 'id'
        }
    },
    tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tags',
            key: 'id'
        }
    }
}, {
    tableName: 'news_tags',
    timestamps: false
});

module.exports = NewsTag;