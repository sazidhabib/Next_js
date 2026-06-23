const Menu = require('../models/menu-model');
const { Op } = require('sequelize');


// Debug middleware for getMenus
const debugMiddleware = (req, res, next) => {
    console.log('🔍 Debug - Request received for getMenus');
    console.log('URL:', req.url);
    console.log('Method:', req.method);

    // Store the original json method
    const originalJson = res.json;

    // Override json method to see what's being sent
    res.json = function (data) {
        console.log('🔍 Debug - Response being sent:');
        console.log('Type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        console.log('Data:', JSON.stringify(data).substring(0, 200) + '...');

        // Call original method
        return originalJson.call(this, data);
    };

    next();
};


// Helper function to build menu tree
const buildMenuTree = (menus, parentId = null) => {
    if (!menus || !Array.isArray(menus)) return [];

    return menus
        .filter(menu => menu.parentId === parentId)
        .map(menu => {
            const menuObj = menu.toJSON ? menu.toJSON() : menu;
            return {
                ...menuObj,
                children: buildMenuTree(menus, menuObj.id)
            };
        })
        .sort((a, b) => a.order - b.order);
};

// Protected Admin Routes
const createMenu = async (req, res) => {
    try {
        const { name, path, order, metaTitle, metaDescription, metaKeywords, parentId, level = 0, isActive = true } = req.body;

        // Validate input
        if (!name || !path || order === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name, path, and order are required'
            });
        }

        // Validate parent exists if parentId is provided
        if (parentId) {
            const parentMenu = await Menu.findByPk(parentId);
            if (!parentMenu) {
                return res.status(400).json({
                    success: false,
                    message: 'Parent menu not found'
                });
            }
        }

        const menu = await Menu.create({
            name,
            path,
            order,
            metaTitle,
            metaDescription,
            metaKeywords,
            parentId,
            level,
            isActive
        });

        // Include parent information in response
        const menuWithParent = await Menu.findByPk(menu.id, {
            include: [{
                model: Menu,
                as: 'parent',
                attributes: ['id', 'name']
            }]
        });

        res.status(201).json({
            success: true,
            data: menuWithParent
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            const field = err.errors[0].path;
            return res.status(400).json({
                success: false,
                message: `Menu with this ${field} already exists`
            });
        }

        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: err.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};


// Public Routes
// Public Routes
const getMenus = async (req, res) => {
    console.log('=== 🎯 GET MENUS CALLED 🎯 ===');

    try {
        const { format = 'flat', activeOnly = 'false' } = req.query;
        console.log('Query params:', { format, activeOnly });

        // 1. Build where clause FIRST
        const whereClause = {};
        if (activeOnly === 'true') {
            whereClause.isActive = true;
        }
        console.log('Where clause:', whereClause);

        // 2. Test queries (optional - for debugging)
        console.log('=== Testing different queries ===');

        const allMenus = await Menu.findAll({
            order: [['id', 'ASC']]
        });
        console.log('All menus (no conditions):', allMenus.length);

        const activeMenus = await Menu.findAll({
            where: { isActive: true },
            order: [['id', 'ASC']]
        });
        console.log('Active menus only:', activeMenus.length);

        const inactiveMenus = await Menu.findAll({
            where: { isActive: false },
            order: [['id', 'ASC']]
        });
        console.log('Inactive menus:', inactiveMenus.length);

        console.log('=== Testing complete ===');

        // 3. Get menus with the actual query using whereClause
        const menus = await Menu.findAll({
            where: whereClause,
            include: [{
                model: Menu,
                as: 'parent',
                attributes: ['id', 'name']
            }],
            order: [['level', 'ASC'], ['order', 'ASC']]
        });

        console.log('Main query found:', menus.length, 'menus');

        if (menus.length === 0) {
            console.log('No menus found with current filters');
            return res.json({
                success: true,
                data: [],
                count: 0,
                format: format,
                message: 'No menus found'
            });
        }

        console.log('First menu sample:', {
            id: menus[0].id,
            name: menus[0].name,
            parentId: menus[0].parentId,
            parent: menus[0].parent,
            isActive: menus[0].isActive
        });

        // 4. Convert to plain objects
        const plainMenus = menus.map(menu => menu.toJSON());

        // 5. Add parent information manually (if not already included)
        const menusWithParents = await Promise.all(
            plainMenus.map(async (menu) => {
                if (!menu.parent && menu.parentId) {
                    const parent = await Menu.findByPk(menu.parentId, {
                        attributes: ['id', 'name']
                    });
                    menu.parent = parent ? { id: parent.id, name: parent.name } : null;
                } else if (!menu.parentId) {
                    menu.parent = null;
                }
                return menu;
            })
        );

        // 6. Build response based on format
        let responseData;
        if (format === 'tree') {
            responseData = buildMenuTree(menusWithParents);
        } else {
            responseData = menusWithParents;
        }

        // 7. Send response
        const response = {
            success: true,
            data: responseData,
            count: responseData.length,
            format: format
        };

        console.log('📤 Sending response with', response.data.length, 'menus');
        res.json(response);

    } catch (err) {
        console.error('❌ Get menus error:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message,
            data: []
        });
    }
};


