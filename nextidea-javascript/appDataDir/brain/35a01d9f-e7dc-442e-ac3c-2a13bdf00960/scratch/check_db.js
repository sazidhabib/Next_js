require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');

async function checkDb() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'nextidea'
  });

  try {
    const [categories] = await connection.query('SELECT id, title FROM categories');
    console.log('Categories:', categories);

    const [portfolio] = await connection.query('SELECT id, title, category_id FROM portfolio_items');
    console.log('Portfolio Items:', portfolio);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkDb();
