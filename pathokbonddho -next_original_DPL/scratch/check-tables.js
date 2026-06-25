const sequelize = require('../db/database');
async function test() {
    try {
        await sequelize.authenticate();
        console.log("✅ Successfully connected to database.");
        const [tables] = await sequelize.query("SHOW TABLES");
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log("📋 Tables in database:", tableNames);
        
        if (tableNames.includes('photocard_images')) {
            const [desc] = await sequelize.query("DESCRIBE photocard_images");
            console.log("✅ Columns in photocard_images table:");
            desc.forEach(c => console.log(`  - ${c.Field}: ${c.Type} (Null: ${c.Null})`));
        } else {
            console.error("❌ photocard_images table does NOT exist yet!");
        }
    } catch (e) {
        console.error("❌ Test script failed:", e);
    } finally {
        await sequelize.close();
    }
}
test();
