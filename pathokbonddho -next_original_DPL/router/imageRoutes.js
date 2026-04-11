const express = require('express');
const router = express.Router();
const { getAllImages, addImageToGallery, deleteImage } = require('../controllers/imageController');
const authMiddleware = require('../middlewares/auth-middleware'); // Adjust path as needed

// Get all images (from uploads folder and database)
router.get('/all', authMiddleware, getAllImages);

// Add existing image to photo gallery
router.post('/add-to-gallery', authMiddleware, addImageToGallery);

// Delete image (with option to delete from filesystem)
router.delete('/:id', authMiddleware, deleteImage);

module.exports = router;