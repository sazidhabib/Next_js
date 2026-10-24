// routes/author-router.js
const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middlewares/multer-config");
const {
    createAuthor,
    getAllAuthors,
    getAuthor,
    updateAuthor,
    deleteAuthor,
    bulkDeleteAuthors
} = require("../controllers/author-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkPermission = require("../middlewares/permission-middleware");

// Add debug middleware to see what's being received
const debugMiddleware = (req, res, next) => {
    console.log('=== AUTHOR ROUTE DEBUG ===');
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
router.get("/", getAllAuthors);
router.get("/:id", getAuthor);

// Protected routes (require authentication & permission)
router.post("/", authMiddleware, checkPermission('authors', 'edit'), debugMiddleware, upload.single("image"), convertToWebp('authors'), createAuthor);
router.patch("/:id", authMiddleware, checkPermission('authors', 'edit'), debugMiddleware, upload.single("image"), convertToWebp('authors'), updateAuthor);
router.delete("/:id", authMiddleware, checkPermission('authors', 'delete'), deleteAuthor);
router.post("/bulk-delete", authMiddleware, checkPermission('authors', 'delete'), bulkDeleteAuthors);

module.exports = router;