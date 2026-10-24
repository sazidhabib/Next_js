// routes/tag-router.js
const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middlewares/multer-config");
const {
    createTag,
    getAllTags,
    getTag,
    updateTag,
    deleteTag,
    bulkDeleteTags
} = require("../controllers/tag-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkPermission = require("../middlewares/permission-middleware");

// Add debug middleware to see what's being received
const debugMiddleware = (req, res, next) => {
    console.log('=== TAG ROUTE DEBUG ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body fields:', req.body);
    console.log('File:', req.file);
    console.log('Files:', req.files);
    console.log('=== END DEBUG ===');
    next();
};

// Public routes
router.get("/", getAllTags);
router.get("/:id", getTag);

// Protected routes (require authentication & permission)
router.post("/", authMiddleware, checkPermission('tags', 'edit'), debugMiddleware, upload.single("image"), convertToWebp(), createTag);
router.patch("/:id", authMiddleware, checkPermission('tags', 'edit'), debugMiddleware, upload.single("image"), convertToWebp(), updateTag);
router.delete("/:id", authMiddleware, checkPermission('tags', 'delete'), deleteTag);
router.post("/bulk-delete", authMiddleware, checkPermission('tags', 'delete'), bulkDeleteTags);

module.exports = router;