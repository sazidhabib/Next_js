import { Sequelize, DataTypes, Op } from "sequelize";
import mysql2 from "mysql2";

const globalForSequelize = globalThis;

function getSequelizeInstance() {
  if (process.env.DB_HOST || process.env.DB_NAME) {
    return new Sequelize(
      process.env.DB_NAME || "banglafont_next",
      process.env.DB_USER || "root",
      process.env.DB_PASSWORD ?? "",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        dialectModule: mysql2,
        logging: process.env.NODE_ENV === "development" ? false : false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      }
    );
  }

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    return new Sequelize(dbUrl, {
      dialect: "mysql",
      dialectModule: mysql2,
      logging: process.env.NODE_ENV === "development" ? false : false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  return new Sequelize("banglafont_next", "root", "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    dialectModule: mysql2,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

export const sequelize =
  globalForSequelize.sequelize || (globalForSequelize.sequelize = getSequelizeInstance());

export { Sequelize, DataTypes, Op };
export default sequelize;
