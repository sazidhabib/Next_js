const sequelize = require('./db/database');

async function finalFix() {
    try {
        console.log('🔄 Executing final database fix for image_registry...');
        
        // Ensure sourceId is NULLable with NULL default
        await sequelize.query("ALTER TABLE image_registry MODIFY COLUMN sourceId INT(11) NULL DEFAULT NULL;");
        
        // Also ensure sourceType is NULLable just in case
        await sequelize.query("ALTER TABLE image_registry MODIFY COLUMN sourceType ENUM('article', 'blog', 'photo', 'news', 'other') NULL;");
        
        console.log('✅ Database table image_registry successfully updated.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error executing final fix:', error.message);
        process.exit(1);
    }
}

finalFix();
