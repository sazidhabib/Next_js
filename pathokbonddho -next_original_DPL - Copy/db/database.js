const { Sequelize } = require("sequelize");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        dialect: "mysql",
        dialectOptions: {
            charset: "utf8mb4",
        },
        define: {
            charset: "utf8mb4",
            collate: "utf8mb4_unicode_ci",
            timestamps: true, // Add this
            underscored: false,
            freezeTableName: true, // Prevent pluralization issues
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        logging: false,
        sync: {
            force: false,
            alter: false
        },
    }
);

module.exports = sequelize;