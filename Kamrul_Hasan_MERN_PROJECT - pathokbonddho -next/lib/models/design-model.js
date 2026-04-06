import { DataTypes } from 'sequelize';
import getSequelizeInstance from '../db/sequelize.js';

const sequelize = getSequelizeInstance();

const Design = sequelize.define("Design", {
    design_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    design_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    design_data: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'designs',
    timestamps: true,
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci"
});

export default Design;
