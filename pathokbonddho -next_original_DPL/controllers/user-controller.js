const { User, Role } = require("../models");
const bcrypt = require("bcryptjs");

// GET /api/users — List all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{ model: Role, as: 'roleRelation' }],
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
            attributes: { exclude: ['password'] },
            include: [{ model: Role, as: 'roleRelation' }]
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
        const { username, email, phone, password, role, roleId, permissions, isAdmin } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Validate required fields
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "Username, email, phone, and password are required" });
        }

        // Restrict superadmin role creation to superadmin
        if (role === 'superadmin' && (!req.user || req.user.role !== 'superadmin')) {
            return res.status(403).json({ message: "Only superadmins can create a superadmin user" });
        }

        const parsedRoleId = roleId ? Number(roleId) : null;
        let effectivePermissions = permissions;

        if (!effectivePermissions && parsedRoleId) {
            const roleObj = await Role.findByPk(parsedRoleId);
            if (roleObj) {
                effectivePermissions = roleObj.permissions;
            }
        }
        if (!effectivePermissions) {
            effectivePermissions = User.DEFAULT_PERMISSIONS;
        }

        const newUser = await User.create({
            username,
            email,
            phone,
            password,
            role: role || 'editor',
            roleId: parsedRoleId,
            permissions: effectivePermissions,
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

        const { username, email, phone, role, roleId, permissions, isAdmin, isActive } = req.body;

        // Restrict promoting to superadmin unless you are a superadmin
        if (role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Only superadmins can assign superadmin role" });
        }

        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (role !== undefined) updateData.role = role;
        if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
        if (isActive !== undefined) updateData.isActive = isActive;

        if (roleId !== undefined) {
            const parsedRoleId = roleId ? Number(roleId) : null;
            updateData.roleId = parsedRoleId;

            // When a role is assigned, automatically apply the role's permissions
            if (parsedRoleId) {
                const roleObj = await Role.findByPk(parsedRoleId);
                if (roleObj) {
                    updateData.permissions = roleObj.permissions;
                }
            } else if (permissions === undefined) {
                updateData.permissions = User.DEFAULT_PERMISSIONS;
            }
        }

        if (permissions !== undefined) {
            updateData.permissions = permissions;
        }

        await user.update(updateData);

        // Explicitly notify Sequelize that permissions JSON has changed to guarantee save
        if (updateData.permissions !== undefined) {
            user.changed('permissions', true);
            await user.save();
        }

        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Role, as: 'roleRelation' }]
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
