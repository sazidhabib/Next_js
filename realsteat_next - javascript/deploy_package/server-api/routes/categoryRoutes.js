const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/', categoryController.getAllCategories);
router.post('/', verifyToken, authorize('admin'), categoryController.createCategory);
router.put('/:id', verifyToken, authorize('admin'), categoryController.updateCategory);
router.delete('/:id', verifyToken, authorize('admin'), categoryController.deleteCategory);

module.exports = router;
