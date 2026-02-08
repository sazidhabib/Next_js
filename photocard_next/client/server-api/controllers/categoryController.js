const pool = require('../config/db');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c1.*, c2.name as parent_name 
            FROM ph_categories c1 
            LEFT JOIN ph_categories c2 ON c1.parent_id = c2.id 
            ORDER BY c1.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    const { name, description, parent_id } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    try {
        const [result] = await pool.query(
            'INSERT INTO ph_categories (name, slug, description, parent_id) VALUES (?, ?, ?, ?)',
            [name, slug, description, parent_id || null]
        );
        res.status(201).json({ id: result.insertId, name, slug, description, parent_id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    const { name, description, parent_id } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    try {
        const [result] = await pool.query(
            'UPDATE ph_categories SET name = ?, slug = ?, description = ?, parent_id = ? WHERE id = ?',
            [name, slug, description, parent_id || null, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM ph_categories WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
