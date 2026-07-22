const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const checkPermission = require('../middlewares/permission-middleware');
const userController = require('../controllers/user-controller');

// All routes require admin authentication
router.use(authMiddleware);

// GET /api/users — List all users
router.get('/', checkPermission('users', 'view'), userController.getAllUsers);

// GET /api/users/:id — Get single user
router.get('/:id', checkPermission('users', 'view'), userController.getUserById);

// POST /api/users — Create new user
router.post('/', checkPermission('users', 'edit'), userController.createUser);

// PUT /api/users/:id — Update user
router.put('/:id', checkPermission('users', 'edit'), userController.updateUser);

// DELETE /api/users/:id — Delete user
router.delete('/:id', checkPermission('users', 'delete'), userController.deleteUser);

// PUT /api/users/:id/reset-password — Reset password
router.put('/:id/reset-password', checkPermission('users', 'edit'), userController.resetPassword);

module.exports = router;
