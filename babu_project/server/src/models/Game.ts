import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type GameCategory = 'slots' | 'live_casino' | 'table' | 'crash';

export interface GameAttributes {
  id: string;
  name: string;
  provider: string;
  category: GameCategory;
  game_code: string;
  thumbnail_url: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GameCreationAttributes
  extends Optional<GameAttributes, 'id' | 'is_active'> {}

export class Game extends Model<GameAttributes, GameCreationAttributes> implements GameAttributes {
  declare id: string;
  declare name: string;
  declare provider: string;
  declare category: GameCategory;
  declare game_code: string;
  declare thumbnail_url: string;
  declare is_active: boolean;

  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('slots', 'live_casino', 'table', 'crash'),
      allowNull: false,
    },
    game_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'games',
    indexes: [
      { unique: true, fields: ['provider', 'game_code'] },
      { fields: ['category'] },
      { fields: ['is_active'] },
    ],
  }
);

