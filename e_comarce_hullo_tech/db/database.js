const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const dbHost = process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost';
const dbUser = process.env.MYSQL_USER || process.env.DB_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD !== undefined ? process.env.MYSQL_PASSWORD : (process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '');
const dbDatabase = process.env.MYSQL_DATABASE || process.env.DB_NAME || 'hullotech';
const dbPort = process.env.MYSQL_PORT || process.env.Db_port || 3306;

let sequelize;

try {
  sequelize = new Sequelize(
    dbDatabase,
    dbUser,
    dbPassword,
    {
      host: dbHost,
      port: dbPort,
      dialect: 'mysql',
      dialectOptions: {
        charset: 'utf8mb4',
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: false,
        freezeTableName: true, // Prevent pluralization issues
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false
    }
  );
} catch (error) {
  console.error('❌ Failed to initialize Sequelize:', error.message);
  sequelize = null;
}

module.exports = sequelize;
