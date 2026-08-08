const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/order-controller');

router.post('/', createOrder);
router.get('/', getOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;
