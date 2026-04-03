import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, setAuthCookies } from '@/app/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const refreshTokenValue = request.cookies.get('refresh_token')?.value;
    
    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: 'Refresh token required' },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshTokenValue);
    
    if (!decoded || decoded.type !== 'refresh') {
      return NextResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const tokens = await query(
      'SELECT id, token_hash, user_id FROM refresh_tokens WHERE user_id = ? AND is_revoked = FALSE AND expires_at > NOW()',
      [decoded.userId]
    );

    if (tokens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Refresh token not found or expired' },
        { status: 401 }
      );
    }

    const isValidToken = await bcrypt.compare(refreshTokenValue, tokens[0].token_hash);
    
    if (!isValidToken) {
      await query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ?', [decoded.userId]);
      return NextResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    await query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE id = ?', [tokens[0].id]);

    const users = await query(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || !users[0].is_active) {
      return NextResponse.json(
        { success: false, error: 'User not found or inactive' },
        { status: 401 }
      );
    }

    const user = users[0];
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const tokenHash = await bcrypt.hash(newRefreshToken, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });

    await setAuthCookies(newAccessToken, newRefreshToken);

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
