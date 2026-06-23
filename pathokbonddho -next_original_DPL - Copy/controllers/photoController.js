const fs = require('fs');
const path = require('path');
const Photo = require('../models/photo');
const Album = require('../models/album');
const ImageRegistry = require('../models/imageRegistry');
const ImageService = require('../services/imageService');
const News = require('../models/news-model');

// NEW: Get all images from all sources
exports.getAllImages = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, sourceType } = req.query;

        console.log('📸 Fetching all images - Page:', page, 'Limit:', limit, 'Source:', sourceType);

        // Simple query without associations
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (sourceType) {
            whereClause.sourceType = sourceType;
        }

        // Get total count
        const totalCount = await ImageRegistry.count({ where: whereClause });

        // Get paginated data
        const images = await ImageRegistry.findAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        console.log(`✅ Found ${images.length} images (total: ${totalCount})`);

        // Update the transform part in getAllImages function:
        const transformedImages = await Promise.all(images.map(async (img) => {
            // Get additional info based on source type
            let relatedInfo = {};
            let sourceTitle = '';

            try {
                if (img.sourceType === 'news') { // ADD THIS
                    const news = await News.findByPk(img.sourceId);
                    if (news) {
                        relatedInfo.title = news.newsHeadline;
                        sourceTitle = `News: ${news.newsHeadline}`;
                    }
                } else if (img.sourceType === 'photo') {
                    const photo = await Photo.findByPk(img.sourceId, {
                        include: [{
                            model: Album,
                            attributes: ['id', 'name']
                        }]
                    });
                    if (photo) {
                        relatedInfo.caption = photo.caption;
                        relatedInfo.albumId = photo.albumId;
                        relatedInfo.albumName = photo.Album?.name || null;
                        sourceTitle = `Photo: ${photo.caption || 'No caption'}`;
                    }
                }
            } catch (error) {
                console.warn(`Could not fetch related info for ${img.sourceType} ${img.sourceId}:`, error.message);
            }

            // Fix image URL - ensure it starts with uploads/
            let imageUrl = img.filePath;

            // Check if the path needs 'uploads/' prefix
            if (!imageUrl.includes('uploads/') && !imageUrl.includes('/uploads/')) {
                // It's just a filename like 'image-1748248838166.webp'
                imageUrl = `uploads/${imageUrl}`;
            } else if (imageUrl.startsWith('/') && !imageUrl.includes('uploads/')) {
                // It's like '/image-1748248838166.webp'
                imageUrl = `uploads${imageUrl}`;
            }

            // Clean up any double slashes
            imageUrl = imageUrl.replace(/([^:]\/)\/+/g, '$1');

            return {
                id: img.id,
                filename: img.filename,
                imageUrl: imageUrl,
                source: img.sourceType,
                caption: relatedInfo.caption || '',
                albumId: relatedInfo.albumId || null,
                albumName: relatedInfo.albumName || null,
                isManaged: img.sourceType === 'photo',
                sourceTitle: sourceTitle,
                relatedEntity: {
                    news: img.sourceType === 'news' ? { id: img.sourceId, title: relatedInfo.title } : null, // ADD THIS
                    photo: img.sourceType === 'photo' ? { id: img.sourceId, caption: relatedInfo.caption } : null
                },
                createdAt: img.createdAt,
                updatedAt: img.updatedAt
            };
        }));

        res.status(200).json({
            success: true,
            images: transformedImages,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalCount: totalCount
            }
        });
    } catch (error) {
        console.error('❌ Error in getAllImages:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch images: ' + error.message
        });
    }
};

// NEW: Add existing image to photo gallery
exports.addToGallery = async (req, res, next) => {
    try {
        const { filename, caption = '', albumId = null } = req.body;

        console.log('🎨 Adding image to gallery:', { filename, caption, albumId });

        // Find the image in registry
        const imageRecord = await ImageRegistry.findOne({ where: { filename } });

        if (!imageRecord) {
            return res.status(404).json({
                success: false,
                message: 'Image not found in registry'
            });
        }

        // Validate album exists if provided
        if (albumId) {
            const album = await Album.findByPk(albumId);
            if (!album) {
                return res.status(404).json({
                    success: false,
                    message: 'Album not found'
                });
            }
        }

        // Create photo entry
        const photo = await Photo.create({
            imageUrl: imageRecord.filePath,
            caption: caption.trim(),
            albumId: albumId || null
        });

        // Update the image registry to change source type
        await imageRecord.update({
            sourceType: 'photo',
            sourceId: photo.id
        });

        res.status(201).json({
            success: true,
            message: 'Image added to gallery successfully',
            photo: {
                id: photo.id,
                imageUrl: photo.imageUrl,
                caption: photo.caption,
                albumId: photo.albumId
            }
        });
    } catch (error) {
        console.error('❌ Error adding to gallery:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add image to gallery'
        });
    }
};

