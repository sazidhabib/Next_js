import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type UserRole = 'super_admin' | 'agent' | 'player';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  phone?: string;
  password_hash: string;
  security_pin_hash?: string;
  role: UserRole;
  status: UserStatus;
  currency: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'phone' | 'security_pin_hash' | 'status' | 'currency'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare username: string;
  declare email: string;
  declare phone?: string;
  declare password_hash: string;
  declare security_pin_hash?: string;
  declare role: UserRole;
  declare status: UserStatus;
  declare currency: string;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    security_pin_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'agent', 'player'),
      defaultValue: 'player',
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'banned'),
      defaultValue: 'active',
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      { unique: true, fields: ['email'] },
      { unique: true, fields: ['username'] },
      { fields: ['role'] },
      { fields: ['status'] },
    ],
  }
);

