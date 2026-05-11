const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

function getPool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'nextidea',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT, 10) || 5,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

async function query(sql, params = []) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

async function getConnection() {
  const pool = getPool();
  return pool.getConnection();
}

module.exports = {
  query,
  getConnection,
  getPool
};
