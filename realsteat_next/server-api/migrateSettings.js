require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
    try {
        // Try adding the column directly. If it fails, check error code.
        await pool.query("ALTER TABLE ph_settings ADD COLUMN favicon_url TEXT");
        console.log("Migration successful: favicon_url added.");
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("Migration skipped: favicon_url already exists.");
            process.exit(0);
        }
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
