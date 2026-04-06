import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

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

export default NewsTag;
