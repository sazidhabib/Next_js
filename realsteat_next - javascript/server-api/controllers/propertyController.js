const pool = require('../config/db');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Get all properties
exports.getAllProperties = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT f.*, c.name as category_name, c.slug as category_slug 
            FROM re_properties f 
            LEFT JOIN re_categories c ON f.category_id = c.id 
            ORDER BY f.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single property
exports.getPropertyById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM re_properties WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Property not found' });

        // Increment view count
        await pool.query('UPDATE re_properties SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);
        rows[0].view_count += 1;

        res.status(200).json(rows[0]);
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

// Create new property
exports.createProperty = async (req, res) => {
    const { title, category_id, description, is_popular, status, video_url, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities, latitude, longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking } = req.body;

    try {
        let image_url = null;
        let imagesJson = null;

        if (req.files && req.files.length > 0) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const imageUrls = [];

            for (const file of req.files) {
                const outputFilename = await processImage(file);
                imageUrls.push(`${serverUrl}/uploads/properties/${outputFilename}`);
            }

            image_url = imageUrls[0]; // First image as thumbnail
            imagesJson = JSON.stringify(imageUrls);
        }

        // Enforce pending status for non-admins regardless of input
        const userRole = req.user ? req.user.role : 'user';
        const initialStatus = userRole === 'admin' ? (status || 'active') : 'pending';

        // Handle amenities - store as JSON string
        const amenitiesJson = amenities ? (typeof amenities === 'string' ? amenities : JSON.stringify(amenities)) : null;

        const [result] = await pool.query(
            'INSERT INTO re_properties (title, image_url, images, video_url, category_id, description, is_popular, status, user_id, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities, latitude, longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, image_url, imagesJson, video_url || null, category_id || null, description, is_popular === 'true' || is_popular === true, initialStatus, req.user ? req.user.id : null, location || null, location_details || null, price || null, bedrooms || null, bathrooms || null, sqft || null, floors || null, amenitiesJson, latitude || null, longitude || null, land_area || null, land_orientation || null, front_road || null, num_units || null, unit_size || null, num_basements || null, car_parking || null]
        );
        res.status(201).json({ id: result.insertId, title, image_url, images: imagesJson ? JSON.parse(imagesJson) : [], video_url: video_url || null, category_id, description, is_popular, status: initialStatus, user_id: req.user ? req.user.id : null, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities: amenitiesJson, latitude: latitude || null, longitude: longitude || null, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Update property
exports.updateProperty = async (req, res) => {
    const { title, category_id, description, is_popular, status, video_url, location, location_details, price, bedrooms, bathrooms, sqft, floors, amenities, latitude, longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // 1. Fetch existing property to check ownership
        const [existing] = await pool.query('SELECT * FROM re_properties WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Property not found' });

        const property = existing[0];

        // 2. Permission Check
        const isOwner = property.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access Denied: You can only edit your own properties.' });
        }

        // 3. Status Change Restriction
        let newStatus = status;
        if (status && status !== property.status && !isAdmin) {
            newStatus = property.status;
        }
        if (!newStatus) newStatus = property.status;

        // 4. Handle images
        let image_url = req.body.image_url || property.image_url;
        let imagesJson = property.images || null;

        if (req.files && req.files.length > 0) {
            const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
            const imageUrls = [];

            for (const file of req.files) {
                const outputFilename = await processImage(file);
                imageUrls.push(`${serverUrl}/uploads/properties/${outputFilename}`);
            }

            image_url = imageUrls[0];
            imagesJson = JSON.stringify(imageUrls);
        }

        // 5. Handle video_url
        const newVideoUrl = video_url !== undefined ? (video_url || null) : property.video_url;

        // 6. Handle amenities
        const amenitiesJson = amenities !== undefined ? (amenities ? (typeof amenities === 'string' ? amenities : JSON.stringify(amenities)) : null) : property.amenities;

        const [result] = await pool.query(
            'UPDATE re_properties SET title = ?, image_url = ?, images = ?, video_url = ?, category_id = ?, description = ?, is_popular = ?, status = ?, location = ?, location_details = ?, price = ?, bedrooms = ?, bathrooms = ?, sqft = ?, floors = ?, amenities = ?, latitude = ?, longitude = ?, land_area = ?, land_orientation = ?, front_road = ?, num_units = ?, unit_size = ?, num_basements = ?, car_parking = ? WHERE id = ?',
            [title, image_url, imagesJson, newVideoUrl, category_id || null, description, is_popular === 'true' || is_popular === true, newStatus, location || null, location_details || null, price || null, bedrooms || null, bathrooms || null, sqft || null, floors || null, amenitiesJson, latitude !== undefined ? (latitude || null) : property.latitude, longitude !== undefined ? (longitude || null) : property.longitude, land_area !== undefined ? (land_area || null) : property.land_area, land_orientation !== undefined ? (land_orientation || null) : property.land_orientation, front_road !== undefined ? (front_road || null) : property.front_road, num_units !== undefined ? (num_units || null) : property.num_units, unit_size !== undefined ? (unit_size || null) : property.unit_size, num_basements !== undefined ? (num_basements || null) : property.num_basements, car_parking !== undefined ? (car_parking || null) : property.car_parking, req.params.id]
        );

        res.status(200).json({ message: 'Property updated successfully', image_url, images: imagesJson ? JSON.parse(imagesJson) : [], video_url: newVideoUrl, status: newStatus, latitude: latitude !== undefined ? (latitude || null) : property.latitude, longitude: longitude !== undefined ? (longitude || null) : property.longitude, land_area, land_orientation, front_road, num_units, unit_size, num_basements, car_parking, location_details });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete property
exports.deleteProperty = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        // 1. Fetch existing property
        const [existing] = await pool.query('SELECT * FROM re_properties WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Property not found' });

        const property = existing[0];

        // 2. Permission Check
        const isOwner = property.user_id === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access Denied: You can only delete your own properties.' });
        }

        const [result] = await pool.query('DELETE FROM re_properties WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get properties by logged in user
exports.getMyProperties = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await pool.query('SELECT f.*, c.name as category_name FROM re_properties f LEFT JOIN re_categories c ON f.category_id = c.id WHERE f.user_id = ? ORDER BY f.created_at DESC', [userId]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get User Stats for properties
exports.getPropertyStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Total
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM re_properties WHERE user_id = ?', [userId]);
        const total = totalRows[0].count;

        // Live
        const [liveRows] = await pool.query('SELECT COUNT(*) as count FROM re_properties WHERE user_id = ? AND status = "active"', [userId]);
        const live = liveRows[0].count;

        // Pending
        const [pendingRows] = await pool.query('SELECT COUNT(*) as count FROM re_properties WHERE user_id = ? AND status = "pending"', [userId]);
        const pending = pendingRows[0].count;

        // Rejected
        const [rejectedRows] = await pool.query('SELECT COUNT(*) as count FROM re_properties WHERE user_id = ? AND status = "rejected"', [userId]);
        const rejected = rejectedRows[0].count;

        // Trash
        const [trashRows] = await pool.query('SELECT COUNT(*) as count FROM re_properties WHERE user_id = ? AND status = "trash"', [userId]);
        const trash = trashRows[0].count;

        res.status(200).json({ total, live, pending, rejected, trash });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
