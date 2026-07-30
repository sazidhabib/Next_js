const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/order-controller');

router.post('/', createOrder);
router.get('/', getOrders);

module.exports = router;
