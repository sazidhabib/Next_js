import { Sequelize } from 'sequelize';

// Global cached connection for Next.js hot-reloading
let sequelize;

function getSequelizeInstance() {
  if (sequelize) return sequelize;

  const dialect = process.env.DB_DIALECT || 'mysql';
  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
  const dbName = process.env.DB_NAME || 'hrms_db';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';

  if (dialect === 'sqlite') {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './hrms_database.sqlite',
      logging: false,
    });
  } else {
    try {
      sequelize = new Sequelize(dbName, dbUser, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        dialectOptions: {
          decimalNumbers: true,
          connectTimeout: 5000,
        },
      });
    } catch (e) {
      console.warn('MySQL initialization notice, using sqlite fallback:', e.message);
      sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './hrms_database.sqlite',
        logging: false,
      });
    }
  }

  return sequelize;
}

export default getSequelizeInstance();
