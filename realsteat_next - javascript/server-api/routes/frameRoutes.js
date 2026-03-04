const express = require('express');
const router = express.Router();
const frameController = require('../controllers/frameController');

const { verifyToken, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.get('/', frameController.getAllFrames);
router.get('/my-frames', verifyToken, frameController.getMyFrames);
router.get('/stats', verifyToken, frameController.getUserStats);
router.get('/:id', frameController.getFrameById);
router.post('/', verifyToken, upload.array('images', 10), frameController.createFrame);
router.post('/:id/use', frameController.incrementUseCount);
router.put('/:id', verifyToken, upload.array('images', 10), frameController.updateFrame);
router.delete('/:id', verifyToken, frameController.deleteFrame);

module.exports = router;
