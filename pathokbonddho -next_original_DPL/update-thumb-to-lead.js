/**
 * Migration Script: Copy leadImage path into thumbImage
 * 
 * This script updates all news records where leadImage exists,
 * setting thumbImage = leadImage so that the thumbnail displays
 * the same high-resolution image as the lead news.
 */

const { Sequelize } = require("sequelize");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT || 3306,
        dialect: "mysql",
        logging: false,
    }
);

async function main() {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to MySQL database.");

        // First, show current state
        const [countResult] = await sequelize.query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN leadImage IS NOT NULL AND leadImage != '' THEN 1 ELSE 0 END) as hasLeadImage,
                SUM(CASE WHEN thumbImage IS NOT NULL AND thumbImage != '' THEN 1 ELSE 0 END) as hasThumbImage,
                SUM(CASE WHEN leadImage IS NOT NULL AND leadImage != '' AND (thumbImage IS NULL OR thumbImage = '' OR thumbImage != leadImage) THEN 1 ELSE 0 END) as needsUpdate
            FROM news`
        );
        
        const stats = countResult[0];
        console.log(`\n📊 Current state:`);
        console.log(`   Total news records: ${stats.total}`);
        console.log(`   Records with leadImage: ${stats.hasLeadImage}`);
        console.log(`   Records with thumbImage: ${stats.hasThumbImage}`);
        console.log(`   Records needing update (leadImage → thumbImage): ${stats.needsUpdate}`);

        if (parseInt(stats.needsUpdate) === 0) {
            console.log("\n✅ All thumbImage fields already match leadImage. No updates needed.");
            process.exit(0);
        }

        // Update thumbImage = leadImage where leadImage exists
        const [result] = await sequelize.query(
            `UPDATE news 
             SET thumbImage = leadImage 
             WHERE leadImage IS NOT NULL 
               AND leadImage != '' 
               AND (thumbImage IS NULL OR thumbImage = '' OR thumbImage != leadImage)`
        );

        console.log(`\n✅ Updated ${result.affectedRows} records: thumbImage = leadImage`);

        // Verify the update
        const [verifyResult] = await sequelize.query(
            `SELECT 
                SUM(CASE WHEN leadImage IS NOT NULL AND leadImage != '' AND thumbImage = leadImage THEN 1 ELSE 0 END) as matching,
                SUM(CASE WHEN leadImage IS NOT NULL AND leadImage != '' AND (thumbImage IS NULL OR thumbImage != leadImage) THEN 1 ELSE 0 END) as notMatching
            FROM news`
        );

        const verify = verifyResult[0];
        console.log(`\n📊 After update:`);
        console.log(`   Records where thumbImage = leadImage: ${verify.matching}`);
        console.log(`   Records where thumbImage ≠ leadImage: ${verify.notMatching}`);
        console.log("\n✅ Migration complete!");

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

main();
