const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/locationUploadMiddleware');

router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.post('/', verifyToken, authorize('admin'), upload.single('image'), locationController.createLocation);
router.put('/:id', verifyToken, authorize('admin'), upload.single('image'), locationController.updateLocation);
router.delete('/:id', verifyToken, authorize('admin'), locationController.deleteLocation);

module.exports = router;
