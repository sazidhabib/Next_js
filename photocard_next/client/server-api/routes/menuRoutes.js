const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/', menuController.getAllMenuItems);
router.post('/', verifyToken, authorize('admin'), menuController.createMenuItem);
router.put('/:id', verifyToken, authorize('admin'), menuController.updateMenuItem);
router.delete('/:id', verifyToken, authorize('admin'), menuController.deleteMenuItem);

module.exports = router;
