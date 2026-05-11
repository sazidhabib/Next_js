const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { adminMiddleware } = require('../middlewares/auth-middleware');

router.get('/', adminMiddleware, userController.getUsers);
router.get('/:id', adminMiddleware, userController.getUserById);
router.post('/', adminMiddleware, userController.createUser);
router.put('/:id', adminMiddleware, userController.updateUser);
router.delete('/:id', adminMiddleware, userController.deleteUser);

module.exports = router;
