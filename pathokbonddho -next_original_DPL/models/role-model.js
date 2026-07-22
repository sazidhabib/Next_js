const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

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

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: DEFAULT_PERMISSIONS,
        get() {
            const rawValue = this.getDataValue('permissions');
            const cleaned = cleanPermissionObject(rawValue);
            return cleaned || DEFAULT_PERMISSIONS;
        },
        set(value) {
            const cleaned = cleanPermissionObject(value);
            this.setDataValue('permissions', cleaned || DEFAULT_PERMISSIONS);
        }
    }
}, {
    tableName: 'roles',
    timestamps: true
});

Role.DEFAULT_PERMISSIONS = DEFAULT_PERMISSIONS;

module.exports = Role;
