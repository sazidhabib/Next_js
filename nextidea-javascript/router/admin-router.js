const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminMiddleware } = require('../middlewares/auth-middleware');

router.get('/dashboard', adminMiddleware, adminController.getDashboard);
router.get('/analytics', adminMiddleware, adminController.getAnalytics);

module.exports = router;
