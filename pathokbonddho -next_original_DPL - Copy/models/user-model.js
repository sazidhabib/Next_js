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
    permissions: {
        type: DataTypes.JSON,
        defaultValue: DEFAULT_PERMISSIONS,
        get() {
            const rawValue = this.getDataValue('permissions');
            // If superadmin, always return full permissions
            if (this.getDataValue('role') === 'superadmin') {
                return FULL_PERMISSIONS;
            }
            return rawValue || DEFAULT_PERMISSIONS;
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
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method for comparing password
User.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Instance method for generating token
User.prototype.generateToken = function () {
    return jwt.sign(
        {
            userId: this.id,
            email: this.email,
            isAdmin: this.isAdmin,
            role: this.role
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "4h" }
    );
};

// Export constants for use in other files
User.DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS;
User.FULL_PERMISSIONS = FULL_PERMISSIONS;

module.exports = User;