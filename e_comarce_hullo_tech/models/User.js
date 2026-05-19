const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');
const crypto = require('crypto');

// Native helper to hash password using pbkdf2
const hashPasswordNative = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

// Native helper to verify password
const verifyPasswordNative = (password, storedPassword) => {
  if (!storedPassword || !storedPassword.includes(':')) return false;
  const [salt, originalHash] = storedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
};

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
  },
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: (user) => {
      if (user.password) {
        user.password = hashPasswordNative(user.password);
      }
    },
    beforeUpdate: (user) => {
      if (user.changed('password')) {
        user.password = hashPasswordNative(user.password);
      }
    }
  }
});

// Method to verify password
User.prototype.matchPassword = async function (enteredPassword) {
  return verifyPasswordNative(enteredPassword, this.password);
};

module.exports = User;
