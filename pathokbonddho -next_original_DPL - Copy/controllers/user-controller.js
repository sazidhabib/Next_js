const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

// GET /api/users — List all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// GET /api/users/:id — Get single user
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Failed to fetch user" });
    }
};

// POST /api/users — Create new user
const createUser = async (req, res) => {
    try {
        const { username, email, phone, password, role, permissions, isAdmin } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Validate required fields
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "Username, email, phone, and password are required" });
        }

        const newUser = await User.create({
            username,
            email,
            phone,
            password,
            role: role || 'editor',
            permissions: permissions || User.DEFAULT_PERMISSIONS,
            isAdmin: isAdmin !== undefined ? isAdmin : true,
            isActive: true
        });

        const userResponse = newUser.toJSON();
        delete userResponse.password;

        res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

// PUT /api/users/:id — Update user details & permissions
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent modifying a superadmin unless you are also a superadmin
        if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Cannot modify a superadmin" });
        }

        const { username, email, phone, role, permissions, isAdmin, isActive } = req.body;

        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (role !== undefined) updateData.role = role;
        if (permissions !== undefined) updateData.permissions = permissions;
        if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
        if (isActive !== undefined) updateData.isActive = isActive;

        await user.update(updateData);

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

// DELETE /api/users/:id — Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent deleting a superadmin
        if (user.role === 'superadmin') {
            return res.status(403).json({ message: "Cannot delete a superadmin" });
        }

        // Prevent deleting yourself
        if (user.id === req.user.id) {
            return res.status(403).json({ message: "Cannot delete your own account" });
        }

        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// PUT /api/users/:id/reset-password — Reset user password
const resetPassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 7) {
            return res.status(400).json({ message: "Password must be at least 7 characters" });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Failed to reset password" });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resetPassword
};
