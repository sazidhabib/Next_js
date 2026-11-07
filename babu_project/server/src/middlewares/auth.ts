import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_casino_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as {
      id: string;
      username: string;
      email: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Access denied: insufficient permissions' });
      return;
    }

    next();
  };
};

