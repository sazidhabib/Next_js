require('dotenv').config();

module.exports = {
  development: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'saziddb',
    host: process.env.MYSQL_HOST || '192.168.163.99',
    dialect: 'mysql',
    port: process.env.MYSQL_PORT || 3306
  },
  test: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'saziddb_test',
    host: process.env.MYSQL_HOST || '192.168.163.99',
    dialect: 'mysql',
    port: process.env.MYSQL_PORT || 3306
  },
  production: {
    username: process.env.MYSQL_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'saziddb_prod',
    host: process.env.MYSQL_HOST || '192.168.163.99',
    dialect: 'mysql',
    port: process.env.MYSQL_PORT || 3306
  }
};