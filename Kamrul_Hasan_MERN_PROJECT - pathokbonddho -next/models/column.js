const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Column = sequelize.define("Column", {
    colOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    width: {
        type: DataTypes.INTEGER,
        defaultValue: 12,
    },
    mergedWith: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    contentType: {
        type: DataTypes.STRING,
    },
    tag: {
        type: DataTypes.STRING,
    },
    design: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contentId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contentTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    merged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    masterCell: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rowSpan: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    colSpan: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    masterCellKey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mergedCells: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    tableName: "columns",
    //timestamps: false,
});

module.exports = Column;
