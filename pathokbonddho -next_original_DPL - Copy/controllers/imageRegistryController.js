const ImageRegistry = require('../models/imageRegistry');
const Photo = require('../models/photo');
const Album = require('../models/album');

// Get all images with pagination
exports.getAllImages = async (req, res) => {
    try {
        const { page = 1, limit = 20, sourceType } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (sourceType) where.sourceType = sourceType;

        const { count, rows } = await ImageRegistry.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Photo,
                    as: 'photo',
                    attributes: ['id', 'caption', 'albumId'],
                    include: [{
                        model: Album,
                        attributes: ['id', 'name']
                    }],
                    required: false
                }
            ]
        });

        res.json({
            success: true,
            images: rows,
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get single image
exports.getImage = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await ImageRegistry.findByPk(id, {
            include: [
                {
                    model: Photo,
                    as: 'photo',
                    attributes: ['id', 'caption', 'albumId'],
                    include: [{ model: Album, attributes: ['id', 'name'] }]
                }
            ]
        });

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        res.json({ success: true, image });
    } catch (error) {
        console.error('Error getting image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete image
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleteFromFS = false } = req.body;

        const image = await ImageRegistry.findByPk(id);

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Optional: Delete file from filesystem
        if (deleteFromFS) {
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, '..', image.filePath);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await image.destroy();

        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Search images
exports.searchImages = async (req, res) => {
    try {
        const { query } = req.query;

        const images = await ImageRegistry.findAll({
            where: {
                filename: {
                    [Sequelize.Op.like]: `%${query}%`
                }
            },
            limit: 20,
            order: [['filename', 'ASC']]
        });

        res.json({ success: true, images });
    } catch (error) {
        console.error('Error searching images:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};