import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { PlayerController } from '../controllers/playerController.js';
import { AdminController } from '../controllers/adminController.js';
import { CallbackController } from '../controllers/callbackController.js';
import { MockProvider } from '../adapters/mockProvider.js';
import { authenticateJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

// --- Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/admin/login', AuthController.adminLogin);

// --- Player Protected Routes ---
router.get('/player/profile', authenticateJWT, PlayerController.getProfile);
router.get('/player/games', PlayerController.getGames); // Public game listing
router.get('/player/games/:gameId/launch', authenticateJWT, PlayerController.launchGame);
router.post('/player/wallet/deposit', authenticateJWT, PlayerController.submitDeposit);
router.post('/player/wallet/withdraw', authenticateJWT, PlayerController.submitWithdrawal);
router.get('/player/wallet/transactions', authenticateJWT, PlayerController.getTransactions);
router.get('/player/wallet/bets', authenticateJWT, PlayerController.getBetHistory);

// --- Admin Protected Routes (requires super_admin or agent) ---
router.get('/admin/stats', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.getStats);
router.get('/admin/deposits/pending', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.getPendingDeposits);
router.get('/admin/withdrawals/pending', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.getPendingWithdrawals);
router.post('/admin/deposits/:id/approve', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.approveDeposit);
router.post('/admin/deposits/:id/reject', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.rejectDeposit);
router.post('/admin/withdrawals/:id/approve', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.approveWithdrawal);
router.post('/admin/withdrawals/:id/reject', authenticateJWT, requireRole('super_admin', 'agent'), AdminController.rejectWithdrawal);
router.get('/admin/users', authenticateJWT, requireRole('super_admin'), AdminController.getUsers);
router.post('/admin/users/balance-adjust', authenticateJWT, requireRole('super_admin'), AdminController.adjustBalance);

// --- Universal Seamless Wallet Callbacks ---
router.post('/callback/seamless/balance', CallbackController.getBalance);
router.post('/callback/seamless/bet', CallbackController.bet);
router.post('/callback/seamless/win', CallbackController.win);
router.post('/callback/seamless/rollback', CallbackController.rollback);

// --- Mock Provider Launcher Screen ---
router.get('/provider/mock/launcher', MockProvider.renderGameClient);

export default router;

