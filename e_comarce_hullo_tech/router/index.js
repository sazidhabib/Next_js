const express = require('express');
const router = express.Router();

const authRouter = require('./auth-router');
const settingRouter = require('./setting-router');
const categoryRouter = require('./category-router');
const productRouter = require('./product-router');

// Health Check Route
router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'API is running successfully' });
});

router.use('/auth', authRouter);
router.use('/settings', settingRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);

module.exports = router;
