const fs = require('fs');
const path = require('path');
const pool = require('./db');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_users WHERE role = "admin"');
        if (rows.length === 0) {
            console.log('No admin found. Creating default admin...');

            const hashedPassword = await bcrypt.hash('admin123', 10);

            await pool.query(
                'INSERT INTO re_users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['Admin', 'admin@admin.com', hashedPassword, 'admin']
            );

            console.log('Default admin created successfully.');
            console.log('Email: admin@admin.com');
            console.log('Password: admin123');
        } else {
            console.log('Admin already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

const initDb = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon and filter empty lines
        const queries = schema
            .split(';')
            .filter(query => query.trim().length > 0);

        console.log('Initializing database...');

        // Pre-Migration: Fix re_settings column name BEFORE running schema
        try {
            const [settingsCols] = await pool.query("SHOW COLUMNS FROM re_settings LIKE 'site_title'");
            if (settingsCols.length > 0) {
                console.log('Migrating: Renaming site_title to site_name in re_settings...');
                await pool.query("ALTER TABLE re_settings CHANGE site_title site_name VARCHAR(255) DEFAULT 'PRESIDENT PROPERTIES'");
            }
        } catch (e) {
            // Table doesn't exist yet, which is fine
        }

        for (const query of queries) {
            await pool.query(query);
        }

        console.log('Database initialized successfully.');

        // Simple Migration to add columns if they don't exist (since CREATE TABLE IF NOT EXISTS won't do it)
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS re_categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Check if 'status' column exists in re_projects and has correct ENUM
            const [columns] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'status'");
            if (columns.length === 0) {
                console.log('Migrating: Adding status column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN status ENUM('active', 'pending', 'inactive', 'rejected', 'trash') DEFAULT 'pending'");
            } else {
                try {
                    await pool.query("ALTER TABLE re_projects MODIFY COLUMN status ENUM('active', 'pending', 'inactive', 'rejected', 'trash') DEFAULT 'pending'");
                    console.log('Migrating: Updated status column ENUM values to include pending, rejected, trash');
                } catch (e) {
                    console.log('Status column update skipped or failed (might already match): ' + e.message);
                }
            }

            // Check if 'images' column exists in re_projects
            const [imgCols] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'images'");
            if (imgCols.length === 0) {
                console.log('Migrating: Adding images column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN images TEXT");
            }

            // Check if 'video_url' column exists in re_projects
            const [vidCols] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'video_url'");
            if (vidCols.length === 0) {
                console.log('Migrating: Adding video_url column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN video_url VARCHAR(500)");
            }

            // Check if 'category_id' column exists in re_projects
            const [catCols] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'category_id'");
            if (catCols.length === 0) {
                console.log('Migrating: Adding category_id column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN category_id INT");
                // Optional: Add FK constraint if consistent
                // await pool.query("ALTER TABLE re_projects ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES re_categories(id) ON DELETE SET NULL");
            }

            // Check if 'user_id' column exists in re_projects
            const [userCols] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'user_id'");
            if (userCols.length === 0) {
                console.log('Migrating: Adding user_id column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN user_id INT");
            }

            // Check if 'view_count' column exists in re_projects
            const [viewCols] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'view_count'");
            if (viewCols.length === 0) {
                console.log('Migrating: Adding view_count column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN view_count INT DEFAULT 0");
            }

            // Check if 'use_count' column exists in re_projects
            const [useCols] = await pool.query("SHOW COLUMNS FROM re_projects LIKE 'use_count'");
            if (useCols.length === 0) {
                console.log('Migrating: Adding use_count column to re_projects...');
                await pool.query("ALTER TABLE re_projects ADD COLUMN use_count INT DEFAULT 0");
            }

            // Property detail columns migration
            const projectDetailColumns = [
                { name: 'location', type: 'VARCHAR(500)' },
                { name: 'price', type: 'VARCHAR(255)' },
                { name: 'bedrooms', type: 'INT' },
                { name: 'bathrooms', type: 'INT' },
                { name: 'sqft', type: 'INT' },
                { name: 'floors', type: 'INT' },
                { name: 'amenities', type: 'TEXT' },
            ];

            for (const col of projectDetailColumns) {
                const [cols] = await pool.query(`SHOW COLUMNS FROM re_projects LIKE '${col.name}'`);
                if (cols.length === 0) {
                    console.log(`Migrating: Adding ${col.name} column to re_projects...`);
                    await pool.query(`ALTER TABLE re_projects ADD COLUMN ${col.name} ${col.type}`);
                }
            }

            // Check if 'phone_number' column exists in re_users
            const [phoneCols] = await pool.query("SHOW COLUMNS FROM re_users LIKE 'phone_number'");
            if (phoneCols.length === 0) {
                console.log('Migrating: Adding phone_number column to re_users...');
                await pool.query("ALTER TABLE re_users ADD COLUMN phone_number VARCHAR(20)");
            }

            // Check if 'parent_id' column exists in re_categories
            const [parentCols] = await pool.query("SHOW COLUMNS FROM re_categories LIKE 'parent_id'");
            if (parentCols.length === 0) {
                console.log('Migrating: Adding parent_id column to re_categories...');
                await pool.query("ALTER TABLE re_categories ADD COLUMN parent_id INT DEFAULT NULL");
                await pool.query("ALTER TABLE re_categories ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES re_categories(id) ON DELETE SET NULL");
            }

            // Create re_menu_items table if not exists
            await pool.query(`
                CREATE TABLE IF NOT EXISTS re_menu_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    category_id INT DEFAULT NULL,
                    url VARCHAR(255) DEFAULT NULL,
                    parent_id INT DEFAULT NULL,
                    item_order INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES re_categories(id) ON DELETE SET NULL,
                    FOREIGN KEY (parent_id) REFERENCES re_menu_items(id) ON DELETE SET NULL
                )
            `);

        } catch (migError) {
            console.error('Migration error:', migError);
        }

        // Migration for re_settings (Sync with Controller)
        try {
            // 1. Rename contact_email to support_email if it exists
            const [emailCols] = await pool.query("SHOW COLUMNS FROM re_settings LIKE 'contact_email'");
            if (emailCols.length > 0) {
                console.log('Migrating: Renaming contact_email to support_email in re_settings...');
                await pool.query("ALTER TABLE re_settings CHANGE contact_email support_email VARCHAR(255)");
            }

            // 2. Add support_email if it doesn't exist
            const [supportEmailCols] = await pool.query("SHOW COLUMNS FROM re_settings LIKE 'support_email'");
            if (supportEmailCols.length === 0) {
                console.log('Migrating: Adding support_email column to re_settings...');
                await pool.query("ALTER TABLE re_settings ADD COLUMN support_email VARCHAR(255)");
            }

            // 3. Add other missing columns
            const settingColumns = [
                { name: 'site_description', type: 'TEXT' },
                { name: 'facebook_url', type: 'VARCHAR(255)' },
                { name: 'youtube_url', type: 'VARCHAR(255)' },
                { name: 'website_url', type: 'VARCHAR(255)' },
                { name: 'address_text', type: 'TEXT' },
                { name: 'hero_frame_id', type: 'INT' }
            ];

            for (const col of settingColumns) {
                const [cols] = await pool.query(`SHOW COLUMNS FROM re_settings LIKE '${col.name}'`);
                if (cols.length === 0) {
                    console.log(`Migrating: Adding ${col.name} column to re_settings...`);
                    await pool.query(`ALTER TABLE re_settings ADD COLUMN ${col.name} ${col.type}`);
                }
            }

        } catch (settingMigError) {
            console.error('Settings Migration error:', settingMigError);
        }

        // Seed Admin
        await seedAdmin();

    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

module.exports = initDb;
