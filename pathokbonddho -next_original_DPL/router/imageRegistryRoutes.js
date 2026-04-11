const express = require('express');
const router = express.Router();
const imageRegistryController = require('../controllers/imageRegistryController');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/', authMiddleware, imageRegistryController.getAllImages);
router.get('/search', authMiddleware, imageRegistryController.searchImages);
router.get('/:id', authMiddleware, imageRegistryController.getImage);
router.delete('/:id', authMiddleware, imageRegistryController.deleteImage);

module.exports = router;