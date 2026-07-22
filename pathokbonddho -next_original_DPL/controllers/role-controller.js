const { Role } = require("../models");

// GET /api/roles — List all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ roles });
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ message: "Failed to fetch roles" });
    }
};

// GET /api/roles/:id — Get a single role
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json({ role });
    } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Failed to fetch role" });
    }
};

// POST /api/roles — Create a new role
const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Role name is required" });
        }

        // Check if role name already exists
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            return res.status(400).json({ message: "Role name already exists" });
        }

        const newRole = await Role.create({
            name,
            permissions: permissions || Role.DEFAULT_PERMISSIONS
        });

        res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ message: "Failed to create role" });
    }
};

// PUT /api/roles/:id — Update role permissions & name
const updateRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        const { name, permissions } = req.body;

        if (name !== undefined) role.name = name;
        if (permissions !== undefined) {
            role.permissions = permissions;
            role.changed('permissions', true);
        }

        await role.save();

        // Fetch updated role
        const updatedRole = await Role.findByPk(req.params.id);

        res.status(200).json({ message: "Role updated successfully", role: updatedRole });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Failed to update role" });
    }
};

// DELETE /api/roles/:id — Delete a role
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Optional: Check if any users are assigned to this role before deleting
        // If they are, prevent delete or prompt to re-assign.
        // For simplicity, we can set their roleId to null or return an error.
        const User = require("../models/user-model");
        const assignedUsersCount = await User.count({ where: { roleId: role.id } });
        if (assignedUsersCount > 0) {
            return res.status(400).json({ message: `Cannot delete role. It is assigned to ${assignedUsersCount} user(s).` });
        }

        await role.destroy();
        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ message: "Failed to delete role" });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
