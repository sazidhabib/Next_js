import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const Row = sequelize.define("Row", {
    rowOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "rows",
});

export default Row;
