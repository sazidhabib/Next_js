const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } = require('../controllers/product-controller');
const { protect, admin } = require('../middlewares/auth-middleware');

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