// Get menu by ID with children
const getMenuById = async (req, res) => {
    try {
        const { id } = req.params;

        const menu = await Menu.findByPk(id, {
            include: [
                {
                    model: Menu,
                    as: 'parent',
                    attributes: ['id', 'name']
                },
                {
                    model: Menu,
                    as: 'children',
                    include: [{
                        model: Menu,
                        as: 'children'
                    }],
                    order: [['order', 'ASC']]
                }
            ]
        });

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menu
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

// Get only parent menus (for dropdowns)
const getParentMenus = async (req, res) => {
    try {
        const parentMenus = await Menu.findAll({
            where: {
                parentId: null,
                isActive: true
            },
            attributes: ['id', 'name', 'level'],
            order: [['level', 'ASC'], ['order', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: parentMenus || []
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message,
            data: []
        });
    }
};

// Protected Admin Routes
const updateMenu = async (req, res) => {
    try {
        const { name, path, order, metaTitle, metaDescription, metaKeywords, parentId, level, isActive } = req.body;
        const { id } = req.params;

        const menu = await Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        // Prevent circular reference
        if (parentId && parentId == id) {
            return res.status(400).json({
                success: false,
                message: 'Menu cannot be its own parent'
            });
        }

        // Validate parent exists if parentId is provided
        if (parentId) {
            const parentMenu = await Menu.findByPk(parentId);
            if (!parentMenu) {
                return res.status(400).json({
                    success: false,
                    message: 'Parent menu not found'
                });
            }
        }

        // Update menu
        await menu.update({
            name,
            path,
            order,
            metaTitle,
            metaDescription,
            metaKeywords,
            parentId,
            level,
            isActive
        });

        // Fetch updated menu with relations
        const updatedMenu = await Menu.findByPk(id, {
            include: [{
                model: Menu,
                as: 'parent',
                attributes: ['id', 'name']
            }]
        });

        res.status(200).json({
            success: true,
            data: updatedMenu
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            const field = err.errors[0].path;
            return res.status(400).json({
                success: false,
                message: `Menu with this ${field} already exists`
            });
        }

        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: err.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const menu = await Menu.findByPk(id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        // Check if menu has children
        const childCount = await Menu.count({
            where: { parentId: id }
        });

        if (childCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete menu with sub-menus. Please delete sub-menus first.'
            });
        }

        await menu.destroy();

        res.status(200).json({
            success: true,
            message: 'Menu deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

// Bulk update menu order and hierarchy
const updateMenuOrder = async (req, res) => {
    try {
        const { menus } = req.body; // Array of { id, order, parentId, level }

        if (!Array.isArray(menus)) {
            return res.status(400).json({
                success: false,
                message: 'Menus array is required'
            });
        }

        const updatePromises = menus.map(menu =>
            Menu.update(
                {
                    order: menu.order,
                    parentId: menu.parentId,
                    level: menu.level
                },
                { where: { id: menu.id } }
            )
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: 'Menu order updated successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

module.exports = {
    createMenu,
    getMenus,
    getMenuById,
    getParentMenus,
    updateMenu,
    deleteMenu,
    updateMenuOrder,
    debugMiddleware
};