const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Album = sequelize.define("Album", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    timestamps: true,
    tableName: 'albums'
});

module.exports = Album;