const express = require("express");
const {
    createPage,
    getPageLayout,
    updatePageLayout,
    deletePage,
    getAllPages,
} = require("../controllers/layoutController");
const authMiddleware = require("../middlewares/auth-middleware");
const checkPermission = require("../middlewares/permission-middleware");
const router = express.Router();

// Get all pages
router.get("/", getAllPages);

// Create a page with sections/rows/columns
router.post("/", authMiddleware, checkPermission('pageLayout', 'edit'), createPage);

// Get full layout by pageId
router.get("/:pageId", getPageLayout);

// Update layout (add/remove sections/rows/columns)
router.patch("/:pageId", authMiddleware, checkPermission('pageLayout', 'edit'), updatePageLayout);

// Delete a page layout
router.delete("/:pageId", authMiddleware, checkPermission('pageLayout', 'delete'), deletePage);

module.exports = router;
