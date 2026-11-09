import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type TransactionType = 'deposit' | 'withdrawal' | 'manual_adjustment';
export type TransactionStatus = 'pending' | 'approved' | 'rejected' | 'canceled';

export interface TransactionAttributes {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  payment_method: string;
  transaction_ref?: string;
  proof_image_url?: string;
  reviewed_by?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TransactionCreationAttributes
  extends Optional<TransactionAttributes, 'id' | 'status' | 'transaction_ref' | 'proof_image_url' | 'reviewed_by' | 'notes'> {}

export class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  declare id: string;
  declare user_id: string;
  declare type: TransactionType;
  declare amount: number;
  declare status: TransactionStatus;
  declare payment_method: string;
  declare transaction_ref?: string;
  declare proof_image_url?: string;
  declare reviewed_by?: string;
  declare notes?: string;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdrawal', 'manual_adjustment'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: false,
      get() {
        const val = this.getDataValue('amount');
        return val === null ? 0 : parseFloat(val as unknown as string);
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'canceled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transaction_ref: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    proof_image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reviewed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['transaction_ref'] },
    ],
  }
);

