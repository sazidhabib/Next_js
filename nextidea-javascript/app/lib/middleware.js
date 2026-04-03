import { NextResponse } from 'next/server';
import { verifyAccessToken } from './auth';
import { query } from './db';

const rateLimitMap = new Map();

const RATE_LIMIT_CONFIG = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  loginMax: parseInt(process.env.RATE_LIMIT_LOGIN_MAX, 10) || 5,
  registerMax: parseInt(process.env.RATE_LIMIT_REGISTER_MAX, 10) || 3,
  contactMax: parseInt(process.env.RATE_LIMIT_CONTACT_MAX, 10) || 3,
};

export function rateLimit(key, maxRequests, windowMs) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(key) || { count: 0, startTime: now };

  if (now - userRequests.startTime > windowMs) {
    userRequests.count = 0;
    userRequests.startTime = now;
  }

  userRequests.count += 1;
  rateLimitMap.set(key, userRequests);

  if (userRequests.count > maxRequests) {
    return false;
  }

  return true;
}

export function cleanupRateLimit() {
  const now = Date.now();
  const windowMs = RATE_LIMIT_CONFIG.windowMs;
  
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.startTime > windowMs) {
      rateLimitMap.delete(key);
    }
  }
}

setInterval(cleanupRateLimit, 60000);

export async function authMiddleware(request, requiredRole = null) {
  try {
    const token = request.cookies.get('access_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await query(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user || user.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    if (!user[0].is_active) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    if (requiredRole && user[0].role !== requiredRole) {
      const roleHierarchy = { viewer: 1, editor: 2, admin: 3 };
      if (roleHierarchy[user[0].role] < roleHierarchy[requiredRole]) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
    }

    return { success: true, user: user[0] };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function addSecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
}

export function handleApiError(error, context = 'API') {
  console.error(`${context} Error:`, error);
  
  if (error.code === 'ER_DUP_ENTRY') {
    return NextResponse.json(
      { success: false, error: 'A record with this value already exists' },
      { status: 409 }
    );
  }
  
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return NextResponse.json(
      { success: false, error: 'Referenced record does not exist' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
