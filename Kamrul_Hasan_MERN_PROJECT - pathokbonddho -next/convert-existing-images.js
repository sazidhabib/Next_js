const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './uploads';
const outputDir = './uploads_webp';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir);

files.forEach((file) => {
    const ext = path.extname(file); // Keep original case for output
    const extLower = ext.toLowerCase();

    if (['.jpg', '.jpeg', '.png'].includes(extLower)) {
        const inputFilePath = path.join(inputDir, file);
        const baseName = path.basename(file, ext); // Remove the original ext (even if it's .JPG)
        const outputFilePath = path.join(outputDir, baseName + '.webp');

        sharp(inputFilePath)
            .webp({ quality: 80 })
            .toFile(outputFilePath)
            .then(() => {
                console.log(`✅ Converted ${file} → ${baseName}.webp`);
            })
            .catch((err) => {
                console.error(`❌ Error converting ${file}:`, err);
            });
    } else {
        console.log(`ℹ️ Skipped (not supported image type): ${file}`);
    }
});
