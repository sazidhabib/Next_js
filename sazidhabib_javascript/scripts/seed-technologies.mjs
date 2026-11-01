import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import mysql2 from 'mysql2';

// Simple .env parser
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const database = process.env.MYSQL_DATABASE || 'saziddb';
const username = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const host = process.env.MYSQL_HOST || 'localhost';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

console.log(`Connecting to MySQL ${database}@${host}:${port} as ${username}...`);

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: false,
});

const Technology = sequelize.define(
  'Technology',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'technologies',
    timestamps: true,
  }
);

const defaultTechnologies = [
  { name: "HTML 5", icon: "/src/assets/tech/html.png", sortOrder: 0 },
  { name: "CSS 3", icon: "/src/assets/tech/css.png", sortOrder: 1 },
  { name: "JavaScript", icon: "/src/assets/tech/javascript.png", sortOrder: 2 },
  { name: "TypeScript", icon: "/src/assets/tech/typescript.png", sortOrder: 3 },
  { name: "React JS", icon: "/src/assets/tech/reactjs.png", sortOrder: 4 },
  { name: "Redux Toolkit", icon: "/src/assets/tech/redux.png", sortOrder: 5 },
  { name: "Tailwind CSS", icon: "/src/assets/tech/tailwind.png", sortOrder: 6 },
  { name: "Node JS", icon: "/src/assets/tech/nodejs.png", sortOrder: 7 },
  { name: "MongoDB", icon: "/src/assets/tech/mongodb.png", sortOrder: 8 },
  { name: "Three JS", icon: "/src/assets/tech/threejs.png", sortOrder: 9 },
  { name: "git", icon: "/src/assets/tech/git.png", sortOrder: 10 },
  { name: "figma", icon: "/src/assets/tech/figma.png", sortOrder: 11 },
  { name: "docker", icon: "/src/assets/tech/docker.png", sortOrder: 12 },
];

async function main() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection authenticated successfully!');
    await sequelize.sync({ alter: true });
    console.log('Database synced!');

    await Technology.destroy({ where: {} });
    console.log('Cleared existing technologies table.');

    await Technology.bulkCreate(defaultTechnologies);
    console.log(`Successfully inserted ${defaultTechnologies.length} technologies into database!`);

    const count = await Technology.count();
    console.log(`Current Technology records in DB: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
}

main();

