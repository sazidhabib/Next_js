require('dotenv').config();
const pool = require('./config/db');

async function ensureSettings() {
    try {
        const [rows] = await pool.query('SELECT * FROM re_settings WHERE id = 1');

        if (rows.length === 0) {
            console.log('No settings row found. Creating default settings...');
            await pool.query("INSERT INTO re_settings (id, site_name, helpline_number, footer_text) VALUES (1, 'PRESIDENT PROPERTIES', '01880578893', '© 2026 PRESIDENT PROPERTIES. All rights reserved.')");
            console.log('✓ Created default settings row');
        } else {
            console.log('✓ Settings row already exists');
        }

        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

ensureSettings();
