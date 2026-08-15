const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'setting-' + file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/', settingController.getSettings);
router.put('/', verifyToken, authorize('admin'), upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
    { name: 'hero_images', maxCount: 10 }
]), settingController.updateSettings);

module.exports = router;
