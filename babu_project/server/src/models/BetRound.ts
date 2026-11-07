import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type BetRoundStatus = 'pending' | 'settled' | 'refunded';

export interface BetRoundAttributes {
  id: string;
  user_id: string;
  game_id?: string;
  provider_round_id: string;
  provider_transaction_id: string;
  bet_amount: number;
  win_amount: number;
  status: BetRoundStatus;
  raw_payload?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BetRoundCreationAttributes
  extends Optional<BetRoundAttributes, 'id' | 'game_id' | 'win_amount' | 'status' | 'raw_payload'> {}

export class BetRound extends Model<BetRoundAttributes, BetRoundCreationAttributes> implements BetRoundAttributes {
  public id!: string;
  public user_id!: string;
  public game_id?: string;
  public provider_round_id!: string;
  public provider_transaction_id!: string;
  public bet_amount!: number;
  public win_amount!: number;
  public status!: BetRoundStatus;
  public raw_payload?: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BetRound.init(
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
    game_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    provider_round_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    provider_transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    bet_amount: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0.0,
      allowNull: false,
      get() {
        const val = this.getDataValue('bet_amount');
        return val === null ? 0 : parseFloat(val as unknown as string);
      },
    },
    win_amount: {
      type: DataTypes.DECIMAL(18, 4),
      defaultValue: 0.0,
      allowNull: false,
      get() {
        const val = this.getDataValue('win_amount');
        return val === null ? 0 : parseFloat(val as unknown as string);
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'settled', 'refunded'),
      defaultValue: 'pending',
      allowNull: false,
    },
    raw_payload: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'bet_rounds',
    indexes: [
      { unique: true, fields: ['provider_transaction_id'] },
      { fields: ['user_id'] },
      { fields: ['provider_round_id'] },
      { fields: ['status'] },
    ],
  }
);

