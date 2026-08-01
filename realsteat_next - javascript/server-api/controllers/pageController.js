const pool = require('../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Helper to process image with Sharp
const processImage = async (file) => {
    const { filename, path: inputPath, destination } = file;
    const nameWithoutExt = path.parse(filename).name;
    const outputFilename = `${nameWithoutExt}.webp`;
    const outputPath = path.join(destination, outputFilename);

    const inputBuffer = fs.readFileSync(inputPath);
    const outputBuffer = await sharp(inputBuffer)
        .webp({ quality: 80 })
        .toBuffer();

    fs.writeFileSync(outputPath, outputBuffer);

    if (inputPath !== outputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
    }

    return outputFilename;
};

// Get all pages configurations
exports.getAllPages = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_pages');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single page configuration by key
exports.getPageByKey = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_pages WHERE page_key = ?', [req.params.key]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Page configuration not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create or update page configuration
exports.upsertPage = async (req, res) => {
    const { page_key } = req.params;
    const { title, subtitle, content } = req.body;

    try {
        let image_url = req.body.image_url || null;

        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const outputFilename = await processImage(req.file);
            image_url = `${serverUrl}/uploads/frames/${outputFilename}`;
        }

        // Check if page configuration exists
        const [existing] = await pool.query('SELECT * FROM re_pages WHERE page_key = ?', [page_key]);

        if (existing.length > 0) {
            // Update
            const finalImageUrl = image_url !== null ? image_url : existing[0].image_url;
            await pool.query(
                'UPDATE re_pages SET title = ?, subtitle = ?, content = ?, image_url = ? WHERE page_key = ?',
                [title !== undefined ? title : existing[0].title, subtitle !== undefined ? subtitle : existing[0].subtitle, content !== undefined ? content : existing[0].content, finalImageUrl, page_key]
            );
        } else {
            // Insert
            await pool.query(
                'INSERT INTO re_pages (page_key, title, subtitle, content, image_url) VALUES (?, ?, ?, ?, ?)',
                [page_key, title || '', subtitle || '', content || '', image_url]
            );
        }

        const [updated] = await pool.query('SELECT * FROM re_pages WHERE page_key = ?', [page_key]);
        res.status(200).json({ message: 'Page updated successfully', page: updated[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
