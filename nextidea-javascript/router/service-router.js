const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth-middleware');

router.get('/', authMiddleware, serviceController.getServices);
router.get('/:id', authMiddleware, serviceController.getServiceById);
router.post('/', adminMiddleware, serviceController.createService);
router.put('/:id', adminMiddleware, serviceController.updateService);
router.delete('/:id', adminMiddleware, serviceController.deleteService);

module.exports = router;
