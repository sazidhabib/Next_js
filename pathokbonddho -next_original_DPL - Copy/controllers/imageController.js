const fs = require("fs");
const path = require("path");
const { Photo } = require("../models"); // Adjust path as needed

// Get all images from uploads folder and database
const getAllImages = async (req, res) => {
    try {
        const uploadsDir = path.join(process.cwd(), 'uploads');

        // Check if uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
            return res.status(200).json({
                success: true,
                images: [],
                message: "Uploads directory does not exist"
            });
        }

        // Read all files from uploads directory
        const files = fs.readdirSync(uploadsDir);

        // Filter only image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        });

        // Get photos from database to check which images are managed
        const dbPhotos = await Photo.findAll({
            include: ['Album']
        });

        // Create a map of image URLs to photo data
        const dbPhotoMap = {};
        dbPhotos.forEach(photo => {
            if (photo.imageUrl) {
                const filename = path.basename(photo.imageUrl);
                dbPhotoMap[filename] = photo;
            }
        });

        // Combine file system images with database data
        const allImages = imageFiles.map(filename => {
            const imageUrl = `/uploads/${filename}`;
            const dbPhoto = dbPhotoMap[filename];

            return {
                id: dbPhoto ? dbPhoto.id : `fs-${filename}`, // Use DB ID or filesystem ID
                filename: filename,
                imageUrl: imageUrl,
                caption: dbPhoto ? dbPhoto.caption : '',
                albumId: dbPhoto ? dbPhoto.albumId : null,
                Album: dbPhoto ? dbPhoto.Album : null,
                isManaged: !!dbPhoto, // Whether this image is in the photos table
                createdAt: dbPhoto ? dbPhoto.createdAt : fs.statSync(path.join(uploadsDir, filename)).birthtime,
                source: dbPhoto ? 'photo_gallery' : 'other_upload' // Track where it came from
            };
        });

        // Sort by creation date, newest first
        allImages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({
            success: true,
            images: allImages,
            total: allImages.length
        });

    } catch (error) {
        console.error("Error fetching all images:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch images",
            error: error.message
        });
    }
};

// Add image to photo gallery (create photo record)
const addImageToGallery = async (req, res) => {
    try {
        const { filename, caption, albumId } = req.body;

        // Validate required fields
        if (!filename) {
            return res.status(400).json({
                success: false,
                message: "Filename is required"
            });
        }

        // Check if image already exists in photos table
        const existingPhoto = await Photo.findOne({
            where: { imageUrl: `/uploads/${filename}` }
        });

        if (existingPhoto) {
            return res.status(400).json({
                success: false,
                message: "Image is already in photo gallery"
            });
        }

        // Create new photo record
        const newPhoto = await Photo.create({
            imageUrl: `/uploads/${filename}`,
            caption: caption || '',
            albumId: albumId || null
        });

        // Fetch with album data
        const photoWithAlbum = await Photo.findByPk(newPhoto.id, {
            include: ['Album']
        });

        res.status(201).json({
            success: true,
            message: "Image added to photo gallery successfully",
            photo: photoWithAlbum
        });

    } catch (error) {
        console.error("Error adding image to gallery:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add image to gallery",
            error: error.message
        });
    }
};

// Delete image from filesystem and database
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleteFromFS = false } = req.body;

        // Check if it's a database photo or filesystem image
        if (id.startsWith('fs-')) {
            // Filesystem image - only delete from DB if it exists there
            const filename = id.replace('fs-', '');
            const imageUrl = `/uploads/${filename}`;

            // Find and delete from photos table if exists
            const dbPhoto = await Photo.findOne({ where: { imageUrl } });
            if (dbPhoto) {
                await dbPhoto.destroy();
            }

            // Delete from filesystem if requested
            if (deleteFromFS) {
                const filePath = path.join(process.cwd(), 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            res.status(200).json({
                success: true,
                message: deleteFromFS ?
                    "Image deleted from gallery and filesystem" :
                    "Image removed from gallery"
            });

        } else {
            // Database photo - delete normally
            const photo = await Photo.findByPk(id);

            if (!photo) {
                return res.status(404).json({
                    success: false,
                    message: "Photo not found"
                });
            }

            // Delete from filesystem if requested
            if (deleteFromFS && photo.imageUrl) {
                const filename = path.basename(photo.imageUrl);
                const filePath = path.join(process.cwd(), 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await photo.destroy();

            res.status(200).json({
                success: true,
                message: deleteFromFS ?
                    "Photo deleted from gallery and filesystem" :
                    "Photo deleted from gallery"
            });
        }

    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete image",
            error: error.message
        });
    }
};

module.exports = {
    getAllImages,
    addImageToGallery,
    deleteImage
};