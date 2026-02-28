require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
    try {
        await pool.query("ALTER TABLE ph_settings ADD COLUMN logo_url TEXT");
        console.log("✓ Added logo_url");
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log("- logo_url already exists (skipped)");
            process.exit(0);
        }
        console.error("✗ Failed to add logo_url:", error.message);
        process.exit(1);
    }
}

migrate();
