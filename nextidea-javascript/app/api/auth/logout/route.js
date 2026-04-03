import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { clearAuthCookies, getAccessToken, verifyAccessToken } from '@/app/lib/auth';

export async function POST(request) {
  try {
    const token = await getAccessToken();
    
    if (token) {
      const decoded = verifyAccessToken(token);
      
      if (decoded) {
        await query(
          'UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ? AND is_revoked = FALSE',
          [decoded.userId]
        );
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    await clearAuthCookies();

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
