const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', testimonialController.getAllTestimonials);
router.post('/', verifyToken, authorize(['admin']), upload.single('image'), testimonialController.createTestimonial);
router.put('/:id', verifyToken, authorize(['admin']), upload.single('image'), testimonialController.updateTestimonial);
router.delete('/:id', verifyToken, authorize(['admin']), testimonialController.deleteTestimonial);

module.exports = router;
