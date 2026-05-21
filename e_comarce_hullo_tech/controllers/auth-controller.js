const { User } = require('../models');
const jwt = require('../utils/jwt');

const generateToken = (id) => {
  return jwt.sign({ id });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    if (!User) {
      // Fallback auth: if database not initialized, allow default admin credentials
      if (email === 'admin@hullotech.com' && password === 'admin123') {
        return res.json({
          success: true,
          data: {
            id: 1,
            email: 'admin@hullotech.com',
            role: 'admin',
            token: generateToken(1),
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials (database fallback mode)' });
    }

    let user;
    try {
      user = await User.findOne({ where: { email } });
    } catch (dbError) {
      console.warn('⚠️ Database connection failed during login, falling back to mock mode:', dbError.message);
      if (email === 'admin@hullotech.com' && password === 'admin123') {
        return res.json({
          success: true,
          data: {
            id: 1,
            email: 'admin@hullotech.com',
            role: 'admin',
            token: generateToken(1),
          }
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials (database fallback mode)' });
    }

    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          token: generateToken(user.id),
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    if (!User) {
      if (req.user && req.user.id === 1) {
        return res.json({
          success: true,
          data: {
            id: 1,
            email: 'admin@hullotech.com',
            role: 'admin'
          }
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let user;
    try {
      user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
    } catch (dbError) {
      console.warn('⚠️ Database connection failed during profile fetch, falling back to mock mode:', dbError.message);
      if (req.user && req.user.id === 1) {
        return res.json({
          success: true,
          data: {
            id: 1,
            email: 'admin@hullotech.com',
            role: 'admin'
          }
        });
      }
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user) {
      return res.json({ success: true, data: user });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginUser,
  getProfile
};
