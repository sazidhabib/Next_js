const sequelize = require("./db/database");
const { Page } = require("./models");

async function checkPages() {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");
        const pages = await Page.findAll();
        console.log("Total Pages:", pages.length);
        pages.forEach(p => {
            console.log(`ID: ${p.id}, Name: "${p.name}", Status: ${p.isActive}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkPages();
