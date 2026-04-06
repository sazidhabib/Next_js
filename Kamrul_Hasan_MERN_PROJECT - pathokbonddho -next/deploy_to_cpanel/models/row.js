const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Row = sequelize.define("Row", {
    rowOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "rows",
    //timestamps: false,
});

module.exports = Row;
