import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { User, Wallet, Game, Transaction, BetRound } from '../models/index.js';
import { WalletService } from '../services/WalletService.js';
import { MockProvider } from '../adapters/mockProvider.js';

export class PlayerController {
  /**
   * Get Player Profile with current Wallet balances
   */
  public static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email', 'phone', 'role', 'status', 'currency', 'created_at'],
        include: [{ model: Wallet, as: 'wallet' }],
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * List Games by Category (slots, live_casino, table, crash)
   */
  public static async getGames(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { category, search } = req.query;
      const whereClause: any = { is_active: true };

      if (category && category !== 'all') {
        whereClause.category = category;
      }

      const games = await Game.findAll({
        where: whereClause,
        order: [['name', 'ASC']],
      });

      res.status(200).json({ success: true, games });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Launch Game (Generate iFrame Session URL)
   */
  public static async launchGame(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const gameId = Array.isArray(req.params.gameId) ? req.params.gameId[0] : req.params.gameId;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const launchUrl = await MockProvider.createGameSession(userId, gameId);
      res.status(200).json({ success: true, launchUrl });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Request Manual Deposit
   */
  public static async submitDeposit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, paymentMethod, transactionRef, proofImageUrl } = req.body;

      if (!userId || !amount || !paymentMethod || !transactionRef) {
        res.status(400).json({
          success: false,
          message: 'Amount, payment method, and transaction reference are required',
        });
        return;
      }

      const tx = await WalletService.requestDeposit({
        userId,
        amount: Number(amount),
        paymentMethod,
        transactionRef,
        proofImageUrl,
      });

      res.status(201).json({
        success: true,
        message: 'Deposit request submitted successfully. Awaiting cashier verification.',
        transaction: tx,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Request Withdrawal
   */
  public static async submitWithdrawal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, paymentMethod, transactionRef, notes } = req.body;

      if (!userId || !amount || !paymentMethod) {
        res.status(400).json({
          success: false,
          message: 'Amount and payment method are required',
        });
        return;
      }

      const result = await WalletService.requestWithdrawal({
        userId,
        amount: Number(amount),
        paymentMethod,
        transactionRef,
        notes,
      });

      res.status(201).json({
        message: 'Withdrawal request submitted. Funds are placed in hold while processing.',
        ...result,
      });
    } catch (error: any) {
      if (error.message === 'INSUFFICIENT_FUNDS') {
        res.status(400).json({ success: false, message: 'Insufficient playable balance' });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }

  /**
   * Get Player Financial Transactions
   */
  public static async getTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const transactions = await Transaction.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        limit: 50,
      });

      res.status(200).json({ success: true, transactions });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Get Player Bet History
   */
  public static async getBetHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const bets = await BetRound.findAll({
        where: { user_id: userId },
        include: [{ model: Game, as: 'game', attributes: ['name', 'provider', 'thumbnail_url'] }],
        order: [['created_at', 'DESC']],
        limit: 50,
      });

      res.status(200).json({ success: true, bets });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