// UPDATED: Upload multiple photos - now registers images
exports.uploadMultiplePhotos = async (req, res, next) => {
    try {
        console.log('🔥 Request received - uploadMultiplePhotos');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const { albumId, caption } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required.' });
        }

        // Check if album exists (ONLY if albumId is provided)
        let album = null;
        if (albumId && albumId !== 'null' && albumId !== 'undefined') {
            album = await Album.findByPk(albumId);
            if (!album) {
                return res.status(404).json({ message: 'Album not found' });
            }
        }

        const createdPhotos = [];
        const registeredImages = [];

        for (const file of files) {
            // Now file.path should be set by convertToWebp middleware
            if (!file || !file.path) {
                console.error('File or file.path is undefined after conversion:', file);
                continue;
            }

            const filePath = file.path.replace(/\\/g, '/');
            const filename = path.basename(filePath);

            let photoId = null;

            // Only create Photo records if an album exists
            if (album) {
                // Optional: Prevent duplicates per album
                const existing = await Photo.findOne({
                    where: {
                        imageUrl: filePath,
                        albumId: albumId
                    }
                });

                if (!existing) {
                    const photo = await Photo.create({
                        imageUrl: filePath,
                        albumId: albumId,
                        caption: caption?.trim() || '',
                    });
                    photoId = photo.id;
                    createdPhotos.push(photo);
                } else {
                    photoId = existing.id;
                }
            }

            // NEW: Register image in centralized registry (ALWAYS)
            await ImageService.registerImage(
                filename,
                filePath,
                album ? 'photo' : 'other',
                photoId,
                file.mimetype,
                file.size
            );

            registeredImages.push({
                filename,
                imageUrl: filePath,
                source: album ? 'photo' : 'other'
            });
        }

        if (registeredImages.length === 0) {
            return res.status(400).json({ message: 'No valid files were processed' });
        }

        // Return created photos if any, otherwise return registered info
        res.status(201).json(createdPhotos.length > 0 ? createdPhotos : { 
            message: 'Images registered successfully',
            images: registeredImages 
        });
    } catch (error) {
        console.error('❌ Error in uploadMultiplePhotos:', error);
        next(error);
    }
};

// UPDATED: Delete photo - now handles image registry
exports.deletePhoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { deleteFromFS = false } = req.body; // Get delete option from frontend

        console.log('🗑️ Deleting photo:', id, 'Delete from FS:', deleteFromFS);

        const photo = await Photo.findByPk(id);

        if (!photo) return res.status(404).json({ message: 'Photo not found' });

        // Find the image in registry
        const imageRecord = await ImageRegistry.findOne({
            where: {
                sourceType: 'photo',
                sourceId: id
            }
        });

        // Delete image file if requested
        if (deleteFromFS) {
            try {
                if (photo.imageUrl && fs.existsSync(path.join(__dirname, '..', photo.imageUrl))) {
                    fs.unlinkSync(path.join(__dirname, '..', photo.imageUrl));
                    console.log('✅ Image file deleted from filesystem');
                }
            } catch (err) {
                console.warn('⚠️ Could not delete image file:', err.message);
            }
        }

        // Delete from photo table
        await Photo.destroy({
            where: { id: id }
        });

        // NEW: Also delete from image registry if it exists
        if (imageRecord) {
            await ImageRegistry.destroy({
                where: { id: imageRecord.id }
            });
            console.log('✅ Image removed from registry');
        }

        res.status(200).json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error in deletePhoto:', error);
        next(error);
    }
};

// UPDATED: Update photo - now updates registry if needed
exports.updatePhoto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const photo = await Photo.findByPk(id);

        if (!photo) return res.status(404).json({ message: 'Photo not found' });

        // If a new image is uploaded, delete old image and update registry
        if (req.file && req.file.path) {
            const newFilePath = req.file.path.replace(/\\/g, '/');
            const newFilename = path.basename(newFilePath);

            // Delete old image file
            try {
                if (photo.imageUrl && fs.existsSync(path.join(__dirname, '..', photo.imageUrl))) {
                    fs.unlinkSync(path.join(__dirname, '..', photo.imageUrl));
                }
            } catch (err) {
                console.warn('Could not delete old image:', err.message);
            }

            // Update photo record
            photo.imageUrl = newFilePath;

            // NEW: Update image registry
            const imageRecord = await ImageRegistry.findOne({
                where: {
                    sourceType: 'photo',
                    sourceId: id
                }
            });

            if (imageRecord) {
                await imageRecord.update({
                    filename: newFilename,
                    filePath: newFilePath,
                    mimeType: req.file.mimetype,
                    fileSize: req.file.size
                });
            } else {
                // Create new registry entry if doesn't exist
                await ImageService.registerImage(
                    newFilename,
                    newFilePath,
                    'photo',
                    id,
                    req.file.mimetype,
                    req.file.size
                );
            }
        }

        // Update album if sent
        if (req.body.albumId) {
            photo.albumId = req.body.albumId;
        }

        // Update caption if sent
        if (req.body.caption !== undefined) {
            photo.caption = req.body.caption === 'undefined' ? '' : req.body.caption.trim();
        }

        await photo.save();

        // Include album info in response
        const updatedPhoto = await Photo.findByPk(id, {
            include: [{ model: Album }]
        });

        res.status(200).json(updatedPhoto);
    } catch (error) {
        next(error);
    }
};

