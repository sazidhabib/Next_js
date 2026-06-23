const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const userController = require('../controllers/user-controller');

// All routes require admin authentication
router.use(authMiddleware);

// GET /api/users — List all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id — Get single user
router.get('/:id', userController.getUserById);

// POST /api/users — Create new user
router.post('/', userController.createUser);

// PUT /api/users/:id — Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id — Delete user
router.delete('/:id', userController.deleteUser);

// PUT /api/users/:id/reset-password — Reset password
router.put('/:id/reset-password', userController.resetPassword);

module.exports = router;
