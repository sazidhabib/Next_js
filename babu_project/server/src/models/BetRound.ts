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
  declare id: string;
  declare user_id: string;
  declare game_id?: string;
  declare provider_round_id: string;
  declare provider_transaction_id: string;
  declare bet_amount: number;
  declare win_amount: number;
  declare status: BetRoundStatus;
  declare raw_payload?: string;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
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

