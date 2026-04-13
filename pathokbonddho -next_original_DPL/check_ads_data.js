const sequelize = require("./db/database");
const Ad = require("./models/ad-model");

async function checkAds() {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");
        const ads = await Ad.findAll();
        console.log(`Found ${ads.length} ads:`);
        ads.forEach(ad => {
            console.log(`--- Ad: "${ad.name}" (ID: ${ad.id}) ---`);
            console.log(`- Position: ${ad.position}`);
            console.log(`- Display Pages (Raw): ${ad.displayPages}`);
            console.log(`- Is Active: ${ad.isActive}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkAds();
