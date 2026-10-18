import { Sequelize } from "sequelize";

let sequelize;

const dbHost = process.env.DB_HOST || "127.0.0.1";
const dbPort = process.env.DB_PORT || 3306;
const dbName = process.env.DB_NAME || "social_media_saas";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: Number(dbPort),
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  if (!globalThis._sequelizeInstance) {
    globalThis._sequelizeInstance = new Sequelize(dbName, dbUser, dbPassword, {
      host: dbHost,
      port: Number(dbPort),
      dialect: "mysql",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }
  sequelize = globalThis._sequelizeInstance;
}

export default sequelize;
