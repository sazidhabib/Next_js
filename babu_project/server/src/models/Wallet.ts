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
  public id!: string;
  public user_id!: string;
  public balance!: number;
  public bonus_balance!: number;
  public locked_balance!: number;
  public currency!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
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

