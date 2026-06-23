// routes/ad-router.js
const express = require("express");
const router = express.Router();
const Ad = require("../models/ad-model"); // Make sure this path is correct
const sequelize = require("../db/database"); // Make sure this path is correct
const { Op } = require("sequelize");
const { upload, convertToWebp } = require("../middlewares/multer-config");
const {
    createAd,
    getAllAds,
    getAd,
    getAdsByPosition,
    updateAd,
    deleteAd,
    bulkDeleteAds,
    recordImpression,
    recordClick
} = require("../controllers/ad-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Public routes
router.get("/", getAllAds);
router.get("/position", getAdsByPosition); // Get ads by position
router.get("/:id", getAd);
// Add this temporary route to your ad-router.js
router.get("/test/all", async (req, res) => {
    try {
        console.log('=== TEST ALL ADS ENDPOINT ===');

        // Get all ads without any filters
        const allAds = await Ad.findAll({
            order: [["createdAt", "DESC"]]
        });

        console.log('Found ads:', allAds.length);

        // Simple response with basic ad info
        const simpleAds = allAds.map(ad => ({
            id: ad.id,
            name: ad.name,
            slug: ad.slug,
            type: ad.type,
            position: ad.position,
            isActive: ad.isActive,
            createdAt: ad.createdAt
        }));

        res.json({
            message: `Found ${allAds.length} ads`,
            ads: simpleAds,
            total: allAds.length
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/debug/raw", async (req, res) => {
    try {
        const [results] = await sequelize.query("SELECT * FROM ads ORDER BY createdAt DESC");
        console.log('Raw SQL results:', results);
        res.json({
            message: `Raw query found ${results.length} ads`,
            ads: results
        });
    } catch (error) {
        console.error('Raw query error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Tracking routes (public)
router.post("/:id/impression", recordImpression);
router.post("/:id/click", recordClick);

// Protected routes (require authentication)
router.post("/", authMiddleware, upload.single("image"), convertToWebp('ads'), createAd);
router.patch("/:id", authMiddleware, upload.single("image"), convertToWebp('ads'), updateAd);
router.delete("/:id", authMiddleware, deleteAd);
router.post("/bulk-delete", authMiddleware, bulkDeleteAds);

module.exports = router;