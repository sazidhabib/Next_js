const express = require("express");
const router = express.Router();
const PhotocardStatistic = require("../models/photocard-statistic-model");
const authMiddleware = require("../middlewares/auth-middleware");

// Track download or share count (Public)
router.post("/track", async (req, res) => {
    try {
        const { type, action } = req.body;
        if (!type || !action) {
            return res.status(400).json({ message: "Type and Action are required" });
        }
        if (action !== "download" && action !== "share") {
            return res.status(400).json({ message: "Action must be download or share" });
        }

        const stat = await PhotocardStatistic.findOne({ where: { type } });
        if (!stat) {
            return res.status(404).json({ message: "Photocard type not found" });
        }

        if (action === "download") {
            await stat.increment("downloadCount");
        } else if (action === "share") {
            await stat.increment("shareCount");
        }

        await stat.reload();
        res.status(200).json({ message: "Tracked successfully", data: stat });
    } catch (error) {
        console.error("Track Photocard Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get a specific photocard statistic publicly (no auth required)
router.get("/public/:type", async (req, res) => {
    try {
        const stat = await PhotocardStatistic.findOne({
            where: { type: req.params.type },
            attributes: ["type", "name", "downloadCount", "shareCount"]
        });
        if (!stat) {
            return res.status(404).json({ message: "Photocard type not found" });
        }
        res.status(200).json(stat);
    } catch (error) {
        console.error("Get Public Photocard Stat Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get all photocard statistics (Protected)
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const stats = await PhotocardStatistic.findAll({
            order: [["downloadCount", "DESC"]]
        });
        res.status(200).json(stats);
    } catch (error) {
        console.error("Get Photocard Stats Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
