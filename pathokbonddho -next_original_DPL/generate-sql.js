const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

    console.log('-- SQL to insert orphaned images from uploads folder\n');

    files.forEach(file => {
        const fileExt = path.extname(file).toLowerCase();
        if (imageExtensions.includes(fileExt)) {
            console.log(`INSERT INTO image_registry (filename, filePath, sourceType, sourceId) VALUES ('${file}', 'uploads/${file}', 'other', 0);`);
        }
    });
}