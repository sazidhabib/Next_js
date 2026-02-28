require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
    const columns = [
        { name: 'site_description', type: 'TEXT' },
        { name: 'facebook_url', type: 'VARCHAR(255)' },
        { name: 'youtube_url', type: 'VARCHAR(255)' },
        { name: 'website_url', type: 'VARCHAR(255)' },
        { name: 'address_text', type: 'TEXT' }
    ];

    for (const col of columns) {
        try {
            await pool.query(`ALTER TABLE ph_settings ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✓ Added ${col.name}`);
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log(`- ${col.name} already exists (skipped)`);
            } else {
                console.error(`✗ Failed to add ${col.name}:`, error.message);
            }
        }
    }

    console.log("\nMigration completed");
    process.exit(0);
}

migrate();
