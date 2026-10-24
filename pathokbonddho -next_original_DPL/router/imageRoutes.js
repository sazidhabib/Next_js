const express = require('express');
const router = express.Router();
const { getAllImages, addImageToGallery, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middlewares/auth-middleware'); // Adjust path as needed
const checkPermission = require('../middlewares/permission-middleware');

// Get all images (from uploads folder and database)
router.get('/all', authMiddleware, getAllImages);

// Add existing image to photo gallery
router.post('/add-to-gallery', authMiddleware, checkPermission('gallery', 'edit'), addImageToGallery);

// Delete image (with option to delete from filesystem)
router.delete('/:id', authMiddleware, checkPermission('gallery', 'delete'), deleteImage);

module.exports = router;