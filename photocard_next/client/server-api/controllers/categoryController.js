const pool = require('../config/db');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ph_categories ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    try {
        const [result] = await pool.query(
            'INSERT INTO ph_categories (name, slug, description) VALUES (?, ?, ?)',
            [name, slug, description]
        );
        res.status(201).json({ id: result.insertId, name, slug, description });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Category already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    const { name, description } = req.body;
    const slug = name.toLowerCase().split(' ').join('-');
    try {
        const [result] = await pool.query(
            'UPDATE ph_categories SET name = ?, slug = ?, description = ? WHERE id = ?',
            [name, slug, description, req.params.id]
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
