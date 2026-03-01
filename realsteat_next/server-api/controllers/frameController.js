const pool = require('../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Get all frames
exports.getAllFrames = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT f.*, c.name as category_name, c.slug as category_slug 
            FROM re_projects f 
            LEFT JOIN re_categories c ON f.category_id = c.id 
            ORDER BY f.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single frame
exports.getFrameById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_projects WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Frame not found' });

        // Increment view count
        await pool.query('UPDATE re_projects SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);

        // Return updated frame (or the one we fetched, doesn't matter much for display)
        // Ideally we should return the fetched one, the view count update is a side effect.
        // If we want to show strict consistency we'd fetch again, but for view counters it's fine.
        rows[0].view_count += 1;

        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Increment Use/Download Count
exports.incrementUseCount = async (req, res) => {
    try {
        const frameId = req.params.id;
        const [result] = await pool.query('UPDATE re_projects SET use_count = use_count + 1 WHERE id = ?', [frameId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Frame not found' });
        }

        res.status(200).json({ message: 'Use count incremented' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper to process image with Sharp
const processImage = async (file) => {
    const { filename, path: inputPath, destination } = file;
    const nameWithoutExt = path.parse(filename).name;
    const outputFilename = `${nameWithoutExt}.webp`;
    const outputPath = path.join(destination, outputFilename);

    await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);

    // Remove original file
    fs.unlinkSync(inputPath);

    return outputFilename;
};

// Create new frame
exports.createFrame = async (req, res) => {
    const { title, category_id, description, is_popular, status, video_url } = req.body;

    try {
        let image_url = null;
        let imagesJson = null;

        if (req.files && req.files.length > 0) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const imageUrls = [];

            for (const file of req.files) {
                const outputFilename = await processImage(file);
                imageUrls.push(`${serverUrl}/uploads/frames/${outputFilename}`);
            }

            image_url = imageUrls[0]; // First image as thumbnail
            imagesJson = JSON.stringify(imageUrls);
        }

        // Enforce pending status for non-admins regardless of input
        const userRole = req.user ? req.user.role : 'user';
        const initialStatus = userRole === 'admin' ? (status || 'active') : 'pending';

        const [result] = await pool.query(
            'INSERT INTO re_projects (title, image_url, images, video_url, category_id, description, is_popular, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, image_url, imagesJson, video_url || null, category_id || null, description, is_popular === 'true' || is_popular === true, initialStatus, req.user ? req.user.id : null]
        );
        res.status(201).json({ id: result.insertId, title, image_url, images: imagesJson ? JSON.parse(imagesJson) : [], video_url: video_url || null, category_id, description, is_popular, status: initialStatus, user_id: req.user ? req.user.id : null });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update frame
exports.updateFrame = async (req, res) => {
    const { title, category_id, description, is_popular, status, video_url } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // 1. Fetch existing frame to check ownership
        const [existing] = await pool.query('SELECT * FROM re_projects WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Frame not found' });

        const frame = existing[0];

        // 2. Permission Check
        const isOwner = frame.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access Denied: You can only edit your own frames.' });
        }

        // 3. Status Change Restriction
        let newStatus = status;
        if (status && status !== frame.status && !isAdmin) {
            newStatus = frame.status;
        }
        if (!newStatus) newStatus = frame.status;

        // 4. Handle images
        let image_url = req.body.image_url || frame.image_url;
        let imagesJson = frame.images || null;

        if (req.files && req.files.length > 0) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const imageUrls = [];

            for (const file of req.files) {
                const outputFilename = await processImage(file);
                imageUrls.push(`${serverUrl}/uploads/frames/${outputFilename}`);
            }

            image_url = imageUrls[0];
            imagesJson = JSON.stringify(imageUrls);
        }

        // 5. Handle video_url
        const newVideoUrl = video_url !== undefined ? (video_url || null) : frame.video_url;

        const [result] = await pool.query(
            'UPDATE re_projects SET title = ?, image_url = ?, images = ?, video_url = ?, category_id = ?, description = ?, is_popular = ?, status = ? WHERE id = ?',
            [title, image_url, imagesJson, newVideoUrl, category_id || null, description, is_popular === 'true' || is_popular === true, newStatus, req.params.id]
        );

        res.status(200).json({ message: 'Frame updated successfully', image_url, images: imagesJson ? JSON.parse(imagesJson) : [], video_url: newVideoUrl, status: newStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete frame
exports.deleteFrame = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // 1. Fetch existing frame
        const [existing] = await pool.query('SELECT * FROM re_projects WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Frame not found' });

        const frame = existing[0];

        // 2. Permission Check
        const isOwner = frame.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access Denied: You can only delete your own frames.' });
        }

        const [result] = await pool.query('DELETE FROM re_projects WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Frame deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get frames by logged in user
exports.getMyFrames = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query('SELECT f.*, c.name as category_name FROM re_projects f LEFT JOIN re_categories c ON f.category_id = c.id WHERE f.user_id = ? ORDER BY f.created_at DESC', [userId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Stats
exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Total Frames
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM re_projects WHERE user_id = ?', [userId]);
        const total = totalRows[0].count;

        // Live Frames (active)
        const [liveRows] = await pool.query('SELECT COUNT(*) as count FROM re_projects WHERE user_id = ? AND status = "active"', [userId]);
        const live = liveRows[0].count;

        // Pending Frames
        const [pendingRows] = await pool.query('SELECT COUNT(*) as count FROM re_projects WHERE user_id = ? AND status = "pending"', [userId]);
        const pending = pendingRows[0].count;

        // Rejected Frames
        const [rejectedRows] = await pool.query('SELECT COUNT(*) as count FROM re_projects WHERE user_id = ? AND status = "rejected"', [userId]);
        const rejected = rejectedRows[0].count;

        // Trash Frames
        const [trashRows] = await pool.query('SELECT COUNT(*) as count FROM re_projects WHERE user_id = ? AND status = "trash"', [userId]);
        const trash = trashRows[0].count;

        res.status(200).json({ total, live, pending, rejected, trash });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
