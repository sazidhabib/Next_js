import mysql from 'mysql2/promise';

let pool = null;

export function getPool() {
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
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT, 10) || 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

export async function query(sql, params = []) {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    if (error.code === 'ER_BAD_DB_ERROR' || error.code === 'ER_NO_SUCH_TABLE') {
      const dbName = process.env.DATABASE_NAME || 'nextidea';
      console.error(`DATABASE ERROR: The database or table is missing. Please visit http://localhost:3000/api/db-init to set up your database.`);
      throw new Error(`Database setup required. Please visit /api/db-init to initialize your database '${dbName}'.`);
    }
    console.error('Database query error:', error.message);
    throw error;
  }
}

export async function getConnection() {
  const pool = getPool();
  return pool.getConnection();
}
