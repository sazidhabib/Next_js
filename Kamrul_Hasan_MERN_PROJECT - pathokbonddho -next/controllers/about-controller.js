const About = require("../models/about-model");
const fs = require("fs");
const path = require("path");

// ✅ Get About Content
const getAbout = async (req, res) => {
    try {
        const about = await About.findOne();
        if (!about) return res.status(200).json(null);

        const safeParse = (data) => {
            if (typeof data === 'string') {
                try { return JSON.parse(data); } catch (e) { return data; }
            }
            return data;
        };

        const aboutData = about.toJSON();
        aboutData.socialLinks = safeParse(aboutData.socialLinks);
        aboutData.stats = safeParse(aboutData.stats);
        aboutData.missionVision = safeParse(aboutData.missionVision);
        aboutData.values = safeParse(aboutData.values);

        res.status(200).json(aboutData);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Create or Update About Content (Comprehensive)
const upsertAbout = async (req, res) => {
    try {
        const {
            // Hero
            heroTitle, heroSubtitle,
            // Intro
            introTag, introTitle, introDescription,
            // Socials (Parsed from string if necessary)
            socialLinks,
            // Stats (Parsed from string if necessary)
            stats,
            // Mission/Vision
            missionVision,
            // Values
            values,
            // CTA
            ctaTitle, ctaSubtitle,
            // Legacy fallbacks
            title, subtitle, description
        } = req.body;

        const imageUrl = req.file ? req.file.filename : req.body?.imageUrl;

        // Check if About exists
        const existingAbout = await About.findOne();

        // Helper function to parse JSON if string
        const safeParse = (data) => {
            if (typeof data === 'string') {
                try { return JSON.parse(data); } catch (e) { return data; }
            }
            return data;
        };

        const updateData = {
            heroTitle, heroSubtitle,
            introTag, introTitle, introDescription,
            socialLinks: safeParse(socialLinks),
            stats: safeParse(stats),
            missionVision: safeParse(missionVision),
            values: safeParse(values),
            ctaTitle, ctaSubtitle,
            imageUrl: req.file ? imageUrl : existingAbout?.imageUrl,
            // Backward compatibility
            title: title || heroTitle,
            subtitle: subtitle || heroSubtitle,
            description: description || introDescription
        };

        if (existingAbout) {
            // Update existing
            if (req.file && existingAbout.imageUrl) {
                const oldImagePath = path.join(__dirname, "..", "uploads", existingAbout.imageUrl);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            await existingAbout.update(updateData);
            return res.status(200).json({ message: "About Content Updated", about: existingAbout });
        } else {
            // Create new
            const newAbout = await About.create(updateData);
            return res.status(201).json({ message: "About Content Created", about: newAbout });
        }
    } catch (error) {
        console.error("Upsert About Expanded Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAbout,
    upsertAbout,
};