// controllers/news-controller.js
const { v4: uuidv4 } = require('uuid');
const News = require("../models/news-model");
const NewsTag = require("../models/news-tag-model");
const NewsCategory = require("../models/news-category-model");
const Tag = require("../models/tag-model");
const Menu = require("../models/menu-model");
const Author = require("../models/author-model");
const ImageService = require('../services/imageService');
const ImageRegistry = require('../models/imageRegistry');
const NewsGalleryItem = require('../models/news-gallery-item');
const fs = require("fs");
const path = require("path");
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");


console.log('=== MODELS CHECK ===');
console.log('News model:', News ? 'Loaded' : 'Not loaded');
console.log('Menu model:', Menu ? 'Loaded' : 'Not loaded');
console.log('Tag model:', Tag ? 'Loaded' : 'Not loaded');
console.log('Author model:', Author ? 'Loaded' : 'Not loaded');

// ✅ Create News Post
// ✅ Create News Post
const createNews = async (req, res) => {
    try {
        console.log('=== CREATE NEWS CONTROLLER ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);

        const {
            newsHeadline,
            highlight,
            alternativeHeadline,
            authorId,
            shortDescription,
            tagIds,
            categoryIds,
            content,
            imageCaption,
            videoLink,
            newsSchedule,
            metaTitle,
            metaKeywords,
            metaDescription,
            status,
            newsType,
            galleryItems
        } = req.body;

        // Generate random slug using UUID
        const generateRandomSlug = () => {
            // Generate UUID and remove hyphens
            const uuid = uuidv4().replace(/-/g, '');

            return uuid.substring(0, 12);
        };

        let slug = generateRandomSlug();
        console.log('Generated slug:', slug);

        // Verify slug is unique (though with UUID it's extremely unlikely)
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            const existingSlug = await News.findOne({ where: { slug } });
            if (!existingSlug) {
                break;
            }
            // If by extreme chance the slug exists, generate a new one
            slug = generateRandomSlug();
            attempts++;
            console.log(`Slug exists (attempt ${attempts}), trying: ${slug}`);
        }

        // If we exhausted attempts, append timestamp
        if (attempts === maxAttempts) {
            const timestamp = Date.now().toString(36).slice(-4);
            slug = `${slug}-${timestamp}`;
            console.log('Added timestamp to ensure uniqueness:', slug);
        }

        if (!newsHeadline || !authorId) {
            return res.status(400).json({
                message: "News Headline and Author are required"
            });
        }
        
        if (!content && newsType !== 'photo' && newsType !== 'video') {
            return res.status(400).json({
                message: "Content is required for standard news"
            });
        }

        // Parse tagIds and categoryIds
        let parsedTagIds = [];
        if (tagIds) {
            if (typeof tagIds === 'string') {
                try {
                    parsedTagIds = JSON.parse(tagIds);
                } catch (error) {
                    parsedTagIds = tagIds.split(',').filter(id => id.trim() !== '');
                }
            } else if (Array.isArray(tagIds)) {
                parsedTagIds = tagIds;
            }
        }

        let parsedCategoryIds = [];
        if (categoryIds) {
            if (typeof categoryIds === 'string') {
                try {
                    const parsed = JSON.parse(categoryIds);
                    if (Array.isArray(parsed)) {
                        parsedCategoryIds = parsed;
                    } else if (parsed !== null && parsed !== undefined) {
                        // Single value (e.g. "10") – wrap into array
                        parsedCategoryIds = [parsed];
                    }
                } catch (error) {
                    // Fallback: comma-separated string like "1,2,3"
                    parsedCategoryIds = categoryIds.split(',').filter(id => id.trim() !== '');
                }
            } else if (Array.isArray(categoryIds)) {
                parsedCategoryIds = categoryIds;
            } else {
                // Any other single value (number, etc.)
                parsedCategoryIds = [categoryIds];
            }
            // Convert to numbers
            parsedCategoryIds = parsedCategoryIds.map(id => parseInt(id)).filter(id => !isNaN(id));
        }

        console.log('Final slug:', slug);
        console.log('parsedTagIds:', parsedTagIds);
        console.log('Final parsedCategoryIds:', parsedCategoryIds);

        // Handle file uploads
        const leadImage = req.files?.leadImage ? `uploads/post_image/${req.files.leadImage[0].filename}` : req.body.leadImagePath;
        let thumbImage = req.files?.thumbImage ? `uploads/post_image/${req.files.thumbImage[0].filename}` : req.body.thumbImagePath;
        const metaImage = req.files?.metaImage ? `uploads/post_image/${req.files.metaImage[0].filename}` : req.body.metaImagePath;

        // Remove duplicate 'uploads/' prefix if present in body path
        const leadImagePath = leadImage ? leadImage : null;
        // If no thumb image provided, fall back to lead image
        const thumbImagePath = thumbImage ? thumbImage : (leadImagePath || null);
        const metaImagePath = metaImage ? metaImage : null;

        console.log('Image paths:', {
            leadImagePath,
            thumbImagePath,
            metaImagePath
        });

        const newNews = await News.create({
            newsHeadline,
            highlight,
            alternativeHeadline,
            authorId: parseInt(authorId),
            shortDescription,
            content,
            leadImage: leadImagePath,
            thumbImage: thumbImagePath,
            imageCaption,
            videoLink,
            newsSchedule: newsSchedule || null,
            metaTitle: metaTitle || newsHeadline,
            metaKeywords,
            metaDescription: metaDescription || shortDescription,
            metaImage: metaImagePath,
            status: status || 'draft',
            newsType: newsType || 'standard',
            slug
        });

        console.log('=== NEWS CREATION DEBUG ===');
        console.log('New News ID:', newNews.id);
        console.log('New News data:', {
            id: newNews.id,
            newsHeadline: newNews.newsHeadline,
            slug: newNews.slug, // Log the slug
            status: newNews.status,
            authorId: newNews.authorId,
            createdAt: newNews.createdAt
        });

        // Verify it was saved to database
        const savedNews = await News.findByPk(newNews.id);
        console.log('Retrieved from database:', savedNews ? 'Yes' : 'No');
        if (savedNews) {
            console.log('Saved news details:', {
                id: savedNews.id,
                newsHeadline: savedNews.newsHeadline,
                slug: savedNews.slug, // Log the saved slug
                status: savedNews.status,
                createdAt: savedNews.createdAt
            });
        }

        // Create associations
        if (parsedTagIds.length > 0) {
            const newsTags = parsedTagIds.map(tagId => ({
                newsId: newNews.id,
                tagId: parseInt(tagId)
            }));
            await NewsTag.bulkCreate(newsTags);
        }

        if (parsedCategoryIds.length > 0) {
            const newsCategories = parsedCategoryIds.map(categoryId => ({
                newsId: newNews.id,
                categoryId: parseInt(categoryId)
            }));
            await NewsCategory.bulkCreate(newsCategories);
        }

        // Create Gallery Items for Photo News
        console.log('Gallery Items raw:', galleryItems);
        if (newsType === 'photo' && galleryItems) {
            try {
                const parsedGalleryItems = typeof galleryItems === 'string' ? JSON.parse(galleryItems) : galleryItems;
                console.log('Parsed Gallery Items:', parsedGalleryItems);
                if (Array.isArray(parsedGalleryItems) && parsedGalleryItems.length > 0) {
                    const galleryRecords = parsedGalleryItems
                        .filter(item => item.imageUrl) // Filter out items without images
                        .map((item, index) => ({
                            newsId: newNews.id,
                            imageUrl: item.imageUrl,
                            caption: item.caption,
                            content: item.content || '',
                            sortOrder: index
                        }));
                    if (galleryRecords.length > 0) {
                        await NewsGalleryItem.bulkCreate(galleryRecords);
                    }
                }
            } catch (error) {
                console.error("Error parsing gallery items:", error);
            }
        }

        // REGISTER IMAGES IN CENTRALIZED REGISTRY
        try {
            if (leadImagePath) {
                await ImageService.registerImage(
                    leadImage,
                    leadImagePath,
                    'news',
                    newNews.id
                );
            }
            if (thumbImagePath) {
                await ImageService.registerImage(
                    thumbImage,
                    thumbImagePath,
                    'news',
                    newNews.id
                );
            }
            if (metaImagePath) {
                await ImageService.registerImage(
                    metaImage,
                    metaImagePath,
                    'news',
                    newNews.id
                );
            }
            console.log(`✅ Registered news images for news ID: ${newNews.id}`);
        } catch (imageError) {
            console.error('Error registering news images:', imageError);
            // Don't fail the request if image registration fails
        }

        // Fetch complete news with associations
        const completeNews = await News.findByPk(newNews.id, {
            include: [
                { model: Tag, through: { attributes: [] }, as: 'Tags' },
                { model: Menu, through: { attributes: [] }, as: 'Categories' },
                { model: Author, as: 'Author' }
            ]
        });

        res.status(201).json({
            message: "News Post Created Successfully",
            news: completeNews,
            slug: slug // Return the slug in response if needed
        });
    } catch (error) {
        console.error("Create News Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get All News Posts - UPDATED VERSION
const getAllNews = async (req, res) => {

    console.log('=== DEBUG: Checking News model associations ===');
    console.log('News model associations:', Object.keys(News.associations || {}));

    try {
        const testNews = await News.findOne();
        console.log('Test news ID:', testNews?.id);

        // Try to get categories using different aliases
        const withMenus = await News.findByPk(testNews?.id, {
            include: [{ model: Menu, as: 'Menus' }]
        });
        console.log('With Menus alias:', withMenus?.Menus?.length || 0);

        const withCategories = await News.findByPk(testNews?.id, {
            include: [{ model: Menu, as: 'Categories' }]
        });
        console.log('With Categories alias:', withCategories?.Categories?.length || 0);
    } catch (debugErr) {
        console.log('Association debug error:', debugErr.message);
    }

    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            status,
            categories,
            tag,
            author,
            excludeIds
        } = req.query;

        const offset = (page - 1) * limit;

        let whereClause = {};

        // Exclude IDs logic
        if (excludeIds) {
            const idsList = typeof excludeIds === 'string'
                ? excludeIds.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
                : (Array.isArray(excludeIds) ? excludeIds.map(id => parseInt(id)).filter(id => !isNaN(id)) : []);

            if (idsList.length > 0) {
                whereClause.id = { [Op.notIn]: idsList };
            }
        }

        // Search functionality
        if (search) {
            whereClause = {
                [Op.or]: [
                    { newsHeadline: { [Op.like]: `%${search}%` } },
                    { alternativeHeadline: { [Op.like]: `%${search}%` } },
                    { shortDescription: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        // Filter by status
        if (status) {
            whereClause.status = status;
        }

        console.log('Where clause:', whereClause);

        // Add this debug code in your getAllNews function
        console.log('Debug: Checking News model associations:');
        try {
            // Access the internal associations object
            console.log('Available associations for News model:');
            for (const assocAlias in News.associations) {
                console.log(`- ${assocAlias}`);
            }
        } catch (debugErr) {
            console.log('Could not access associations:', debugErr.message);
        }

        // Get news WITH associations
        const { count, rows } = await News.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug'],
                    as: 'Tags',
                    ...(tag && { where: { name: tag } })
                },
                {
                    model: Menu,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'path'],
                    as: 'Categories',
                    ...(categories && {
                        where: {
                            [Op.or]: [
                                { name: { [Op.in]: categories.split(',') } },
                                { path: { [Op.in]: categories.split(',') } }
                            ]
                        }
                    })
                },
                {
                    model: Author,
                    attributes: ['id', 'name'],
                    as: 'Author'
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        console.log(`Found ${count} news with associations`);

        if (rows.length > 0) {
            console.log('First news associations:', {
                tags: rows[0].Tags?.length || 0,
                categories: rows[0].Menus?.length || 0,
                author: rows[0].Author?.name
            });
        }

        res.status(200).json({
            news: rows,
            totalCount: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            hasNext: page * limit < count,
            hasPrev: page > 1
        });

    } catch (error) {
        console.error("Get All News Error:", error);
        console.error("Error stack:", error.stack);

        // Direct SQL query as fallback
        try {
            const [newsRows] = await sequelize.query(
                "SELECT id, newsHeadline, status, authorId, createdAt FROM news ORDER BY createdAt DESC LIMIT 10"
            );

            res.status(200).json({
                news: newsRows,
                totalCount: newsRows.length,
                currentPage: 1,
                totalPages: 1,
                hasNext: false,
                hasPrev: false,
                error: "Using SQL fallback"
            });
        } catch (sqlError) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Menu.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'path'],
            order: [['name', 'ASC']]
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error("Get Categories Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};



// ✅ Get Single News Post
const getNews = async (req, res) => {
    try {
        console.log(`=== GET NEWS BY ID: ${req.params.id} ===`);
        const news = await News.findByPk(req.params.id, {
            include: [
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Menu,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'path'],
                    as: 'Categories'
                },
                {
                    model: Author,
                    attributes: ['id', 'name']
                },
                {
                    model: NewsGalleryItem,
                    as: 'GalleryItems'
                }
            ]
        });

        if (!news) {
            return res.status(404).json({ message: "News Post Not Found" });
        }

        // Increment views
        await news.increment('views');

        res.status(200).json(news);
    } catch (error) {
        console.error("Get News Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Get News by Slug
const getNewsBySlug = async (req, res) => {
    try {
        const news = await News.findOne({
            where: { slug: req.params.slug },
            include: [
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Menu,
                    through: { attributes: [] },
                    attributes: ['id', 'name', 'path'],
                    as: 'Categories'
                },
                {
                    model: Author,
                    attributes: ['id', 'name', 'email', 'image']
                },
                {
                    model: NewsGalleryItem,
                    as: 'GalleryItems'
                }
            ]
        });

        if (!news) {
            return res.status(404).json({ message: "News Post Not Found" });
        }

        // Increment views
        await news.increment('views');

        res.status(200).json(news);
    } catch (error) {
        console.error("Get News by Slug Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Update News Post
const updateNews = async (req, res) => {
    try {
        const {
            newsHeadline,
            highlight,
            alternativeHeadline,
            authorId,
            shortDescription,
            tagIds,
            categoryIds,
            content,
            imageCaption,
            videoLink,
            newsSchedule,
            metaTitle,
            metaKeywords,
            metaDescription,
            status,
            newsType,
            galleryItems
        } = req.body;

        const existingNews = await News.findByPk(req.params.id);
        if (!existingNews) {
            return res.status(404).json({ message: "News Post Not Found" });
        }

        let slug = existingNews.slug;
        if (newsHeadline && newsHeadline !== existingNews.newsHeadline) {
            slug = newsHeadline.toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            // Check if new slug already exists
            const duplicateSlug = await News.findOne({
                where: {
                    slug,
                    id: { [Op.ne]: req.params.id }
                }
            });

            if (duplicateSlug) {
                return res.status(409).json({
                    message: "Another news post with this headline already exists."
                });
            }
        }

        // Parse tagIds and categoryIds
        const parsedTagIds = tagIds ? JSON.parse(tagIds) : [];
        const parsedCategoryIds = categoryIds ? JSON.parse(categoryIds) : [];

        // Handle file uploads and delete old files
        const updateData = {
            newsHeadline: newsHeadline || existingNews.newsHeadline,
            highlight: highlight !== undefined ? highlight : existingNews.highlight,
            alternativeHeadline: alternativeHeadline !== undefined ? alternativeHeadline : existingNews.alternativeHeadline,
            authorId: authorId ? parseInt(authorId) : existingNews.authorId,
            shortDescription: shortDescription !== undefined ? shortDescription : existingNews.shortDescription,
            content: content !== undefined ? content : existingNews.content,
            imageCaption: imageCaption !== undefined ? imageCaption : existingNews.imageCaption,
            videoLink: videoLink !== undefined ? videoLink : existingNews.videoLink,
            newsSchedule: newsSchedule === '' ? null : (newsSchedule !== undefined ? newsSchedule : existingNews.newsSchedule),
            metaTitle: metaTitle !== undefined ? metaTitle : existingNews.metaTitle,
            metaKeywords: metaKeywords !== undefined ? metaKeywords : existingNews.metaKeywords,
            metaDescription: metaDescription !== undefined ? metaDescription : existingNews.metaDescription,
            status: status || existingNews.status,
            newsType: newsType || existingNews.newsType,
            slug
        };

        // Handle lead image
        if (req.files?.leadImage) {
            // Delete old lead image
            if (existingNews.leadImage) {
                const oldImagePath = path.join(__dirname, "..", existingNews.leadImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                // Remove from image registry
                await ImageRegistry.destroy({
                    where: {
                        sourceType: 'news',
                        sourceId: req.params.id,
                        filePath: existingNews.leadImage
                    }
                });
            }
            updateData.leadImage = `uploads/post_image/${req.files.leadImage[0].filename}`;

            // Register new image
            await ImageService.registerImage(
                req.files.leadImage[0].filename,
                updateData.leadImage,
                'news',
                req.params.id
            );
        }

        // Handle thumb image
        if (req.files?.thumbImage) {
            if (existingNews.thumbImage) {
                const oldImagePath = path.join(__dirname, "..", existingNews.thumbImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                // Remove from image registry
                await ImageRegistry.destroy({
                    where: {
                        sourceType: 'news',
                        sourceId: req.params.id,
                        filePath: existingNews.thumbImage
                    }
                });
            }
            updateData.thumbImage = `uploads/post_image/${req.files.thumbImage[0].filename}`;

            // Register new image
            await ImageService.registerImage(
                req.files.thumbImage[0].filename,
                updateData.thumbImage,
                'news',
                req.params.id
            );
        }

        // Handle meta image
        if (req.files?.metaImage) {
            if (existingNews.metaImage) {
                const oldImagePath = path.join(__dirname, "..", existingNews.metaImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                // Remove from image registry
                await ImageRegistry.destroy({
                    where: {
                        sourceType: 'news',
                        sourceId: req.params.id,
                        filePath: existingNews.metaImage
                    }
                });
            }
            updateData.metaImage = `uploads/post_image/${req.files.metaImage[0].filename}`;

            // Register new image
            await ImageService.registerImage(
                req.files.metaImage[0].filename,
                updateData.metaImage,
                'news',
                req.params.id
            );
        }

        // If no thumbImage is set but leadImage is, use leadImage as thumbImage
        if (!updateData.thumbImage && !existingNews.thumbImage && updateData.leadImage) {
            updateData.thumbImage = updateData.leadImage;
        } else if (!updateData.thumbImage && existingNews.thumbImage && updateData.leadImage && existingNews.thumbImage === existingNews.leadImage) {
            updateData.thumbImage = updateData.leadImage;
        }

        const updatedNews = await existingNews.update(updateData);

        // Update associations
        if (tagIds !== undefined) {
            await NewsTag.destroy({ where: { newsId: req.params.id } });
            if (parsedTagIds.length > 0) {
                const newsTags = parsedTagIds.map(tagId => ({
                    newsId: req.params.id,
                    tagId: parseInt(tagId)
                }));
                await NewsTag.bulkCreate(newsTags);
            }
        }

        if (categoryIds !== undefined) {
            await NewsCategory.destroy({ where: { newsId: req.params.id } });
            if (parsedCategoryIds.length > 0) {
                const newsCategories = parsedCategoryIds.map(categoryId => ({
                    newsId: req.params.id,
                    categoryId: parseInt(categoryId)
                }));
                await NewsCategory.bulkCreate(newsCategories);
            }
        }

        // Update Gallery Items for Photo News
        console.log('Update News Gallery Items raw:', galleryItems);
        if ((newsType === 'photo' || existingNews.newsType === 'photo') && galleryItems !== undefined) {
            try {
                const parsedGalleryItems = typeof galleryItems === 'string' ? JSON.parse(galleryItems) : galleryItems;
                console.log('Update News Parsed Gallery Items:', parsedGalleryItems);
                await NewsGalleryItem.destroy({ where: { newsId: req.params.id } });
                if (Array.isArray(parsedGalleryItems) && parsedGalleryItems.length > 0) {
                     const galleryRecords = parsedGalleryItems
                        .filter(item => item.imageUrl) // Filter out items without images
                        .map((item, index) => ({
                            newsId: req.params.id,
                            imageUrl: item.imageUrl,
                            caption: item.caption,
                            content: item.content || '',
                            sortOrder: index
                        }));
                    if (galleryRecords.length > 0) {
                        await NewsGalleryItem.bulkCreate(galleryRecords);
                    }
                }
            } catch (error) {
                console.error("Error updating gallery items:", error);
            }
        }

        // Fetch updated news with associations
        const completeNews = await News.findByPk(req.params.id, {
            include: [
                { model: Tag, through: { attributes: [] }, as: 'Tags' },
                { model: Menu, through: { attributes: [] }, as: 'Categories' },
                { model: Author, as: 'Author' },
                { model: NewsGalleryItem, as: 'GalleryItems' }
            ]
        });

        res.status(200).json({
            message: "News Post Updated Successfully",
            news: completeNews
        });
    } catch (error) {
        console.error("Update News Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Delete News Post
const deleteNews = async (req, res) => {
    try {
        const news = await News.findByPk(req.params.id);
        if (!news) {
            return res.status(404).json({ message: "News Post Not Found" });
        }

        // Delete associated images
        const imageFields = ['leadImage', 'thumbImage', 'metaImage'];
        for (const field of imageFields) {
            if (news[field]) {
                const imagePath = path.join(__dirname, "..", news[field]);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        }

        // Delete from image registry
        await ImageRegistry.destroy({
            where: {
                sourceType: 'news',
                sourceId: req.params.id
            }
        });

        // Delete associations
        await NewsTag.destroy({ where: { newsId: req.params.id } });
        await NewsCategory.destroy({ where: { newsId: req.params.id } });

        await news.destroy();
        res.status(200).json({ message: "News Post Deleted Successfully" });
    } catch (error) {
        console.error("Delete News Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ✅ Bulk Delete News Posts
const bulkDeleteNews = async (req, res) => {
    try {
        const { newsIds } = req.body;

        if (!newsIds || !Array.isArray(newsIds) || newsIds.length === 0) {
            return res.status(400).json({ message: "News IDs are required" });
        }

        const newsPosts = await News.findAll({
            where: { id: newsIds }
        });

        // Delete images and associations for all news posts
        for (const news of newsPosts) {
            const imageFields = ['leadImage', 'thumbImage', 'metaImage'];
            for (const field of imageFields) {
                if (news[field]) {
                    const imagePath = path.join(__dirname, "..", news[field]);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
            }

            await NewsTag.destroy({ where: { newsId: news.id } });
            await NewsCategory.destroy({ where: { newsId: news.id } });
        }

        await News.destroy({
            where: { id: newsIds }
        });

        res.status(200).json({
            message: `${newsIds.length} news post(s) deleted successfully`
        });
    } catch (error) {
        console.error("Bulk Delete News Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    createNews,
    getAllNews,
    getNews,
    getNewsBySlug,
    updateNews,
    deleteNews,
    bulkDeleteNews,
    getCategories
};
