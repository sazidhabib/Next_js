const Ad = require("./models/ad-model");
const sequelize = require("./db/database");
const { Op } = require("sequelize");

async function checkAds() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const ads = await Ad.findAll();
        console.log(`\nTotal ads in database: ${ads.length}`);

        console.log('\n--- Active Ads Details ---');
        ads.filter(ad => ad.isActive).forEach(ad => {
            console.log(`ID: ${ad.id}`);
            console.log(`Name: ${ad.name}`);
            console.log(`Position: ${ad.position}`);
            console.log(`DisplayPages: ${ad.displayPages}`);
            console.log(`Dates: ${ad.startDate} to ${ad.endDate}`);
            console.log(`Impressions: ${ad.currentImpressions} / ${ad.maxImpressions}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkAds();
