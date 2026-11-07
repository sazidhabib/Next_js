import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { WalletService } from '../services/WalletService.js';

const SEAMLESS_SECRET_KEY = process.env.SEAMLESS_SECRET_KEY || 'seamless_secret_mock_key_2026';

export class CallbackController {
  private static parseToken(token: string): { userId: string; gameId: string } {
    return jwt.verify(token, SEAMLESS_SECRET_KEY) as { userId: string; gameId: string };
  }

  /**
   * Check Balance Callback
   */
  public static async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) {
        res.status(400).json({ status: 'ERROR_INVALID_TOKEN', message: 'Token required' });
        return;
      }

      const decoded = CallbackController.parseToken(token);
      const wallet = await WalletService.getBalance(decoded.userId);

      res.status(200).json({
        status: 'OK',
        balance: wallet.balance,
        currency: wallet.currency,
      });
    } catch (error: any) {
      console.error('Seamless Balance Callback error:', error);
      res.status(400).json({ status: 'ERROR_AUTH_FAILED', message: error.message });
    }
  }

  /**
   * Bet (Debit) Callback
   */
  public static async bet(req: Request, res: Response): Promise<void> {
    try {
      const { token, roundId, transactionId, amount } = req.body;

      if (!token || !roundId || !transactionId || amount === undefined) {
        res.status(400).json({ status: 'ERROR_INVALID_PARAMS', message: 'Missing parameters' });
        return;
      }

      const decoded = CallbackController.parseToken(token);
      const result = await WalletService.executeBet({
        userId: decoded.userId,
        amount: Number(amount),
        providerRoundId: roundId,
        providerTxId: transactionId,
        gameId: decoded.gameId,
        rawPayload: JSON.stringify(req.body),
      });

      res.status(200).json({
        status: 'OK',
        balance: result.balance,
        isDuplicate: result.isDuplicate,
      });
    } catch (error: any) {
      console.error('Seamless Bet Callback error:', error);
      if (error.message === 'INSUFFICIENT_FUNDS') {
        res.status(400).json({ status: 'ERROR_INSUFFICIENT_FUNDS', message: 'Insufficient player balance' });
      } else {
        res.status(500).json({ status: 'ERROR_SYSTEM', message: error.message });
      }
    }
  }

  /**
   * Win (Credit) Callback
   */
  public static async win(req: Request, res: Response): Promise<void> {
    try {
      const { token, roundId, transactionId, amount } = req.body;

      if (!token || !roundId || !transactionId || amount === undefined) {
        res.status(400).json({ status: 'ERROR_INVALID_PARAMS', message: 'Missing parameters' });
        return;
      }

      const decoded = CallbackController.parseToken(token);
      const result = await WalletService.executeWin({
        userId: decoded.userId,
        amount: Number(amount),
        providerRoundId: roundId,
        providerTxId: transactionId,
        gameId: decoded.gameId,
        rawPayload: JSON.stringify(req.body),
      });

      res.status(200).json({
        status: 'OK',
        balance: result.balance,
      });
    } catch (error: any) {
      console.error('Seamless Win Callback error:', error);
      res.status(500).json({ status: 'ERROR_SYSTEM', message: error.message });
    }
  }

  /**
   * Rollback / Refund Callback
   */
  public static async rollback(req: Request, res: Response): Promise<void> {
    try {
      const { token, roundId, transactionId } = req.body;

      if (!token || !roundId || !transactionId) {
        res.status(400).json({ status: 'ERROR_INVALID_PARAMS', message: 'Missing parameters' });
        return;
      }

      const decoded = CallbackController.parseToken(token);
      const result = await WalletService.executeRollback({
        userId: decoded.userId,
        providerRoundId: roundId,
        providerTxId: transactionId,
      });

      res.status(200).json({
        status: 'OK',
        balance: result.balance,
      });
    } catch (error: any) {
      console.error('Seamless Rollback error:', error);
      res.status(500).json({ status: 'ERROR_SYSTEM', message: error.message });
    }
  }
}

