const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function cleanupIndexes() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT || 3306
    });

    try {
        console.log("🔍 Checking indexes on table 'users'...");
        const [rows] = await connection.query('SHOW INDEX FROM users');
        
        const indexesToDrop = [];
        const seenColumns = new Set();
        
        // Keep the first unique index for each column, drop others that are redundant
        for (const row of rows) {
            const indexName = row.Key_name;
            const columnName = row.Column_name;
            
            if (indexName === 'PRIMARY') continue;
            
            // If we've already seen this column in a unique index, this one might be a duplicate
            // Sequelize often creates 'email', 'email_2', 'email_3' etc.
            if (indexName.startsWith(columnName) && indexName !== columnName) {
                indexesToDrop.push(indexName);
            }
        }

        if (indexesToDrop.length === 0) {
            console.log("✅ No duplicate indexes found to drop.");
        } else {
            console.log(`🧹 Found ${indexesToDrop.length} potentially duplicate indexes.`);
            for (const indexName of indexesToDrop) {
                try {
                    console.log(`  Dropping index: ${indexName}`);
                    await connection.query(`ALTER TABLE users DROP INDEX \`${indexName}\``);
                } catch (err) {
                    console.error(`  ❌ Failed to drop index ${indexName}: ${err.message}`);
                }
            }
            console.log("✅ Cleanup complete.");
        }

    } catch (error) {
        console.error("❌ Error during cleanup:", error.message);
    } finally {
        await connection.end();
    }
}

cleanupIndexes();
