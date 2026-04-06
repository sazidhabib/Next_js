// fix-db-encoding.js
const sequelize = require('./db/database');

async function fixDatabaseEncoding() {
    try {
        console.log('Fixing database encoding for Unicode support...');

        // 1. Alter database to use utf8mb4
        await sequelize.query(`
            ALTER DATABASE ${process.env.MYSQL_DATABASE} 
            CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        `);
        console.log('✅ Database encoding updated to utf8mb4');

        // 2. Alter Articles table to use utf8mb4
        await sequelize.query(`
            ALTER TABLE Articles 
            CONVERT TO CHARACTER SET utf8mb4 
            COLLATE utf8mb4_unicode_ci
        `);
        console.log('✅ Articles table encoding updated to utf8mb4');

        // 3. Specifically alter the title and description columns
        await sequelize.query(`
            ALTER TABLE Articles 
            MODIFY title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
            MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
        `);
        console.log('✅ Article columns encoding updated to utf8mb4');

        console.log('🎉 Database encoding fix completed successfully!');
        console.log('You can now create articles with Bengali characters.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing database encoding:', error.message);
        process.exit(1);
    }
}

fixDatabaseEncoding();