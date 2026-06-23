const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middlewares/multer-config");
const {
    getAbout,
    upsertAbout,
} = require("../controllers/about-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const validate = require('../middlewares/validate-middleware');
const { z } = require('zod');

// Updated Zod schema for Expanded About section
const aboutSchema = z.object({
    // Hero
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    
    // Intro
    introTag: z.string().optional(),
    introTitle: z.string().optional(),
    introDescription: z.string().optional(),
    
    // Structured data (strings from form-data, parsed in controller)
    socialLinks: z.string().optional(),
    stats: z.string().optional(),
    missionVision: z.string().optional(),
    values: z.string().optional(),
    
    // CTA
    ctaTitle: z.string().optional(),
    ctaSubtitle: z.string().optional(),
    
    // Legacy support
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional()
});

// Get About Content
router.get("/", getAbout);

// Create or Update About Content
router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    convertToWebp(),
    validate(aboutSchema),
    upsertAbout
);

module.exports = router;