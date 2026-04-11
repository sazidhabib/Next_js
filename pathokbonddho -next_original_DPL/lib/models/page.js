import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const Page = sequelize.define("Page", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    autoNewsSelection: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    tableName: "pages",
});

export default Page;
