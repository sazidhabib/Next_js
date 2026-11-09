import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface WalletAttributes {
  id: string;
  user_id: string;
  balance: number;
  bonus_balance: number;
  locked_balance: number;
  currency: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface WalletCreationAttributes
  extends Optional<WalletAttributes, 'id' | 'balance' | 'bonus_balance' | 'locked_balance' | 'currency'> {}

export class Wallet extends Model<WalletAttributes, WalletCreationAttributes> implements WalletAttributes {
  declare id: string;
  declare user_id: string;
  declare balance: number;
  declare bonus_balance: number;
  declare locked_balance: number;
  declare currency: string;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Wallet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0.0,
      allowNull: false,
      get() {
        const val = this.getDataValue('balance');
        return val === null ? 0 : parseFloat(val as unknown as string);
      },
    },
    bonus_balance: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0.0,
      allowNull: false,
      get() {
        const val = this.getDataValue('bonus_balance');
        return val === null ? 0 : parseFloat(val as unknown as string);
      },
    },
    locked_balance: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0.0,
      allowNull: false,
      get() {
        const val = this.getDataValue('locked_balance');
        return val === null ? 0 : parseFloat(val as unknown as string);
      },
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'USD',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'wallets',
    indexes: [
      { unique: true, fields: ['user_id'] },
    ],
  }
);

