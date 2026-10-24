const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const photoController = require('../controllers/photoController');
const { upload, convertToWebp } = require('../middlewares/multer-config');
const authMiddleware = require('../middlewares/auth-middleware');
const checkPermission = require('../middlewares/permission-middleware');

// ========== CENTRALIZED IMAGE MANAGEMENT ROUTES ==========
router.get('/all/images', authMiddleware, photoController.getAllImages);
router.post('/add-to-gallery', authMiddleware, checkPermission('gallery', 'edit'), photoController.addToGallery);
router.post('/convert-to-photo', authMiddleware, checkPermission('gallery', 'edit'), photoController.convertToPhoto);
router.delete('/registry/:id', authMiddleware, checkPermission('gallery', 'delete'), photoController.deleteImageFromRegistry);

// ========== ALBUM ROUTES ==========
// Album CRUD (Admin only)
router.post('/albums', authMiddleware, checkPermission('gallery', 'edit'), albumController.createAlbum);
router.patch('/albums/:id', authMiddleware, checkPermission('gallery', 'edit'), albumController.updateAlbum);
router.delete('/albums/:id', authMiddleware, checkPermission('gallery', 'delete'), albumController.deleteAlbum);

// Album GET - no auth required
router.get('/albums', albumController.getAllAlbums);

// ========== PHOTO ROUTES ==========
// Photo CRUD (Admin only)
router.post('/upload', authMiddleware, checkPermission('gallery', 'edit'), upload.array('images', 20), convertToWebp('post_image'), photoController.uploadMultiplePhotos);
router.patch('/:id', authMiddleware, checkPermission('gallery', 'edit'), upload.single('image'), convertToWebp(), photoController.updatePhoto);
router.delete('/:id', authMiddleware, checkPermission('gallery', 'delete'), photoController.deletePhoto);

// Photo GET - no auth required
router.get('/:albumId', photoController.getPhotosByAlbum);
router.get('/', photoController.getAllPhotos);

module.exports = router;