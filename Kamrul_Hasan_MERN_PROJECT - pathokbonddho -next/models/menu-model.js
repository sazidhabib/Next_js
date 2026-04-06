const { DataTypes } = require("sequelize");
const sequelize = require('../db/database');

const Menu = sequelize.define("Menu", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Menu name is required'
            },
            notEmpty: {
                msg: 'Menu name cannot be empty'
            }
        },
        unique: {
            name: 'unique_menu_name',
            msg: 'Menu name already exists'
        }
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Menu path is required'
            },
            notEmpty: {
                msg: 'Menu path cannot be empty'
            }
        },
        unique: {
            name: 'unique_menu_path',
            msg: 'Menu path already exists'
        }
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Order is required'
            },
            isInt: {
                msg: 'Order must be an integer'
            }
        }
    },
    metaTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: 'Meta title cannot exceed 255 characters'
            }
        }
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Meta description cannot exceed 500 characters'
            }
        }
    },
    metaKeywords: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 500],
                msg: 'Meta keywords cannot exceed 500 characters'
            }
        }
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'menus',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: {
                msg: 'Level must be an integer'
            },
            min: {
                args: [0],
                msg: 'Level cannot be negative'
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'menus',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['name']
        },
        {
            unique: true,
            fields: ['path']
        },
        {
            fields: ['parentId']
        },
        {
            fields: ['level']
        },
        {
            fields: ['order']
        },
        {
            fields: ['isActive']
        }
    ]
});

// Self-referential association for sub-menus
Menu.hasMany(Menu, {
    as: 'children',
    foreignKey: 'parentId',
    onDelete: 'CASCADE'
});

Menu.belongsTo(Menu, {
    as: 'parent',
    foreignKey: 'parentId'
});

module.exports = Menu;