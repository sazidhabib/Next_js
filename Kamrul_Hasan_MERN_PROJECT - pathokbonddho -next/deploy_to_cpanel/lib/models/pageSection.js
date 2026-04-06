import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

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
    tableName: "page_sections",
});

export default PageSection;
