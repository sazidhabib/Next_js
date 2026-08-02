const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
// Routes
router.get('/me', verifyToken, userController.getMe);
router.get('/', verifyToken, authorize('admin'), userController.getAllUsers);
router.post('/', verifyToken, authorize('admin'), userController.createUser);
router.put('/:id', verifyToken, authorize('admin'), userController.updateUser);
router.delete('/:id', verifyToken, authorize('admin'), userController.deleteUser);
router.post('/change-password', verifyToken, userController.changePassword);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;
