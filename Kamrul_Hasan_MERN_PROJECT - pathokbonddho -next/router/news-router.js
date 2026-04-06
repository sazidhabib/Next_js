// routes/news-router.js
const express = require("express");
const router = express.Router();
const News = require("../models/news-model");
const Tag = require("../models/tag-model");
const Menu = require("../models/menu-model"); // Make sure this is correct!
const Author = require("../models/author-model");
const sequelize = require("../db/database");
const { upload, convertToWebp } = require("../middlewares/multer-config");
const {
    createNews,
    getAllNews,
    getNews,
    getNewsBySlug,
    updateNews,
    deleteNews,
    bulkDeleteNews,
    getCategories
} = require("../controllers/news-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Configure multer for multiple files
const newsUpload = upload.fields([
    { name: 'leadImage', maxCount: 1 },
    { name: 'thumbImage', maxCount: 1 },
    { name: 'metaImage', maxCount: 1 }
]);

// Public routes
router.get("/", getAllNews);
router.get("/:id", getNews);
router.get("/slug/:slug", getNewsBySlug);
router.get("/categories/list", getCategories);

// Protected routes (require authentication)
router.post("/", authMiddleware, newsUpload, convertToWebp('post_image'), createNews);
router.patch("/:id", authMiddleware, newsUpload, convertToWebp('post_image'), updateNews);
router.delete("/:id", authMiddleware, deleteNews);
router.post("/bulk-delete", authMiddleware, bulkDeleteNews);



// Add this route for debugging
router.get("/debug/all", async (req, res) => {
    try {
        console.log('=== DEBUG ALL NEWS ===');

        // 1. Check tables exist
        const [tables] = await sequelize.query("SHOW TABLES");
        console.log('Database tables:', tables.map(t => Object.values(t)[0]));

        // 2. Direct SQL query
        const [newsRows] = await sequelize.query("SELECT id, newsHeadline, status, authorId, createdAt FROM news ORDER BY createdAt DESC");
        console.log('Direct SQL - News count:', newsRows.length);
        console.log('Sample news from SQL:', newsRows.slice(0, 3));

        // 3. ORM query
        const ormNews = await News.findAll({
            limit: 5,
            order: [["createdAt", "DESC"]]
        });
        console.log('ORM - News count:', ormNews.length);
        console.log('ORM sample:', ormNews.map(n => ({
            id: n.id,
            headline: n.newsHeadline,
            status: n.status
        })));

        // 4. Check associations
        const [tagsRows] = await sequelize.query("SELECT COUNT(*) as count FROM tags");
        const [categoriesRows] = await sequelize.query("SELECT COUNT(*) as count FROM menus");
        const [authorsRows] = await sequelize.query("SELECT COUNT(*) as count FROM authors");

        res.json({
            tables: tables.map(t => Object.values(t)[0]),
            sqlNews: {
                count: newsRows.length,
                sample: newsRows.slice(0, 5)
            },
            ormNews: {
                count: ormNews.length,
                sample: ormNews.map(n => ({
                    id: n.id,
                    headline: n.newsHeadline,
                    status: n.status,
                    authorId: n.authorId
                }))
            },
            counts: {
                tags: tagsRows[0].count,
                menus: categoriesRows[0].count,
                authors: authorsRows[0].count
            }
        });

    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/test/model", async (req, res) => {
    try {
        console.log('=== TEST NEWS MODEL ===');

        // Check if News model is loaded
        console.log('News model:', News ? 'Loaded' : 'Not loaded');
        console.log('News model name:', News.name);
        console.log('News tableName:', News.tableName);

        // Simple count
        const count = await News.count();
        console.log('Total news via ORM:', count);

        // Simple find
        const sample = await News.findOne();
        console.log('Sample news via ORM:', sample ? {
            id: sample.id,
            headline: sample.newsHeadline,
            status: sample.status
        } : 'No news found');

        res.json({
            modelLoaded: !!News,
            tableName: News.tableName,
            count: count,
            sample: sample ? {
                id: sample.id,
                headline: sample.newsHeadline
            } : null
        });

    } catch (error) {
        console.error('Model test error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add to news-router.js
router.get("/test/associations/:id", async (req, res) => {
    try {
        const newsId = req.params.id;
        console.log(`=== TEST ASSOCIATIONS FOR NEWS ${newsId} ===`);

        // Test 1: News with associations
        const newsWithAssoc = await News.findByPk(newsId, {
            include: [
                { model: Tag, through: { attributes: [] } },
                { model: Menu, through: { attributes: [] } },
                { model: Author }
            ]
        });

        console.log('News with associations:', {
            found: !!newsWithAssoc,
            tags: newsWithAssoc?.Tags?.length || 0,
            categories: newsWithAssoc?.Categories?.length || 0,
            author: newsWithAssoc?.Author?.name
        });

        // Test 2: Check NewsTag table
        const [newsTags] = await sequelize.query(
            "SELECT * FROM news_tags WHERE newsId = ?",
            { replacements: [newsId] }
        );

        // Test 3: Check NewsCategory table
        const [newsCategories] = await sequelize.query(
            "SELECT * FROM news_categories WHERE newsId = ?",
            { replacements: [newsId] }
        );

        res.json({
            news: newsWithAssoc ? {
                id: newsWithAssoc.id,
                headline: newsWithAssoc.newsHeadline,
                tags: newsWithAssoc.Tags,
                categories: newsWithAssoc.Categories,
                author: newsWithAssoc.Author
            } : null,
            newsTags: newsTags,
            newsCategories: newsCategories,
            tables: {
                news_tags: newsTags.length,
                news_categories: newsCategories.length
            }
        });

    } catch (error) {
        console.error('Association test error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;