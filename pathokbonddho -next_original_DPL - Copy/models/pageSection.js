const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const PageSection = sequelize.define("PageSection", {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    menuSlug: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    layoutType: {
        type: DataTypes.ENUM("grid", "flex"),
        allowNull: false,
    },
    autoNewsSelection: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    tableName: "page_sections", // renamed because 'sections' already exists
    //timestamps: false,
});

module.exports = PageSection;
