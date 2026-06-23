const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("Attempting to connect with:");
console.log("DB:", process.env.MYSQL_DATABASE);
console.log("User:", process.env.MYSQL_USER);
console.log("Host:", process.env.MYSQL_HOST);
console.log("Port:", process.env.MYSQL_PORT);

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        dialect: "mysql",
        logging: console.log,
    }
);

sequelize.authenticate()
    .then(() => {
        console.log("✅ Connection has been established successfully.");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Unable to connect to the database:", err);
        process.exit(1);
    });
