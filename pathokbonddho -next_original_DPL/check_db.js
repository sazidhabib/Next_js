const sequelize = require('./db/database');

async function checkTable() {
    try {
        console.log('🔍 Checking image_registry table structure...');
        const [results] = await sequelize.query("DESCRIBE image_registry;");
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking table:', error.message);
        process.exit(1);
    }
}

checkTable();
