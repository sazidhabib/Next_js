const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  multipleStatements: true,
};

async function runMigration() {
  const command = process.argv[2];
  
  if (!command) {
    console.log('Usage: node scripts/migrate.js [init|seed]');
    console.log('  init  - Initialize database schema');
    console.log('  seed  - Seed database with initial data');
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    
    if (command === 'init') {
      console.log('Initializing database schema...');
      const initSql = fs.readFileSync(path.join(__dirname, 'init-db.sql'), 'utf8');
      await connection.query(initSql);
      console.log('Database schema initialized successfully!');
    } else if (command === 'seed') {
      console.log('Seeding database...');
      const seedSql = fs.readFileSync(path.join(__dirname, 'seed-data.sql'), 'utf8');
      await connection.query(seedSql);
      console.log('Database seeded successfully!');
      console.log('\nDefault admin credentials:');
      console.log('Email: admin@nextideasolution.com');
      console.log('Password: Admin@12345');
      console.log('\nPlease change the password after first login!');
    } else {
      console.log('Unknown command:', command);
      console.log('Usage: node scripts/migrate.js [init|seed]');
      process.exit(1);
    }
  } catch (error) {
    console.error('Migration error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\nCould not connect to MySQL. Make sure MySQL is running and credentials are correct.');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
