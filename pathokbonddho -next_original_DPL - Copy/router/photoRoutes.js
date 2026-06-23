const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const photoController = require('../controllers/photoController');
const { upload, convertToWebp } = require('../middlewares/multer-config');
const authMiddleware = require('../middlewares/auth-middleware');

// ========== CENTRALIZED IMAGE MANAGEMENT ROUTES ==========
router.get('/all/images', authMiddleware, photoController.getAllImages);
router.post('/add-to-gallery', authMiddleware, photoController.addToGallery);
router.post('/convert-to-photo', authMiddleware, photoController.convertToPhoto);
router.delete('/registry/:id', authMiddleware, photoController.deleteImageFromRegistry);

// ========== ALBUM ROUTES ==========
// Album CRUD (Admin only)
router.post('/albums', authMiddleware, albumController.createAlbum);
router.patch('/albums/:id', authMiddleware, albumController.updateAlbum);
router.delete('/albums/:id', authMiddleware, albumController.deleteAlbum);

// Album GET - no auth required
router.get('/albums', albumController.getAllAlbums);

// ========== PHOTO ROUTES ==========
// Photo CRUD (Admin only)
router.post('/upload', authMiddleware, upload.array('images', 20), convertToWebp('post_image'), photoController.uploadMultiplePhotos);
router.patch('/:id', authMiddleware, upload.single('image'), convertToWebp(), photoController.updatePhoto);
router.delete('/:id', authMiddleware, photoController.deletePhoto);

// Photo GET - no auth required
router.get('/:albumId', photoController.getPhotosByAlbum);
router.get('/', photoController.getAllPhotos);

module.exports = router;