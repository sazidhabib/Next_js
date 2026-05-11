const { query } = require('../config/database');
const { hashPassword } = require('../utils/auth-utils');
const { validateInput, registerSchema } = require('../utils/validation-utils');

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const role = req.query.role;

        const offset = (page - 1) * limit;

        let whereConditions = [];
        let params = [];

        if (role) {
            whereConditions.push('role = ?');
            params.push(role);
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const countResult = await query(`SELECT COUNT(*) as total FROM users ${whereClause}`, params);
        const total = Number(countResult[0].total);

        const users = await query(
            `SELECT id, username, email, role, is_active, created_at, updated_at, last_login
             FROM users
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const totalPages = Math.ceil(total / limit);

        return res.json({
            success: true,
            data: {
                users,
                pagination: {
                    current_page: page,
                    per_page: limit,
                    total_items: total,
                    total_pages: totalPages,
                    has_next: page < totalPages,
                    has_prev: page > 1,
                },
            },
        });
    } catch (error) {
        console.error('Users GET Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await query(
            'SELECT id, username, email, role, is_active, created_at, updated_at, last_login FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.json({ success: true, data: users[0] });
    } catch (error) {
        console.error('User GET Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const createUser = async (req, res) => {
    try {
        const validation = validateInput(req.body, registerSchema);

        if (!validation.valid) {
            return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
        }

        const { username, email, password } = validation.value;

        const existingUser = await query(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ success: false, error: 'Email or username already exists' });
        }

        const passwordHash = await hashPassword(password);
        const role = req.body.role || 'viewer';

        const result = await query(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [username, email, passwordHash, role]
        );

        return res.status(201).json({
            success: true,
            data: {
                id: result.insertId,
                username,
                email,
                role,
            },
        });
    } catch (error) {
        console.error('User POST Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, is_active, password } = req.body;

        const existingUsers = await query('SELECT * FROM users WHERE id = ?', [id]);
        if (existingUsers.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (parseInt(id, 10) === req.user.userId && is_active === false) {
            return res.status(400).json({ success: false, error: 'Cannot deactivate your own account' });
        }

        if (password) {
            const passwordHash = await hashPassword(password);
            await query(
                'UPDATE users SET username = ?, email = ?, role = ?, is_active = ?, password_hash = ? WHERE id = ?',
                [username, email, role, is_active, passwordHash, id]
            );
        } else {
            await query(
                'UPDATE users SET username = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
                [username, email, role, is_active, id]
            );
        }

        const updatedUser = await query(
            'SELECT id, username, email, role, is_active, created_at, updated_at, last_login FROM users WHERE id = ?',
            [id]
        );

        return res.json({
            success: true,
            data: updatedUser[0],
        });
    } catch (error) {
        console.error('User PUT Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (parseInt(id, 10) === req.user.userId) {
            return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
        }

        const existingUsers = await query('SELECT * FROM users WHERE id = ?', [id]);
        if (existingUsers.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        await query('DELETE FROM users WHERE id = ?', [id]);

        return res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('User DELETE Error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
