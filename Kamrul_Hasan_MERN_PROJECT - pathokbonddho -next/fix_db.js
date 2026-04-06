const sequelize = require('./db/database');

async function fixTable() {
    try {
        console.log('🔄 Attempting to fix image_registry table...');
        await sequelize.query("ALTER TABLE image_registry MODIFY sourceId INT NULL;");
        console.log('✅ Successfully modified sourceId to be NULLable.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing table:', error.message);
        process.exit(1);
    }
}

fixTable();
