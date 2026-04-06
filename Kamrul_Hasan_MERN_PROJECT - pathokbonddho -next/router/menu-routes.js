
const express = require('express');
const router = express.Router();
const sequelize = require('../db/database');
const Menu = require('../models/menu-model');
const {
    createMenu,
    getMenus,
    getMenuById,
    getParentMenus,
    updateMenu,
    deleteMenu,
    updateMenuOrder,
    debugMiddleware
} = require('../controllers/menu-controller');
const authMiddleware = require('../middlewares/auth-middleware');

console.log('📋 Menu routes file loaded');
console.log('getMenus function:', typeof getMenus);


// Test if route is being captured by something else
router.get('*', (req, res, next) => {
    console.log('🔄 Wildcard route hit:', req.url);
    next();
});

// Test database connection
router.get('/debug/db-test', async (req, res) => {
    try {
        console.log('=== DATABASE TEST ===');

        // Test 1: Raw query
        const [rawResults] = await sequelize.query('SELECT id, name, isActive FROM menus ORDER BY id');
        console.log('Raw query results:', rawResults.length);

        // Test 2: Sequelize count
        const count = await Menu.count();
        console.log('Sequelize count:', count);

        // Test 3: Sequelize findAll
        const sequelizeResults = await Menu.findAll({
            attributes: ['id', 'name', 'isActive', 'parentId'],
            order: [['id', 'ASC']],
            limit: 3
        });

        res.json({
            success: true,
            rawQuery: {
                count: rawResults.length,
                data: rawResults
            },
            sequelize: {
                count: count,
                data: sequelizeResults.map(m => m.toJSON())
            }
        });

    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Debug middleware for all menu routes
router.use((req, res, next) => {
    console.log('📝 Menu Route Accessed:', {
        method: req.method,
        url: req.url,
        originalUrl: req.originalUrl,
        time: new Date().toISOString()
    });
    next();
});

// Simple test route
router.get('/test', (req, res) => {
    console.log('✅ /api/menus/test route is working!');
    res.json({
        success: true,
        message: 'Menu routes are working',
        timestamp: new Date().toISOString()
    });
});

// Test endpoint with hardcoded response
router.get('/test-structure', (req, res) => {
    console.log('Test structure endpoint called');

    // This should match what getMenus should return
    const testResponse = {
        success: true,
        data: [
            { id: 1, name: 'Test Menu 1', path: '/test1' },
            { id: 2, name: 'Test Menu 2', path: '/test2' }
        ],
        format: 'flat',
        count: 2
    };

    console.log('Sending test response:', testResponse);
    res.json(testResponse);
});

// Public Routes - with detailed logging
router.get('/', (req, res, next) => {
    console.log('🔥🔥🔥 /api/menus ROUTE TRIGGERED! 🔥🔥🔥');
    console.log('Request details:', {
        url: req.url,
        method: req.method,
        query: req.query,
        originalUrl: req.originalUrl
    });
    return getMenus(req, res, next);
});

// Public Routes
// router.get('/', getMenus);
router.get('/parents', getParentMenus);
router.get('/:id', getMenuById);

// Protected Admin Routes
router.post('/', authMiddleware, createMenu);
router.patch('/:id', authMiddleware, updateMenu);
router.delete('/:id', authMiddleware, deleteMenu);
router.post('/update-order', authMiddleware, updateMenuOrder);

module.exports = router;