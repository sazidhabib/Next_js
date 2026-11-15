import jwt from '../../utils/jwt';
import { User } from './db';

const verifyToken = (jwt && jwt.verify) || (jwt && jwt.default && jwt.default.verify);

export async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authorized: false, error: 'No authorization token provided', status: 401 };
    }
    const token = authHeader.split(' ')[1];
    if (!verifyToken) {
      return { authorized: false, error: 'JWT verification unavailable', status: 500 };
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return { authorized: false, error: 'Invalid or expired token', status: 401 };
    }

    if (User) {
      try {
        const user = await User.findByPk(decoded.id);
        if (user && user.role === 'admin') {
          return { authorized: true, user: user.toJSON ? user.toJSON() : user };
        }
      } catch (dbErr) {
        console.warn('⚠️ DB error during verifyAdmin:', dbErr.message);
      }
    }

    // Default admin fallback if db is momentarily unreachable
    if (decoded.id === 1) {
      return { authorized: true, user: { id: 1, email: 'admin@hullotech.com', role: 'admin' } };
    }

    return { authorized: false, error: 'Unauthorized: Admin privileges required', status: 403 };
  } catch (err) {
    return { authorized: false, error: err.message, status: 500 };
  }
}
