const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

const { verifyToken, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/propertyUploadMiddleware');

router.get('/', propertyController.getAllProperties);
router.get('/my-properties', verifyToken, propertyController.getMyProperties);
router.get('/stats', verifyToken, propertyController.getPropertyStats);
router.get('/:id', propertyController.getPropertyById);
router.post('/', verifyToken, upload.array('images', 10), propertyController.createProperty);
router.put('/:id', verifyToken, upload.array('images', 10), propertyController.updateProperty);
router.delete('/:id', verifyToken, propertyController.deleteProperty);

module.exports = router;
