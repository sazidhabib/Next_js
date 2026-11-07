import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'casino_db';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || '127.0.0.1';
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
    console.log('✅ MySQL Database connected successfully with Sequelize.');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error);
  }
};

