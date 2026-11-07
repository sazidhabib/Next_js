import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Wallet } from './Wallet.js';
import { Transaction } from './Transaction.js';
import { Game } from './Game.js';
import { BetRound } from './BetRound.js';

// Associations

// User <-> Wallet (1 to 1)
User.hasOne(Wallet, {
  foreignKey: 'user_id',
  as: 'wallet',
  onDelete: 'CASCADE',
});
Wallet.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// User <-> Transaction (1 to Many)
User.hasMany(Transaction, {
  foreignKey: 'user_id',
  as: 'transactions',
  onDelete: 'CASCADE',
});
Transaction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Transaction <-> Admin Reviewer (Many to 1)
Transaction.belongsTo(User, {
  foreignKey: 'reviewed_by',
  as: 'reviewer',
});

// User <-> BetRound (1 to Many)
User.hasMany(BetRound, {
  foreignKey: 'user_id',
  as: 'bet_rounds',
  onDelete: 'CASCADE',
});
BetRound.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Game <-> BetRound (1 to Many)
Game.hasMany(BetRound, {
  foreignKey: 'game_id',
  as: 'bet_rounds',
  onDelete: 'SET NULL',
});
BetRound.belongsTo(Game, {
  foreignKey: 'game_id',
  as: 'game',
});

export {
  sequelize,
  User,
  Wallet,
  Transaction,
  Game,
  BetRound,
};

