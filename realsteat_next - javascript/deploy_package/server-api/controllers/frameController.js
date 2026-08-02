const pool = require('../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const enforceFeaturedProjectsLimit = async () => {
    const [rows] = await pool.query('SELECT id FROM re_projects WHERE is_featured = TRUE ORDER BY featured_clicked_at ASC');
    if (rows.length > 6) {
        const extraCount = rows.length - 6;
        const idsToDeselect = rows.slice(0, extraCount).map(r => r.id);
        await pool.query('UPDATE re_projects SET is_featured = FALSE, featured_clicked_at = NULL WHERE id IN (?)', [idsToDeselect]);
    }
};

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

    // Read file into buffer first to avoid Windows file-locking issues
    const inputBuffer = fs.readFileSync(inputPath);

    const outputBuffer = await sharp(inputBuffer)
        .webp({ quality: 80 })
        .toBuffer();

    // Write processed image
    fs.writeFileSync(outputPath, outputBuffer);

    // Remove original file if it's different from the output
    if (inputPath !== outputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
    }

    return outputFilename;
};

// Create new frame
exports.createFrame = async (req, res) => {
    const { title, category_id, description, is_popular, is_featured, status, video_url, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities, latitude, longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking } = req.body;

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

        // Handle amenities - store as JSON string
        const amenitiesJson = amenities ? (typeof amenities === 'string' ? amenities : JSON.stringify(amenities)) : null;

        const isFeaturedBool = is_featured === 'true' || is_featured === true;
        const featuredClickedAt = isFeaturedBool ? new Date() : null;

        const [result] = await pool.query(
            'INSERT INTO re_projects (title, image_url, images, video_url, category_id, description, is_popular, is_featured, featured_clicked_at, status, user_id, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities, latitude, longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, image_url, imagesJson, video_url || null, category_id || null, description, is_popular === 'true' || is_popular === true, isFeaturedBool, featuredClickedAt, initialStatus, req.user ? req.user.id : null, location || null, location_details || null, price || null, bedrooms || null, bathrooms || null, sqft || null, floors || null, amenitiesJson, latitude || null, longitude || null, land_area || null, land_orientation || null, front_road || null, num_units || null, unit_size || null, num_basements || null, car_parking || null]
        );

        if (isFeaturedBool) {
            await enforceFeaturedProjectsLimit();
        }

        res.status(201).json({ id: result.insertId, title, image_url, images: imagesJson ? JSON.parse(imagesJson) : [], video_url: video_url || null, category_id, description, is_popular, is_featured: isFeaturedBool, status: initialStatus, user_id: req.user ? req.user.id : null, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities: amenitiesJson, latitude: latitude || null, longitude: longitude || null, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update frame
exports.updateFrame = async (req, res) => {
    const { title, category_id, description, is_popular, is_featured, status, video_url, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities, latitude, longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking } = req.body;
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

        // 6. Handle amenities
        const amenitiesJson = amenities !== undefined ? (amenities ? (typeof amenities === 'string' ? amenities : JSON.stringify(amenities)) : null) : frame.amenities;

        // 7. Handle is_featured
        let finalIsFeatured = frame.is_featured;
        let finalFeaturedClickedAt = frame.featured_clicked_at;
        if (is_featured !== undefined) {
            const isFeaturedBool = is_featured === 'true' || is_featured === true;
            if (isFeaturedBool !== (frame.is_featured === 1 || frame.is_featured === true)) {
                finalIsFeatured = isFeaturedBool;
                finalFeaturedClickedAt = isFeaturedBool ? new Date() : null;
            }
        }

        const [result] = await pool.query(
            'UPDATE re_projects SET title = ?, image_url = ?, images = ?, video_url = ?, category_id = ?, description = ?, is_popular = ?, is_featured = ?, featured_clicked_at = ?, status = ?, location = ?, location_details = ?, price = ?, bedrooms = ?, bathrooms = ?, sqft = ?, floors = ?, amenities = ?, latitude = ?, longitude = ?, land_area = ?, land_orientation = ?, front_road = ?, num_units = ?, unit_size = ?, num_basements = ?, car_parking = ? WHERE id = ?',
            [title, image_url, imagesJson, newVideoUrl, category_id || null, description, is_popular === 'true' || is_popular === true, finalIsFeatured, finalFeaturedClickedAt, newStatus, location || null, location_details || null, price || null, bedrooms || null, bathrooms || null, sqft || null, floors || null, amenitiesJson, latitude !== undefined ? (latitude || null) : frame.latitude, longitude !== undefined ? (longitude || null) : frame.longitude, land_area !== undefined ? (land_area || null) : frame.land_area, land_orientation !== undefined ? (land_orientation || null) : frame.land_orientation, front_road !== undefined ? (front_road || null) : frame.front_road, num_units !== undefined ? (num_units || null) : frame.num_units, unit_size !== undefined ? (unit_size || null) : frame.unit_size, num_basements !== undefined ? (num_basements || null) : frame.num_basements, car_parking !== undefined ? (car_parking || null) : frame.car_parking, req.params.id]
        );

        if (finalIsFeatured) {
            await enforceFeaturedProjectsLimit();
        }

        res.status(200).json({ message: 'Frame updated successfully', image_url, images: imagesJson ? JSON.parse(imagesJson) : [], video_url: newVideoUrl, status: newStatus, latitude: latitude !== undefined ? (latitude || null) : frame.latitude, longitude: longitude !== undefined ? (longitude || null) : frame.longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking, location_details });
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
