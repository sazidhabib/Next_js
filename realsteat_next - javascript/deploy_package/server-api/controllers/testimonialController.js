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

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_testimonials ORDER BY id DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new testimonial
exports.createTestimonial = async (req, res) => {
    const { name, designation, review, rating } = req.body;

    try {
        let image_url = null;

        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const outputFilename = await processImage(req.file);
            image_url = `${serverUrl}/uploads/frames/${outputFilename}`;
        }

        const [result] = await pool.query(
            'INSERT INTO re_testimonials (name, designation, review, rating, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, designation || null, review, rating || 5, image_url]
        );

        res.status(201).json({ id: result.insertId, name, designation, review, rating: Number(rating || 5), image_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    const { name, designation, review, rating } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM re_testimonials WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Testimonial not found' });

        let image_url = req.body.image_url || existing[0].image_url;

        if (req.file) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const outputFilename = await processImage(req.file);
            image_url = `${serverUrl}/uploads/frames/${outputFilename}`;
        }

        await pool.query(
            'UPDATE re_testimonials SET name = ?, designation = ?, review = ?, rating = ?, image_url = ? WHERE id = ?',
            [name, designation || null, review, rating || 5, image_url, req.params.id]
        );

        res.status(200).json({ id: req.params.id, name, designation, review, rating: Number(rating || 5), image_url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM re_testimonials WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Testimonial not found' });
        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
