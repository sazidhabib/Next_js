const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { adminMiddleware } = require('../middlewares/auth-middleware');

router.get('/', categoryController.getCategories);
router.post('/', adminMiddleware, categoryController.createCategory);
router.put('/:id', adminMiddleware, categoryController.updateCategory);
router.delete('/:id', adminMiddleware, categoryController.deleteCategory);

module.exports = router;
