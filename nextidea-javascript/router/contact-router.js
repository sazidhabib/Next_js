const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { adminMiddleware } = require('../middlewares/auth-middleware');

router.post('/', contactController.submitContact);
router.get('/admin/submissions', adminMiddleware, contactController.getSubmissions);

module.exports = router;
