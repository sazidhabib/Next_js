import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const News = sequelize.define("News", {
    newsHeadline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    highlight: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    alternativeHeadline: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'authors',
            key: 'id'
        }
    },
    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    leadImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    thumbImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageCaption: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    videoLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    newsSchedule: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    metaTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    metaKeywords: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    metaImage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'scheduled'),
        defaultValue: 'draft',
    },
    newsType: {
        type: DataTypes.ENUM('standard', 'photo', 'video'),
        defaultValue: 'standard',
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    tableName: 'news',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

export default News;