// Keep existing methods (they should work as before)
exports.getAllPhotos = async (req, res, next) => {
    try {
        const photos = await Photo.findAll({
            include: [{ model: Album }]
        });
        res.status(200).json(photos);
    } catch (error) {
        next(error);
    }
};

exports.getPhotosByAlbum = async (req, res, next) => {
    try {
        const { albumId } = req.params;
        const photos = await Photo.findAll({
            where: { albumId: albumId },
            include: [{ model: Album }]
        });
        res.status(200).json(photos);
    } catch (error) {
        next(error);
    }
};

// NEW: Scan and register existing images (for migration)
exports.scanExistingImages = async (req, res, next) => {
    try {
        console.log('🔄 Scanning and registering existing images...');

        await ImageService.scanAndRegisterExistingImages();

        // Also register images from news
        await registerNewsImages();

        res.status(200).json({
            success: true,
            message: 'Image scanning and registration completed successfully'
        });
    } catch (error) {
        console.error('❌ Error scanning images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to scan and register images'
        });
    }
};


async function registerNewsImages() {
    try {
        const newsList = await News.findAll();
        let registeredCount = 0;

        for (const news of newsList) {
            // Register leadImage if exists
            if (news.leadImage && news.leadImage.trim() !== '') {
                const filename = path.basename(news.leadImage);
                await ImageService.registerImage(
                    filename,
                    news.leadImage,
                    'news',
                    news.id
                );
                registeredCount++;
            }

            // Register thumbImage if exists
            if (news.thumbImage && news.thumbImage.trim() !== '') {
                const filename = path.basename(news.thumbImage);
                await ImageService.registerImage(
                    filename,
                    news.thumbImage,
                    'news',
                    news.id
                );
                registeredCount++;
            }

            // Register metaImage if exists
            if (news.metaImage && news.metaImage.trim() !== '') {
                const filename = path.basename(news.metaImage);
                await ImageService.registerImage(
                    filename,
                    news.metaImage,
                    'news',
                    news.id
                );
                registeredCount++;
            }
        }

        console.log(`✅ Registered ${registeredCount} news images`);
    } catch (error) {
        console.error('Error registering news images:', error);
    }
}

exports.deleteImageFromRegistry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { deleteFromFS = false } = req.body;

        console.log('🗑️ Deleting image from registry:', id);

        const imageRecord = await ImageRegistry.findByPk(id);

        if (!imageRecord) {
            return res.status(404).json({
                success: false,
                message: 'Image not found in registry'
            });
        }

        // Delete image file if requested
        if (deleteFromFS) {
            try {
                if (imageRecord.filePath && fs.existsSync(path.join(__dirname, '..', imageRecord.filePath))) {
                    fs.unlinkSync(path.join(__dirname, '..', imageRecord.filePath));
                    console.log('✅ Image file deleted from filesystem');
                }
            } catch (err) {
                console.warn('⚠️ Could not delete image file:', err.message);
            }
        }

        // Delete from registry
        await imageRecord.destroy();

        res.status(200).json({
            success: true,
            message: 'Image deleted from registry successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting image from registry:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete image from registry'
        });
    }
};



// NEW: Convert image to photo (for orphaned images)
exports.convertToPhoto = async (req, res, next) => {
    try {
        const { registryId, caption = '', albumId = null } = req.body;

        console.log('🔄 Converting image to photo:', { registryId, caption, albumId });

        // Find the image in registry
        const imageRecord = await ImageRegistry.findByPk(registryId);

        if (!imageRecord) {
            return res.status(404).json({
                success: false,
                message: 'Image not found in registry'
            });
        }

        // If no albumId provided, use a default album
        let targetAlbumId = albumId;
        if (!targetAlbumId) {
            // Find or create a "Default" album
            const [defaultAlbum] = await Album.findOrCreate({
                where: { name: 'Uncategorized' },
                defaults: {
                    name: 'Uncategorized',
                    description: 'Default album for images without album'
                }
            });
            targetAlbumId = defaultAlbum.id;
        } else {
            // Validate album exists if provided
            const album = await Album.findByPk(targetAlbumId);
            if (!album) {
                return res.status(404).json({
                    success: false,
                    message: 'Album not found'
                });
            }
        }

        // Create photo entry
        const photo = await Photo.create({
            imageUrl: imageRecord.filePath,
            caption: caption.trim(),
            albumId: targetAlbumId || null
        });

        // Update the image registry to change source type
        await imageRecord.update({
            sourceType: 'photo',
            sourceId: photo.id
        });

        res.status(201).json({
            success: true,
            message: 'Image converted to photo successfully',
            photo: {
                id: photo.id,
                imageUrl: photo.imageUrl,
                caption: photo.caption,
                albumId: photo.albumId
            }
        });
    } catch (error) {
        console.error('❌ Error converting image to photo:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to convert image to photo' + error.message
        });
    }
};