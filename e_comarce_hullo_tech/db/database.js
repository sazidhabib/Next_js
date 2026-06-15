const { Sequelize } = require('sequelize');

// Check if mysql2 is available
let mysql2Available = true;
try {
  require('mysql2');
} catch (error) {
  console.warn('⚠️  mysql2 not found. Install with: npm install mysql2');
  mysql2Available = false;
}

require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.Db_port || 3306,
      dialect: 'mysql',
      logging: false, // Set to console.log to see SQL queries
      dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
      }
    }
  );
} catch (error) {
  console.error('❌ Failed to initialize Sequelize:', error.message);
  sequelize = null;
}

module.exports = sequelize;
