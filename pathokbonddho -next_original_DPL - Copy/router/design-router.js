// routes/design-router.js
const express = require("express");
const router = express.Router();
const {
    createDesign,
    getAllDesigns,
    getDesign,
    getDesignBySlug,
    updateDesign,
    deleteDesign,
    bulkDeleteDesigns,
    debugDesigns
} = require("../controllers/design-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Add debug middleware to see what's being received
const debugMiddleware = (req, res, next) => {
    console.log('=== DESIGN ROUTE DEBUG ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body fields:', req.body);
    console.log('=== END DEBUG ===');
    next();
};

// Public routes
router.get("/", getAllDesigns);
router.get("/:id", getDesign);
router.get("/slug/:slug", getDesignBySlug); // Get design by slug

// Protected routes (require authentication)
router.post("/", authMiddleware, debugMiddleware, createDesign);
router.patch("/:id", authMiddleware, debugMiddleware, updateDesign);
router.delete("/:id", authMiddleware, deleteDesign);
router.post("/bulk-delete", authMiddleware, bulkDeleteDesigns);
router.get("/debug/all", debugDesigns);

module.exports = router;