const { query } = require('../config/database');
const { validateInput, categorySchema, generateSlug } = require('../utils/validation-utils');

const getCategories = async (req, res) => {
    try {
        const active = req.query.active;

        let whereConditions = [];
        let params = [];

        if (active === 'true') {
            whereConditions.push('is_active = TRUE');
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const categories = await query(
            `SELECT id, title, slug, description, sort_order, is_active, created_at, updated_at
             FROM categories
             ${whereClause}
             ORDER BY sort_order ASC, title ASC`,
            params
        );

        return res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Categories GET Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const createCategory = async (req, res) => {
    try {
        const validation = validateInput(req.body, categorySchema);

        if (!validation.valid) {
            return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
        }

        const data = validation.value;
        const slug = generateSlug(data.title);

        const result = await query(
            'INSERT INTO categories (title, slug, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
            [data.title, slug, data.description || null, data.sort_order, data.is_active ? 1 : 0]
        );

        return res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                title: data.title,
                slug,
                description: data.description || null,
                sort_order: data.sort_order,
                is_active: data.is_active,
            },
        });
    } catch (error) {
        console.error('Categories POST Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const validation = validateInput(req.body, categorySchema);

        if (!validation.valid) {
            return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
        }

        const data = validation.value;
        const slug = generateSlug(data.title);

        await query(
            'UPDATE categories SET title = ?, slug = ?, description = ?, sort_order = ?, is_active = ? WHERE id = ?',
            [data.title, slug, data.description || null, data.sort_order, data.is_active ? 1 : 0, id]
        );

        return res.json({
            success: true,
            data: {
                id,
                title: data.title,
                slug,
                description: data.description || null,
                sort_order: data.sort_order,
                is_active: data.is_active,
            },
        });
    } catch (error) {
        console.error('Category PUT Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if category has portfolio items
        const items = await query('SELECT id FROM portfolio_items WHERE category_id = ? LIMIT 1', [id]);
        if (items.length > 0) {
            return res.status(400).json({ success: false, error: 'Cannot delete category with associated portfolio items' });
        }

        await query('DELETE FROM categories WHERE id = ?', [id]);
        return res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Category DELETE Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
