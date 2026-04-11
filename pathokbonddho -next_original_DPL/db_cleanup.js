const { Sequelize } = require('sequelize');
require('dotenv').config();

const s = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false
});

const tablesToDrop = [
    'article', 'articles', 'blogpost', 'blogs', 'blog_posts', 
    'dhaka_prayer_time', 'hero_sections', 'ph_categories', 
    'ph_frames', 'ph_settings', 'ph_users', 'posts', 
    'post_categories', 'post_tags', 'ramadan_times', 
    'sections', 'songs', 'video', 'videos'
];

async function dropTables() {
    console.log("Starting database cleanup...");
    let dropped = 0;
    let failed = 0;

    for (const table of tablesToDrop) {
        try {
            await s.query(`DROP TABLE IF EXISTS \`${table}\``);
            console.log(`✅ Dropped table: ${table}`);
            dropped++;
        } catch (error) {
            console.error(`❌ Failed to drop table ${table}:`, error.message);
            failed++;
        }
    }

    console.log(`\nCleanup complete! Dropped: ${dropped}, Failed: ${failed}`);

    // Verify remaining tables
    try {
        const remaining = await s.getQueryInterface().showAllTables();
        console.log("\nRemaining tables in the database:");
        remaining.forEach(t => console.log(`- ${t}`));
    } catch (e) {
        console.error("Could not list remaining tables:", e);
    } finally {
        await s.close();
    }
}

dropTables();
