const sequelize = require('./db/database');

async function check() {
    try {
        const [results] = await sequelize.query("SHOW COLUMNS FROM image_registry LIKE 'sourceId';");
        console.log('Column Info:', results[0]);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
