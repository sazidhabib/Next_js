const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const PhotocardImage = sequelize.define("PhotocardImage", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photocardType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING, // 'download' or 'share'
        allowNull: false,
        defaultValue: 'download'
    }
}, {
    tableName: 'photocard_images',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

module.exports = PhotocardImage;
