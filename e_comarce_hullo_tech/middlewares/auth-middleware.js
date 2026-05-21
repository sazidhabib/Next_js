const jwt = require('../utils/jwt');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token);

      if (!decoded) {
        throw new Error('Verification failed');
      }

      if (!User) {
        if (decoded.id === 1) {
          req.user = {
            id: 1,
            email: 'admin@hullotech.com',
            role: 'admin'
          };
          return next();
        }
        return res.status(401).json({ success: false, message: 'Database not initialized and invalid session' });
      }

      try {
        req.user = await User.findByPk(decoded.id, {
          attributes: { exclude: ['password'] }
        });
      } catch (dbError) {
        console.warn('⚠️ Database connection failed during auth check, falling back to mock mode:', dbError.message);
        if (decoded.id === 1) {
          req.user = {
            id: 1,
            email: 'admin@hullotech.com',
            role: 'admin'
          };
        } else {
          return res.status(401).json({ success: false, message: 'Database query failed and user not recognized' });
        }
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};

// Middleware to check admin auth for Next.js pages
const checkAdminAuth = (req) => {
  // Extract token from request headers
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

module.exports = { protect, admin, checkAdminAuth };
