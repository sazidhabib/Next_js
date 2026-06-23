const { Sequelize } = require('sequelize');
require('dotenv').config();
const s = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false
});

s.getQueryInterface().showAllTables()
    .then(tables => {
        console.log("=== ALL DB TABLES ===");
        tables.forEach(t => console.log(t));
        console.log("=====================");
    })
    .catch(e => console.error(e))
    .finally(() => s.close());
