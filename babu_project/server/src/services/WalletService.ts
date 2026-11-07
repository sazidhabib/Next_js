import { Transaction as SequelizeTransaction } from 'sequelize';
import { sequelize, User, Wallet, Transaction, BetRound } from '../models/index.js';

export class WalletService {
  /**
   * Fetch current player wallet balance
   */
  public static async getBalance(userId: string) {
    const wallet = await Wallet.findOne({ where: { user_id: userId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return {
      balance: wallet.balance,
      bonus_balance: wallet.bonus_balance,
      locked_balance: wallet.locked_balance,
      currency: wallet.currency,
    };
  }

  /**
   * Seamless Wallet: Atomic Bet (Debit) with row lock
   */
  public static async executeBet(params: {
    userId: string;
    amount: number;
    providerRoundId: string;
    providerTxId: string;
    gameId?: string;
    rawPayload?: string;
  }) {
    const { userId, amount, providerRoundId, providerTxId, gameId, rawPayload } = params;

    // Idempotency check: Has this transaction already been processed?
    const existingBet = await BetRound.findOne({
      where: { provider_transaction_id: providerTxId },
    });
    if (existingBet) {
      const currentWallet = await Wallet.findOne({ where: { user_id: userId } });
      return {
        success: true,
        isDuplicate: true,
        balance: currentWallet ? currentWallet.balance : 0,
      };
    }

    return await sequelize.transaction(
      { isolationLevel: SequelizeTransaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        // Pessimistic Row Lock on the user's wallet
        const wallet = await Wallet.findOne({
          where: { user_id: userId },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (!wallet) {
          throw new Error('WALLET_NOT_FOUND');
        }

        if (wallet.balance < amount) {
          throw new Error('INSUFFICIENT_FUNDS');
        }

        const newBalance = Number((wallet.balance - amount).toFixed(4));
        wallet.balance = newBalance;
        await wallet.save({ transaction: t });

        await BetRound.create(
          {
            user_id: userId,
            game_id: gameId,
            provider_round_id: providerRoundId,
            provider_transaction_id: providerTxId,
            bet_amount: amount,
            win_amount: 0,
            status: 'pending',
            raw_payload: rawPayload,
          },
          { transaction: t }
        );

        return {
          success: true,
          balance: newBalance,
          isDuplicate: false,
        };
      }
    );
  }

  /**
   * Seamless Wallet: Atomic Win (Credit) with row lock
   */
  public static async executeWin(params: {
    userId: string;
    amount: number;
    providerRoundId: string;
    providerTxId: string;
    gameId?: string;
    rawPayload?: string;
  }) {
    const { userId, amount, providerRoundId, providerTxId, gameId, rawPayload } = params;

    return await sequelize.transaction(
      { isolationLevel: SequelizeTransaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        const wallet = await Wallet.findOne({
          where: { user_id: userId },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (!wallet) {
          throw new Error('WALLET_NOT_FOUND');
        }

        const newBalance = Number((wallet.balance + amount).toFixed(4));
        wallet.balance = newBalance;
        await wallet.save({ transaction: t });

        // Update or insert bet round
        const betRound = await BetRound.findOne({
          where: { provider_round_id: providerRoundId },
          transaction: t,
        });

        if (betRound) {
          betRound.win_amount = Number((betRound.win_amount + amount).toFixed(4));
          betRound.status = 'settled';
          await betRound.save({ transaction: t });
        } else {
          await BetRound.create(
            {
              user_id: userId,
              game_id: gameId,
              provider_round_id: providerRoundId,
              provider_transaction_id: providerTxId,
              bet_amount: 0,
              win_amount: amount,
              status: 'settled',
              raw_payload: rawPayload,
            },
            { transaction: t }
          );
        }

        return {
          success: true,
          balance: newBalance,
        };
      }
    );
  }

  /**
   * Seamless Wallet: Atomic Rollback / Refund
   */
  public static async executeRollback(params: {
    userId: string;
    providerRoundId: string;
    providerTxId: string;
  }) {
    const { userId, providerRoundId, providerTxId } = params;

    return await sequelize.transaction(async (t) => {
      const betRound = await BetRound.findOne({
        where: { provider_round_id: providerRoundId },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!betRound || betRound.status === 'refunded') {
        const currentWallet = await Wallet.findOne({ where: { user_id: userId }, transaction: t });
        return { success: true, balance: currentWallet ? currentWallet.balance : 0 };
      }

      const wallet = await Wallet.findOne({
        where: { user_id: userId },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!wallet) throw new Error('WALLET_NOT_FOUND');

      const refundAmount = betRound.bet_amount;
      wallet.balance = Number((wallet.balance + refundAmount).toFixed(4));
      await wallet.save({ transaction: t });

      betRound.status = 'refunded';
      await betRound.save({ transaction: t });

      return {
        success: true,
        refundedAmount: refundAmount,
        balance: wallet.balance,
      };
    });
  }

  /**
   * Deposit Workflow: Player creates pending manual deposit
   */
  public static async requestDeposit(params: {
    userId: string;
    amount: number;
    paymentMethod: string;
    transactionRef: string;
    proofImageUrl?: string;
  }) {
    return await Transaction.create({
      user_id: params.userId,
      type: 'deposit',
      amount: params.amount,
      status: 'pending',
      payment_method: params.paymentMethod,
      transaction_ref: params.transactionRef,
      proof_image_url: params.proofImageUrl,
    });
  }

  /**
   * Admin / Agent: Approve manual deposit
   */
  public static async approveDeposit(transactionId: string, adminId: string) {
    return await sequelize.transaction(async (t) => {
      const tx = await Transaction.findOne({
        where: { id: transactionId, status: 'pending', type: 'deposit' },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!tx) throw new Error('TRANSACTION_NOT_FOUND_OR_ALREADY_PROCESSED');

      const wallet = await Wallet.findOne({
        where: { user_id: tx.user_id },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!wallet) throw new Error('WALLET_NOT_FOUND');

      wallet.balance = Number((wallet.balance + tx.amount).toFixed(4));
      await wallet.save({ transaction: t });

      tx.status = 'approved';
      tx.reviewed_by = adminId;
      await tx.save({ transaction: t });

      return { success: true, newBalance: wallet.balance, transaction: tx };
    });
  }

  /**
   * Admin / Agent: Reject manual deposit
   */
  public static async rejectDeposit(transactionId: string, adminId: string, reason?: string) {
    const tx = await Transaction.findOne({
      where: { id: transactionId, status: 'pending', type: 'deposit' },
    });
    if (!tx) throw new Error('TRANSACTION_NOT_FOUND_OR_ALREADY_PROCESSED');

    tx.status = 'rejected';
    tx.reviewed_by = adminId;
    tx.notes = reason || 'Deposit rejected by admin';
    await tx.save();

    return { success: true, transaction: tx };
  }

  /**
   * Withdrawal Workflow: Player requests withdrawal (moves funds to locked_balance)
   */
  public static async requestWithdrawal(params: {
    userId: string;
    amount: number;
    paymentMethod: string;
    transactionRef?: string;
    notes?: string;
  }) {
    return await sequelize.transaction(async (t) => {
      const wallet = await Wallet.findOne({
        where: { user_id: params.userId },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!wallet) throw new Error('WALLET_NOT_FOUND');
      if (wallet.balance < params.amount) throw new Error('INSUFFICIENT_FUNDS');

      // Move from playable balance to locked_balance
      wallet.balance = Number((wallet.balance - params.amount).toFixed(4));
      wallet.locked_balance = Number((wallet.locked_balance + params.amount).toFixed(4));
      await wallet.save({ transaction: t });

      const tx = await Transaction.create(
        {
          user_id: params.userId,
          type: 'withdrawal',
          amount: params.amount,
          status: 'pending',
          payment_method: params.paymentMethod,
          transaction_ref: params.transactionRef,
          notes: params.notes,
        },
        { transaction: t }
      );

      return { success: true, transaction: tx, newBalance: wallet.balance };
    });
  }

  /**
   * Admin / Agent: Approve withdrawal (deducts from locked_balance)
   */
  public static async approveWithdrawal(transactionId: string, adminId: string) {
    return await sequelize.transaction(async (t) => {
      const tx = await Transaction.findOne({
        where: { id: transactionId, status: 'pending', type: 'withdrawal' },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!tx) throw new Error('TRANSACTION_NOT_FOUND_OR_ALREADY_PROCESSED');

      const wallet = await Wallet.findOne({
        where: { user_id: tx.user_id },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!wallet) throw new Error('WALLET_NOT_FOUND');

      wallet.locked_balance = Number(Math.max(0, wallet.locked_balance - tx.amount).toFixed(4));
      await wallet.save({ transaction: t });

      tx.status = 'approved';
      tx.reviewed_by = adminId;
      await tx.save({ transaction: t });

      return { success: true, transaction: tx };
    });
  }

  /**
   * Admin / Agent: Reject withdrawal (restores locked_balance back to playable balance)
   */
  public static async rejectWithdrawal(transactionId: string, adminId: string, reason?: string) {
    return await sequelize.transaction(async (t) => {
      const tx = await Transaction.findOne({
        where: { id: transactionId, status: 'pending', type: 'withdrawal' },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!tx) throw new Error('TRANSACTION_NOT_FOUND_OR_ALREADY_PROCESSED');

      const wallet = await Wallet.findOne({
        where: { user_id: tx.user_id },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (!wallet) throw new Error('WALLET_NOT_FOUND');

      wallet.locked_balance = Number(Math.max(0, wallet.locked_balance - tx.amount).toFixed(4));
      wallet.balance = Number((wallet.balance + tx.amount).toFixed(4));
      await wallet.save({ transaction: t });

      tx.status = 'rejected';
      tx.reviewed_by = adminId;
      tx.notes = reason || 'Withdrawal rejected, funds refunded to balance';
      await tx.save({ transaction: t });

      return { success: true, transaction: tx, refundedBalance: wallet.balance };
    });
  }
}

