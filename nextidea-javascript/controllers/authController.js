const { query } = require('../config/database');
const { verifyPassword, generateAccessToken, generateRefreshToken, setAuthCookies, clearAuthCookies } = require('../utils/auth-utils');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const users = await query(
            'SELECT id, username, email, password_hash, role, is_active FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            // Constant time comparison to prevent timing attacks
            await bcrypt.compare(password, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILp92S.0i');
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const user = users[0];

        if (!user.is_active) {
            return res.status(403).json({ success: false, error: 'Account is deactivated' });
        }

        const isValidPassword = await verifyPassword(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const tokenHash = await bcrypt.hash(refreshToken, 12);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [user.id, tokenHash, expiresAt]
        );

        setAuthCookies(res, accessToken, refreshToken);

        const sessionId = uuidv4();
        res.cookie('session_id', sessionId, {
            httpOnly: true,
            secure: process.env.SESSION_SECURE === 'true',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        return res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refresh_token;

        if (refreshToken) {
            // Optional: Invalidate the refresh token in the database
            // await query('DELETE FROM refresh_tokens WHERE token_hash = ...');
        }

        clearAuthCookies(res);
        return res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        const users = await query(
            'SELECT id, username, email, role FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        return res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    login,
    logout,
    getCurrentUser
};
