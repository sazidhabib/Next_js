const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const PhotocardStatistic = sequelize.define("PhotocardStatistic", {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    downloadCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'photocard_statistics',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = PhotocardStatistic;
