const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', pageController.getAllPages);
router.get('/:key', pageController.getPageByKey);
router.put('/:key', verifyToken, authorize(['admin']), upload.single('image'), pageController.upsertPage);

module.exports = router;
