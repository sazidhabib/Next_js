// run-migration.js
const { Sequelize } = require('sequelize');
const config = require('./config/config.js');
const path = require('path');
const fs = require('fs');

async function runMigrations() {
    const env = process.env.NODE_ENV || 'development';
    const dbConfig = config[env];

    // Create sequelize instance
    const sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            logging: console.log
        }
    );

    try {
        console.log('Starting migrations...');
        console.log(`Environment: ${env}`);
        console.log(`Database: ${dbConfig.database}`);

        // Test connection
        await sequelize.authenticate();
        console.log('✓ Database connection established successfully.');

        // Get all migration files
        const migrationsPath = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsPath)
            .filter(file => file.endsWith('.js') && file.includes('add-meta-and-hierarchy-to-menus'))
            .sort();

        console.log(`Found ${migrationFiles.length} migration file(s) to run`);

        // Create SequelizeMeta table if it doesn't exist
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS SequelizeMeta (
        name VARCHAR(255) NOT NULL,
        PRIMARY KEY (name),
        UNIQUE KEY name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
    `);

        // Get already executed migrations
        const [executedMigrations] = await sequelize.query('SELECT name FROM SequelizeMeta');
        const executedNames = executedMigrations.map(m => m.name);

        for (const file of migrationFiles) {
            if (executedNames.includes(file)) {
                console.log(`✓ Migration ${file} already executed, skipping...`);
                continue;
            }

            console.log(`\n→ Running migration: ${file}`);

            const migration = require(path.join(migrationsPath, file));

            // Run the migration
            await migration.up(sequelize.getQueryInterface(), Sequelize);

            // Record the migration
            await sequelize.query('INSERT INTO SequelizeMeta (name) VALUES (?)', {
                replacements: [file]
            });

            console.log(`✓ Successfully executed: ${file}`);
        }

        console.log('\n🎉 All migrations completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Run if called directly
if (require.main === module) {
    runMigrations();
}

module.exports = runMigrations;