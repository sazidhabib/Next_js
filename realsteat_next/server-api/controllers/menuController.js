const pool = require('../config/db');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT m.*, c.name as category_name, c.slug as category_slug 
            FROM ph_menu_items m 
            LEFT JOIN ph_categories c ON m.category_id = c.id 
            ORDER BY m.item_order ASC
        `);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create menu item
exports.createMenuItem = async (req, res) => {
    const { title, category_id, url, parent_id, item_order } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO ph_menu_items (title, category_id, url, parent_id, item_order) VALUES (?, ?, ?, ?, ?)',
            [title, category_id || null, url || null, parent_id || null, item_order || 0]
        );
        res.status(201).json({ id: result.insertId, title, category_id, url, parent_id, item_order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    const { title, category_id, url, parent_id, item_order } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE ph_menu_items SET title = ?, category_id = ?, url = ?, parent_id = ?, item_order = ? WHERE id = ?',
            [title, category_id || null, url || null, parent_id || null, item_order || 0, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Menu item not found' });
        res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM ph_menu_items WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Menu item not found' });
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
