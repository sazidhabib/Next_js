const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/amenityUploadMiddleware');

router.get('/', amenityController.getAllAmenities);
router.get('/:id', amenityController.getAmenityById);
router.post('/', verifyToken, authorize('admin'), upload.single('icon'), amenityController.createAmenity);
router.put('/:id', verifyToken, authorize('admin'), upload.single('icon'), amenityController.updateAmenity);
router.delete('/:id', verifyToken, authorize('admin'), amenityController.deleteAmenity);

module.exports = router;
