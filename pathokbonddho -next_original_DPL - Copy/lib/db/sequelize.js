import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

let sequelize = null;

const getSequelizeInstance = () => {
  if (sequelize) {
    return sequelize;
  }

  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      dialect: 'mysql',
      dialectModule: mysql2,
      dialectOptions: {
        charset: 'utf8mb4',
      },
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
        underscored: false,
        freezeTableName: true,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
      sync: {
        force: false,
        alter: false
      },
    }
  );

  return sequelize;
};

export default getSequelizeInstance;
export { sequelize };
