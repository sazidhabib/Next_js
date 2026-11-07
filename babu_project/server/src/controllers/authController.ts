import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_casino_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthController {
  /**
   * Player Registration
   */
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, phone, currency = 'USD' } = req.body;

      if (!username || !email || !password) {
        res.status(400).json({ success: false, message: 'Username, email and password are required' });
        return;
      }

      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser) {
        res.status(409).json({ success: false, message: 'Email is already registered' });
        return;
      }

      const existingUsername = await User.findOne({
        where: { username },
      });
      if (existingUsername) {
        res.status(409).json({ success: false, message: 'Username is already taken' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        phone,
        password_hash,
        role: 'player',
        status: 'active',
        currency,
      });

      // Automatically create a wallet with zero balance
      const wallet = await Wallet.create({
        user_id: newUser.id,
        balance: 0.0,
        bonus_balance: 0.0,
        locked_balance: 0.0,
        currency,
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          currency: newUser.currency,
          wallet: {
            balance: wallet.balance,
            locked_balance: wallet.locked_balance,
          },
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  /**
   * Player Login
   */
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { emailOrUsername, password } = req.body;

      if (!emailOrUsername || !password) {
        res.status(400).json({ success: false, message: 'Email/Username and password are required' });
        return;
      }

      const user = await User.findOne({
        where: emailOrUsername.includes('@')
          ? { email: emailOrUsername }
          : { username: emailOrUsername },
        include: [{ model: Wallet, as: 'wallet' }],
      });

      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      if (user.status !== 'active') {
        res.status(403).json({ success: false, message: `Account is ${user.status}` });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const wallet = (user as any).wallet;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          currency: user.currency,
          wallet: wallet
            ? {
                balance: wallet.balance,
                locked_balance: wallet.locked_balance,
                currency: wallet.currency,
              }
            : null,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  /**
   * Admin 3-Factor Login (Email + Password + 6-digit Security PIN)
   */
  public static async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, securityPin } = req.body;

      if (!email || !password || !securityPin) {
        res.status(400).json({
          success: false,
          message: 'Email, password, and security PIN are all required',
        });
        return;
      }

      const adminUser = await User.findOne({
        where: { email },
      });

      if (!adminUser || (adminUser.role !== 'super_admin' && adminUser.role !== 'agent')) {
        res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        return;
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
      if (!isPasswordValid) {
        res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        return;
      }

      // Check 6-digit Security PIN
      if (!adminUser.security_pin_hash) {
        res.status(403).json({ success: false, message: 'Security PIN is not configured for this account' });
        return;
      }

      const isPinValid = await bcrypt.compare(securityPin, adminUser.security_pin_hash);
      if (!isPinValid) {
        res.status(403).json({ success: false, message: 'Incorrect 6-digit Security PIN' });
        return;
      }

      const token = jwt.sign(
        {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        success: true,
        message: 'Admin authentication successful',
        token,
        admin: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
}

