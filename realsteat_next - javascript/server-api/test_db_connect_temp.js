
const mysql = require('mysql2/promise');

async function testConnection(host, user, password, database) {
    console.log(`Testing connection to ${host}...`);
    try {
        const connection = await mysql.createConnection({
            host, user, password, database, connectTimeout: 3000
        });
        console.log(`Successfully connected to ${host}!`);
        await connection.end();
    } catch (err) {
        console.log(`Failed to connect to ${host}:`, err.message);
    }
}

const user = 'sazid';
const password = 'sazid@123';
const database = 'saziddb';

(async () => {
    await testConnection('192.168.163.99', user, password, database);
    await testConnection('localhost', user, password, database);
    await testConnection('127.0.0.1', user, password, database);
})();
