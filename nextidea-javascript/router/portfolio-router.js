const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authMiddleware } = require('../middlewares/auth-middleware');

router.get('/', portfolioController.getPortfolioItems);
router.post('/', authMiddleware, portfolioController.createPortfolioItem);

module.exports = router;
