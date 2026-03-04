require('dotenv').config();
const pool = require('./config/db');

async function migrate() {
    const columns = [
        { name: 'hero_title', type: 'TEXT' },
        { name: 'hero_description', type: 'TEXT' },
        { name: 'instagram_url', type: 'VARCHAR(255)' },
        { name: 'x_url', type: 'VARCHAR(255)' },
        { name: 'hotline_number', type: 'VARCHAR(255)' },
        { name: 'secondary_email', type: 'VARCHAR(255)' },
        { name: 'business_hours', type: 'TEXT' },
        { name: 'hero_images', type: 'LONGTEXT' }
    ];

    console.log("Starting migration for re_settings...");

    for (const col of columns) {
        try {
            await pool.query(`ALTER TABLE re_settings ADD COLUMN ${col.name} ${col.type}`);
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
