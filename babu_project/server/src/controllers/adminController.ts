import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { User, Wallet, Transaction, BetRound } from '../models/index.js';
import { WalletService } from '../services/WalletService.js';
import { sequelize } from '../config/database.js';

export class AdminController {
  /**
   * Get Platform Overview Stats
   */
  public static async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const totalUsers = await User.count({ where: { role: 'player' } });
      const pendingDeposits = await Transaction.count({ where: { type: 'deposit', status: 'pending' } });
      const pendingWithdrawals = await Transaction.count({ where: { type: 'withdrawal', status: 'pending' } });

      const depositSum: any = await Transaction.sum('amount', {
        where: { type: 'deposit', status: 'approved' },
      });
      const withdrawalSum: any = await Transaction.sum('amount', {
        where: { type: 'withdrawal', status: 'approved' },
      });

      const totalBets: any = await BetRound.sum('bet_amount');
      const totalWins: any = await BetRound.sum('win_amount');
      const grossGamingRevenue = (totalBets || 0) - (totalWins || 0);

      res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          pendingDeposits,
          pendingWithdrawals,
          totalApprovedDeposits: depositSum || 0,
          totalApprovedWithdrawals: withdrawalSum || 0,
          totalBetsPlaced: totalBets || 0,
          totalWinsPaid: totalWins || 0,
          grossGamingRevenue,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get All Pending Deposits
   */
  public static async getPendingDeposits(req: AuthRequest, res: Response): Promise<void> {
    try {
      const deposits = await Transaction.findAll({
        where: { type: 'deposit', status: 'pending' },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'phone'] }],
        order: [['created_at', 'ASC']],
      });
      res.status(200).json({ success: true, deposits });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get All Pending Withdrawals
   */
  public static async getPendingWithdrawals(req: AuthRequest, res: Response): Promise<void> {
    try {
      const withdrawals = await Transaction.findAll({
        where: { type: 'withdrawal', status: 'pending' },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'phone'] }],
        order: [['created_at', 'ASC']],
      });
      res.status(200).json({ success: true, withdrawals });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Approve a Deposit
   */
  public static async approveDeposit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const result = await WalletService.approveDeposit(id, adminId);
      res.status(200).json({ message: 'Deposit approved and balance credited', ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Reject a Deposit
   */
  public static async rejectDeposit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason } = req.body;

      const result = await WalletService.rejectDeposit(id, adminId, reason);
      res.status(200).json({ message: 'Deposit rejected', ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Approve a Withdrawal
   */
  public static async approveWithdrawal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const result = await WalletService.approveWithdrawal(id, adminId);
      res.status(200).json({ message: 'Withdrawal marked as approved', ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Reject a Withdrawal
   */
  public static async rejectWithdrawal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason } = req.body;

      const result = await WalletService.rejectWithdrawal(id, adminId, reason);
      res.status(200).json({ message: 'Withdrawal rejected and funds refunded', ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Get All Users list
   */
  public static async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'phone', 'role', 'status', 'currency', 'created_at'],
        include: [{ model: Wallet, as: 'wallet' }],
        order: [['created_at', 'DESC']],
      });
      res.status(200).json({ success: true, users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Manual Balance Adjustment
   */
  public static async adjustBalance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const { userId, amount, action, reason } = req.body; // action: 'credit' | 'debit'

      if (!userId || !amount || !action) {
        res.status(400).json({ success: false, message: 'User ID, amount, and action are required' });
        return;
      }

      const numericAmount = Math.abs(Number(amount));

      const result = await sequelize.transaction(async (t) => {
        const wallet = await Wallet.findOne({ where: { user_id: userId }, lock: t.LOCK.UPDATE, transaction: t });
        if (!wallet) throw new Error('Wallet not found');

        if (action === 'debit') {
          if (wallet.balance < numericAmount) throw new Error('Insufficient wallet balance to debit');
          wallet.balance = Number((wallet.balance - numericAmount).toFixed(4));
        } else {
          wallet.balance = Number((wallet.balance + numericAmount).toFixed(4));
        }

        await wallet.save({ transaction: t });

        await Transaction.create(
          {
            user_id: userId,
            type: 'manual_adjustment',
            amount: numericAmount,
            status: 'approved',
            payment_method: 'Manual Admin Adjustment',
            reviewed_by: adminId,
            notes: `${action.toUpperCase()}: ${reason || 'Admin balance adjustment'}`,
          },
          { transaction: t }
        );

        return { newBalance: wallet.balance };
      });

      res.status(200).json({ success: true, message: `Balance adjusted (${action})`, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
