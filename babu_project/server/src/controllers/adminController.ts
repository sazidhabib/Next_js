import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth.js';
import { User, Wallet, Transaction, BetRound, Game } from '../models/index.js';
import { WalletService } from '../services/WalletService.js';
import { sequelize } from '../config/database.js';

// In-memory / initial state stores for admin CMS features
let paymentGateways = [
  { id: '1', name: 'bKash Agent / Personal', type: 'mobile_banking', mode: 'live', is_active: true, fee: '0%', min: 100, max: 25000, account_number: '+880 1711-888888' },
  { id: '2', name: 'Nagad Agent', type: 'mobile_banking', mode: 'live', is_active: true, fee: '0%', min: 100, max: 25000, account_number: '+880 1911-888888' },
  { id: '3', name: 'Rocket Agent', type: 'mobile_banking', mode: 'live', is_active: true, fee: '0%', min: 100, max: 25000, account_number: '+880 1511-888888' },
  { id: '4', name: 'USDT (TRC-20)', type: 'crypto', mode: 'live', is_active: true, fee: '1 USDT', min: 10, max: 10000, account_number: 'TLuXBetLuxaOfficialVault8888888' },
  { id: '5', name: 'Local Bank Transfer (City/Islami Bank)', type: 'bank', mode: 'live', is_active: true, fee: '0%', min: 500, max: 50000, account_number: '2050218888888001' },
];

let announcements = [
  { id: '1', title: 'Welcome to Betluxa Casino', content: '🎉 Enjoy a 200% Welcome Bonus on your first deposit! 24/7 instant cashouts available.', is_marquee: true, is_active: true, created_at: new Date() },
  { id: '2', title: 'Pragmatic Drops & Wins Live', content: 'Play Gates of Olympus & Sweet Bonanza for daily mystery cash drops!', is_marquee: false, is_active: true, created_at: new Date() },
];

let systemSettings = {
  site_name: 'Betluxa',
  currency_symbol: '৳',
  currency_code: 'BDT',
  min_deposit: 100,
  min_withdrawal: 500,
  max_withdrawal_daily: 100000,
  referral_l1_percent: 5,
  referral_l2_percent: 2,
  maintenance_mode: false,
  marquee_speed: 'normal',
  support_whatsapp: '+880 1711-888888',
  support_telegram: '@betluxa_support',
};

let lotteries = [
  { id: '1', title: 'Mega Jackpot Weekly Draw #104', ticket_price: 50, jackpot_pool: 250000, draw_date: new Date(Date.now() + 86400000 * 3), status: 'open', total_tickets: 1420 },
  { id: '2', title: 'Daily Golden Rush Draw #312', ticket_price: 10, jackpot_pool: 35000, draw_date: new Date(Date.now() + 3600000 * 8), status: 'open', total_tickets: 680 },
];

let rewardsStore = [
  { id: '1', title: '৳ 500 Free Casino Chips', points_cost: 500, category: 'bonus', is_active: true },
  { id: '2', title: '50 Free Spins (Gates of Olympus)', points_cost: 300, category: 'spins', is_active: true },
  { id: '3', title: 'Betluxa VIP Gold Card + Hoodie', points_cost: 5000, category: 'merchandise', is_active: true },
];

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
          vaultBalance: 4892150.00,
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
        where: { type: 'deposit' },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'phone'] }],
        order: [['created_at', 'DESC']],
        limit: 100,
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
        where: { type: 'withdrawal' },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'phone'] }],
        order: [['created_at', 'DESC']],
        limit: 100,
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
   * Toggle user status (active/suspended)
   */
  public static async toggleUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await User.findByPk(id);
      if (!user) throw new Error('User not found');

      user.status = user.status === 'active' ? 'suspended' : 'active';
      await user.save();

      res.status(200).json({ success: true, status: user.status });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Manual Balance Adjustment
   */
  public static async adjustBalance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const { userId, amount, action, reason } = req.body;

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

  /**
   * Live Bets Monitor
   */
  public static async getLiveBets(req: AuthRequest, res: Response): Promise<void> {
    try {
      const bets = await BetRound.findAll({
        include: [
          { model: User, as: 'user', attributes: ['username', 'email'] },
          { model: Game, as: 'game', attributes: ['name', 'provider'] },
        ],
        order: [['created_at', 'DESC']],
        limit: 50,
      });
      res.status(200).json({ success: true, bets });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * Payment Gateways List & Toggle
   */
  public static async getGateways(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json({ success: true, gateways: paymentGateways });
  }

  public static async toggleGateway(req: AuthRequest, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const gateway = paymentGateways.find((g) => g.id === id);
    if (!gateway) {
      res.status(404).json({ success: false, message: 'Gateway not found' });
      return;
    }
    gateway.is_active = !gateway.is_active;
    res.status(200).json({ success: true, gateway });
  }

  /**
   * Announcements List & Create
   */
  public static async getAnnouncements(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json({ success: true, announcements });
  }

  public static async createAnnouncement(req: AuthRequest, res: Response): Promise<void> {
    const { title, content, is_marquee } = req.body;
    const item = {
      id: String(Date.now()),
      title: title || 'Notice',
      content: content || '',
      is_marquee: Boolean(is_marquee),
      is_active: true,
      created_at: new Date(),
    };
    announcements.unshift(item);
    res.status(201).json({ success: true, announcement: item });
  }

  /**
   * System Settings Get & Update
   */
  public static async getSettings(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json({ success: true, settings: systemSettings });
  }

  public static async updateSettings(req: AuthRequest, res: Response): Promise<void> {
    systemSettings = { ...systemSettings, ...req.body };
    res.status(200).json({ success: true, settings: systemSettings });
  }

  /**
   * Lotteries & Draws
   */
  public static async getLotteries(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json({ success: true, lotteries });
  }

  public static async drawLottery(req: AuthRequest, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const lotto = lotteries.find((l) => l.id === id);
    if (!lotto) {
      res.status(404).json({ success: false, message: 'Lottery not found' });
      return;
    }
    const winningTicket = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;
    lotto.status = 'drawn';
    res.status(200).json({ success: true, winningTicket, jackpot: lotto.jackpot_pool });
  }

  /**
   * Rewards Store Items
   */
  public static async getRewards(req: AuthRequest, res: Response): Promise<void> {
    res.status(200).json({ success: true, rewards: rewardsStore });
  }

  /**
   * Admin Profile Security Update (Password & PIN)
   */
  public static async updateAdminProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const adminId = req.user?.id!;
      const { newPassword, newPin } = req.body;
      const admin = await User.findByPk(adminId);
      if (!admin) throw new Error('Admin not found');

      if (newPassword) {
        admin.password_hash = await bcrypt.hash(newPassword, 10);
      }
      if (newPin) {
        admin.security_pin_hash = await bcrypt.hash(newPin, 10);
      }
      await admin.save();

      res.status(200).json({ success: true, message: 'Profile security updated successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  /**
   * Games Catalog & Provider toggles
   */
  public static async getGamesList(req: AuthRequest, res: Response): Promise<void> {
    try {
      const games = await Game.findAll({ order: [['created_at', 'DESC']] });
      res.status(200).json({ success: true, games });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async toggleGameStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const game = await Game.findByPk(id);
      if (!game) throw new Error('Game not found');
      game.is_active = !game.is_active;
      await game.save();
      res.status(200).json({ success: true, is_active: game.is_active });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
