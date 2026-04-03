import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';
const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'nextidea_session';

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured. Check your .env.local file.');
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    return null;
  }
}

export async function setAuthCookies(accessToken, refreshToken) {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.SESSION_SECURE === 'true',
    sameSite: 'strict',
    maxAge: 15 * 60,
    path: '/',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.SESSION_SECURE === 'true',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', '', {
    httpOnly: true,
    secure: process.env.SESSION_SECURE === 'true',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  cookieStore.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.SESSION_SECURE === 'true',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value;
}

export async function getCurrentUser() {
  const token = await getAccessToken();
  if (!token) return null;
  
  const decoded = verifyAccessToken(token);
  if (!decoded) return null;
  
  return decoded;
}

export function generatePasswordResetToken() {
  return jwt.sign(
    { type: 'password_reset' },
    ACCESS_SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyPasswordResetToken(token) {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    return decoded.type === 'password_reset' ? decoded : null;
  } catch {
    return null;
  }
}
