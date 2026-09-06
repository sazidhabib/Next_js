import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const DB_NAME = process.env.DB_NAME || 'epaper_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

// Maintain singleton across hot reloads in Next.js
let sequelizeInstance = global._sequelize;

if (!sequelizeInstance) {
  sequelizeInstance = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 5000,
    },
  });

  if (process.env.NODE_ENV !== 'production') {
    global._sequelize = sequelizeInstance;
  }
}

export const sequelize = sequelizeInstance;

let isConnected = null;

export async function testConnection() {
  if (isConnected !== null) return isConnected;
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database via Sequelize');
    isConnected = true;
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL connection unavailable, operating with mock fallback store:', error.message);
    isConnected = false;
    return false;
  }
}

export default sequelize;
