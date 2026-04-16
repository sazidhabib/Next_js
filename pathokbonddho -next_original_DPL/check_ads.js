const sequelize = require('./db/database');

async function checkAds() {
    try {
        console.log('🔍 Checking ads table...');
        const [results] = await sequelize.query("SELECT id, name, position, displayPages, isActive, startDate, endDate, maxImpressions, currentImpressions FROM ads;");
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking ads:', error.message);
        process.exit(1);
    }
}

checkAds();
