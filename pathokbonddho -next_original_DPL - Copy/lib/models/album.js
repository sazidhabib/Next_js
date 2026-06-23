import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

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

export default Album;
