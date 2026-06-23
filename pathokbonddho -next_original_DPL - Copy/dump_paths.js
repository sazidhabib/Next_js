const sequelize = require('./db/database');

async function dump() {
    try {
        const [rows] = await sequelize.query("SELECT id, filename, filePath, sourceType FROM image_registry ORDER BY id DESC LIMIT 20");
        console.log('ID | Source | Filename | FilePath');
        console.log('-----------------------------------');
        rows.forEach(r => {
            console.log(`${r.id} | ${r.sourceType} | ${r.filename} | ${r.filePath}`);
        });
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
dump();
