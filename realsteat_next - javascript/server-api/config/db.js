const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'realsteatdb',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('[DB] Connecting to MySQL:', dbConfig.host + ':' + dbConfig.port, '/', dbConfig.database);

const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
    .then(conn => {
        console.log('[DB] MySQL connection successful!');
        conn.release();
    })
    .catch(err => {
        console.error('[DB] MySQL connection FAILED:', err.code, err.message);
    });

module.exports = pool;
