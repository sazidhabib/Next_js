const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Default permissions object — all sections with view/edit/delete
const DEFAULT_PERMISSIONS = {
    dashboard: { view: true, edit: false, delete: false },
    menu: { view: false, edit: false, delete: false },
    heroSection: { view: false, edit: false, delete: false },
    sections: { view: false, edit: false, delete: false },
    articles: { view: false, edit: false, delete: false },
    tags: { view: false, edit: false, delete: false },
    authors: { view: false, edit: false, delete: false },
    ads: { view: false, edit: false, delete: false },
    design: { view: false, edit: false, delete: false },
    blog: { view: false, edit: false, delete: false },
    news: { view: false, edit: false, delete: false },
    gallery: { view: false, edit: false, delete: false },
    songs: { view: false, edit: false, delete: false },
    videos: { view: false, edit: false, delete: false },
    pageLayout: { view: false, edit: false, delete: false },
    users: { view: false, edit: false, delete: false }
};

// Full permissions for superadmin
const FULL_PERMISSIONS = {};
Object.keys(DEFAULT_PERMISSIONS).forEach(key => {
    FULL_PERMISSIONS[key] = { view: true, edit: true, delete: true };
});

function cleanPermissionObject(value) {
    if (!value) return null;
    let current = value;
    for (let depth = 0; depth < 5; depth++) {
        if (typeof current === 'string') {
            try {
                current = JSON.parse(current);
            } catch (e) {
                break;
            }
        } else if (current && typeof current === 'object') {
            if (current["0"] !== undefined) {
                let jsonStr = "";
                let i = 0;
                while (current[String(i)] !== undefined) {
                    jsonStr += current[String(i)];
                    i++;
                }
                current = jsonStr;
            } else {
                return current;
            }
        } else {
            break;
        }
    }
    if (current && typeof current === 'object' && current["0"] === undefined) {
        return current;
    }
    return null;
}

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'admin', 'editor'),
        defaultValue: 'editor'
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'roles',
            key: 'id'
        }
    },
    permissions: {
        type: DataTypes.JSON,
        defaultValue: DEFAULT_PERMISSIONS,
        get() {
            // If superadmin, always return full permissions
            if (this.getDataValue('role') === 'superadmin') {
                return FULL_PERMISSIONS;
            }
            // If they have an assigned role relation, return the role's permissions
            if (this.roleRelation && this.roleRelation.permissions) {
                return this.roleRelation.permissions;
            }
            const rawValue = this.getDataValue('permissions');
            const cleaned = cleanPermissionObject(rawValue);
            return cleaned || DEFAULT_PERMISSIONS;
        },
        set(value) {
            const cleaned = cleanPermissionObject(value);
            this.setDataValue('permissions', cleaned || DEFAULT_PERMISSIONS);
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
            if (user.roleId) {
                try {
                    const Role = require('./role-model');
                    const roleRecord = await Role.findByPk(user.roleId);
                    if (roleRecord && roleRecord.permissions) {
                        user.permissions = roleRecord.permissions;
                    }
                } catch (e) {
                    console.error("beforeCreate role sync error:", e);
                }
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
            if (user.changed('roleId')) {
                if (user.roleId) {
                    try {
                        const Role = require('./role-model');
                        const roleRecord = await Role.findByPk(user.roleId);
                        if (roleRecord && roleRecord.permissions) {
                            user.permissions = roleRecord.permissions;
                        }
                    } catch (e) {
                        console.error("beforeUpdate role sync error:", e);
                    }
                } else {
                    user.permissions = DEFAULT_PERMISSIONS;
                }
            }
        }
    }
});

// Instance method for comparing password
User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Instance method for generating token
User.prototype.generateToken = async function () {
    let permissions = this.permissions;

    if (this.role === 'superadmin') {
        permissions = FULL_PERMISSIONS;
    } else if (this.roleId) {
        if (this.roleRelation && this.roleRelation.permissions) {
            permissions = this.roleRelation.permissions;
        } else {
            try {
                const Role = require('./role-model');
                const roleRecord = await Role.findByPk(this.roleId);
                if (roleRecord && roleRecord.permissions) {
                    permissions = roleRecord.permissions;
                }
            } catch (err) {
                console.error("Error loading role in generateToken:", err);
            }
        }
    }

    return jwt.sign(
        {
            userId: this.id,
            email: this.email,
            username: this.username,
            isAdmin: this.isAdmin,
            role: this.role,
            roleId: this.roleId,
            permissions: permissions
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
    );
};

// Export constants for use in other files
User.DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS;
User.FULL_PERMISSIONS = FULL_PERMISSIONS;

module.exports = User;