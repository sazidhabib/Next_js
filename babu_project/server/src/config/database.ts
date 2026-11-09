import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load from server/.env, process.cwd()/.env, or root .env
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const dbName = process.env.DB_NAME || 'babu';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 3306;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ MySQL Database '${dbName}' connected successfully with Sequelize.`);
  } catch (error) {
    console.error(`❌ Unable to connect to MySQL database '${dbName}':`, error);
    throw error;
  }
};
