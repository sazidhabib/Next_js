const express = require('express');
const publicRouter = express.Router();
const adminRouter = express.Router();
const settingsController = require('../controllers/settingsController');
const { adminMiddleware } = require('../middlewares/auth-middleware');

// Public routes
publicRouter.get('/', settingsController.getPublicSettings);

// Admin routes
adminRouter.get('/', adminMiddleware, settingsController.getSettings);
adminRouter.put('/', adminMiddleware, settingsController.updateSettings);

module.exports = {
    publicRouter,
    adminRouter
};
