const sequelize = require('./db/database');

async function migratePaths() {
    try {
        console.log('🔄 Starting image path migration...');
        
        // Update filePath in image_registry
        const [results] = await sequelize.query(`
            UPDATE image_registry 
            SET filePath = REPLACE(filePath, 'uploads/news/', 'uploads/post_image/')
            WHERE filePath LIKE 'uploads/news/%'
        `);
        
        console.log(`✅ Successfully updated ${results.affectedRows} records in image_registry.`);
        
        // Also check if any news records themselves have direct paths that need updating
        const [newsResults] = await sequelize.query(`
            UPDATE news 
            SET leadImage = REPLACE(leadImage, 'uploads/news/', 'uploads/post_image/'),
                thumbImage = REPLACE(thumbImage, 'uploads/news/', 'uploads/post_image/'),
                metaImage = REPLACE(metaImage, 'uploads/news/', 'uploads/post_image/')
            WHERE leadImage LIKE 'uploads/news/%' 
               OR thumbImage LIKE 'uploads/news/%' 
               OR metaImage LIKE 'uploads/news/%'
        `);
        
        console.log(`✅ Successfully updated ${newsResults.affectedRows} news post records.`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during migration:', error.message);
        process.exit(1);
    }
}

migratePaths();
