// controllers/ad-controller.js
const Ad = require("../models/ad-model");
const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// ✅ Create Ad
const createAd = async (req, res) => {
    try {
        console.log('=== CREATE AD CONTROLLER ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const {
            name,
            slug,
            type,
            imageUrl,
            headCode,
            bodyCode,
            position,
            displayPages,
            startDate,
            endDate,
            isActive,
            maxImpressions
        } = req.body;

        if (!name || !slug || !type || !position) {
            return res.status(400).json({ message: "Name, Slug, Type, and Position are required" });
        }

        // Validate ad type specific fields
        if (type === 'image' && !req.file) {
            return res.status(400).json({ message: "Image is required for image ads" });
        }

        if (type === 'google_adsense' && (!headCode || !bodyCode)) {
            return res.status(400).json({ message: "Head code and Body code are required for Google Adsense" });
        }

        // Check if slug already exists
        const existingSlug = await Ad.findOne({ where: { slug } });
        if (existingSlug) {
            return res.status(409).json({ message: "An ad with this slug already exists." });
        }

        const imagePath = req.file ? req.file.filename : null;

        // Parse displayPages if provided
        let displayPagesToSave = null;
        if (displayPages && displayPages !== '[]' && displayPages !== 'null' && displayPages !== '') {
            try {
                const parsed = typeof displayPages === 'string' ? JSON.parse(displayPages) : displayPages;
                displayPagesToSave = JSON.stringify(parsed);
            } catch (error) {
                return res.status(400).json({ message: "Invalid displayPages format" });
            }
        }

        let parsedMaxImpressions = null;
        if (maxImpressions !== undefined && maxImpressions !== '') {
            parsedMaxImpressions = parseInt(maxImpressions);
            if (isNaN(parsedMaxImpressions)) {
                parsedMaxImpressions = null;
            }
        }

        const newAd = await Ad.create({
            name,
            slug: slug.toLowerCase(),
            type,
            image: imagePath,
            imageUrl: type === 'image' ? imageUrl : null,
            headCode: type === 'google_adsense' ? headCode : null,
            bodyCode: type === 'google_adsense' ? bodyCode : null,
            position,
            displayPages: displayPagesToSave,
            startDate: startDate || null,
            endDate: endDate || null,
            isActive: isActive === "true" || isActive === true,
            maxImpressions: parsedMaxImpressions || null,
        });

        res.status(201).json({
            message: "Ad Created Successfully",
            ad: newAd
        });
    } catch (error) {
        console.error("Create Ad Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get All Ads
// controllers/ad-controller.js - Fixed getAllAds function
const getAllAds = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', type, position, isActive } = req.query;
        const offset = (page - 1) * limit;

        console.log('=== GET ALL ADS ===');
        console.log('Query params:', req.query);

        // Build where clause properly
        const whereClause = {};

        // Search functionality - FIXED
        if (search && search.trim() !== '') {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { slug: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter by type
        if (type && type.trim() !== '') {
            whereClause.type = type;
        }

        // Filter by position
        if (position && position.trim() !== '') {
            whereClause.position = position;
        }

        // Filter by active status - FIXED: Handle MySQL boolean (1/0)
        if (isActive !== undefined && isActive !== '') {
            // Convert string to boolean - MySQL stores true as 1, false as 0
            if (isActive === 'true' || isActive === true || isActive === '1') {
                whereClause.isActive = 1;
            } else if (isActive === 'false' || isActive === false || isActive === '0') {
                whereClause.isActive = 0;
            }
        }

        console.log('Final where clause:', whereClause);

        const { count, rows } = await Ad.findAndCountAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        console.log('Query result - count:', count, 'rows:', rows.length);

        // Parse displayPages for each ad
        const adsWithParsedPages = rows.map(ad => {
            const adData = ad.toJSON();

            // Convert MySQL boolean (1/0) to JavaScript boolean
            if (adData.isActive !== undefined) {
                adData.isActive = Boolean(adData.isActive);
            }

            if (adData.displayPages) {
                try {
                    adData.displayPages = JSON.parse(adData.displayPages);
                } catch (error) {
                    adData.displayPages = [];
                }
            }
            return adData;
        });

        console.log('Sending', adsWithParsedPages.length, 'ads to frontend');

        res.status(200).json({
            ads: adsWithParsedPages,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
        });
    } catch (error) {
        console.error("Get All Ads Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get Single Ad
const getAd = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: "Ad Not Found" });
        }

        const adData = ad.toJSON();
        if (adData.displayPages) {
            try {
                adData.displayPages = JSON.parse(adData.displayPages);
            } catch (error) {
                adData.displayPages = [];
            }
        }

        res.status(200).json(adData);
    } catch (error) {
        console.error("Get Ad Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get Active Ads by Position
const getAdsByPosition = async (req, res) => {
    try {
        const { position, page } = req.query;

        if (!position) {
            return res.status(400).json({ message: "Position is required" });
        }

        const whereClause = {
            position,
            isActive: true,
            [Op.and]: [
                {
                    [Op.or]: [
                        { startDate: null },
                        { startDate: { [Op.lte]: new Date() } }
                    ]
                },
                {
                    [Op.or]: [
                        { endDate: null },
                        { endDate: { [Op.gte]: new Date() } }
                    ]
                },
                {
                    [Op.or]: [
                        { maxImpressions: null },
                        { currentImpressions: { [Op.lt]: Sequelize.col('maxImpressions') } }
                    ]
                }
            ]
        };

        // If page is specified, check displayPages
        if (page) {
            if (page === 'details') {
                // Special rule: details page MUST be explicitly listed
                whereClause.displayPages = { [Op.like]: `%details%` };
            } else {
                whereClause[Op.or] = [
                    { displayPages: null },
                    { displayPages: { [Op.like]: `%${page}%` } }
                ];
            }
        }

        const ads = await Ad.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]]
        });

        const adsWithParsedPages = ads.map(ad => {
            const adData = ad.toJSON();
            if (adData.displayPages) {
                try {
                    adData.displayPages = JSON.parse(adData.displayPages);
                } catch (error) {
                    adData.displayPages = [];
                }
            }
            return adData;
        });

        res.status(200).json(adsWithParsedPages);
    } catch (error) {
        console.error("Get Ads By Position Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Update Ad
const updateAd = async (req, res) => {
    try {
        console.log('=== UPDATE AD CONTROLLER ===');
        console.log('Request params:', req.params);
        console.log('Request body:', req.body);
        console.log('Request file:', req.file ? {
            filename: req.file.filename,
            size: req.file.size
        } : 'No file');

        const {
            name,
            slug,
            type,
            imageUrl,
            headCode,
            bodyCode,
            position,
            displayPages,
            startDate,
            endDate,
            isActive,
            maxImpressions
        } = req.body;

        // Find the existing ad
        const existingAd = await Ad.findByPk(req.params.id);
        if (!existingAd) {
            console.log('Ad not found with ID:', req.params.id);
            return res.status(404).json({ message: "Ad Not Found" });
        }

        console.log('Found existing ad:', existingAd.toJSON());

        // Handle boolean conversion for isActive
        let parsedIsActive = existingAd.isActive; // Default to current value
        if (isActive !== undefined) {
            parsedIsActive = isActive === "true" || isActive === true || isActive === "1";
        }

        let parsedMaxImpressions = existingAd.maxImpressions;
        if (maxImpressions !== undefined) {
            if (maxImpressions === '' || maxImpressions === null) {
                parsedMaxImpressions = null;
            } else {
                // Convert to integer
                parsedMaxImpressions = parseInt(maxImpressions);
                if (isNaN(parsedMaxImpressions)) {
                    parsedMaxImpressions = null;
                }
            }
        }

        console.log('Parsed isActive:', parsedIsActive);

        // Check if slug already exists (excluding current ad)
        if (slug && slug !== existingAd.slug) {
            const duplicateSlug = await Ad.findOne({
                where: {
                    slug: slug.toLowerCase(),
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (duplicateSlug) {
                return res.status(409).json({ message: "Another ad with this slug already exists." });
            }
        }

        // Delete old image if new one is uploaded
        if (req.file && existingAd.image) {
            const oldImagePath = path.join(__dirname, "..", "uploads", "ads", existingAd.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Parse displayPages if provided
        let displayPagesToSave = existingAd.displayPages;
        if (displayPages !== undefined) {
            if (displayPages === '[]' || displayPages === '' || displayPages === 'null') {
                displayPagesToSave = null; // Clear it
            } else {
                try {
                    const parsed = typeof displayPages === 'string' ? JSON.parse(displayPages) : displayPages;
                    displayPagesToSave = JSON.stringify(parsed);
                } catch (error) {
                    console.log('Error parsing displayPages, using existing:', error.message);
                    displayPagesToSave = displayPages;
                }
            }
        }

        // Prepare update data
        const updateData = {
            name: name || existingAd.name,
            slug: slug ? slug.toLowerCase() : existingAd.slug,
            type: type || existingAd.type,
            position: position || existingAd.position,
            imageUrl: imageUrl !== undefined ? imageUrl : existingAd.imageUrl,
            headCode: headCode !== undefined ? headCode : existingAd.headCode,
            bodyCode: bodyCode !== undefined ? bodyCode : existingAd.bodyCode,
            displayPages: displayPagesToSave,
            startDate: startDate !== undefined ? startDate : existingAd.startDate,
            endDate: endDate !== undefined ? endDate : existingAd.endDate,
            isActive: parsedIsActive,
            maxImpressions: parsedMaxImpressions,
        };

        // Only update image if a new one is uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        }

        console.log('Update data:', updateData);

        // Perform the update
        const updatedAd = await existingAd.update(updateData);
        console.log('✅ Ad updated successfully:', updatedAd.toJSON());

        res.status(200).json({
            message: "Ad Updated Successfully",
            ad: updatedAd
        });
    } catch (error) {
        console.error("Update Ad Error:", error);
        console.error("Error stack:", error.stack);

        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// ✅ Record Impression
const recordImpression = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: "Ad Not Found" });
        }

        // Increment impression count
        await ad.increment('currentImpressions');

        res.status(200).json({ message: "Impression recorded" });
    } catch (error) {
        console.error("Record Impression Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Record Click
const recordClick = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.id);

        if (!ad) {
            return res.status(404).json({ message: "Ad Not Found" });
        }

        // Increment click count
        await ad.increment('clickCount');

        res.status(200).json({ message: "Click recorded" });
    } catch (error) {
        console.error("Record Click Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Delete Ad
const deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findByPk(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: "Ad Not Found" });
        }

        // Delete associated image
        if (ad.image) {
            const imagePath = path.join(__dirname, "..", "uploads", "ads", ad.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await ad.destroy();
        res.status(200).json({ message: "Ad Deleted Successfully" });
    } catch (error) {
        console.error("Delete Ad Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Bulk Delete Ads
const bulkDeleteAds = async (req, res) => {
    try {
        const { adIds } = req.body;

        if (!adIds || !Array.isArray(adIds) || adIds.length === 0) {
            return res.status(400).json({ message: "Ad IDs are required" });
        }

        const ads = await Ad.findAll({
            where: { id: adIds }
        });

        // Delete images for all ads
        for (const ad of ads) {
            if (ad.image) {
                const imagePath = path.join(__dirname, "..", "uploads", "ads", ad.image);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        await Ad.destroy({
            where: { id: adIds }
        });

        res.status(200).json({
            message: `${adIds.length} ad(s) deleted successfully`
        });
    } catch (error) {
        console.error("Bulk Delete Ads Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createAd,
    getAllAds,
    getAd,
    getAdsByPosition,
    updateAd,
    deleteAd,
    bulkDeleteAds,
    recordImpression,
    recordClick
};