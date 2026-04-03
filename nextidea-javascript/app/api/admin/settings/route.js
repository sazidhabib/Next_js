import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { authMiddleware, handleApiError } from '@/app/lib/middleware';

export async function GET(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const settings = await query('SELECT * FROM site_settings ORDER BY setting_key ASC');

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return handleApiError(error, 'Settings GET');
  }
}

export async function PUT(request) {
  try {
    const auth = await authMiddleware(request, 'admin');
    if (!auth.success) return auth;

    const body = await request.json();
    const { settings } = body;

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { success: false, error: 'Settings array is required' },
        { status: 400 }
      );
    }

    for (const setting of settings) {
      if (setting.key && setting.value !== undefined) {
        await query(
          'INSERT INTO site_settings (setting_key, setting_value, setting_type, description, updated_by) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?',
          [setting.key, setting.value, setting.type || 'string', setting.description || null, auth.user.id, setting.value, auth.user.id]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    return handleApiError(error, 'Settings PUT');
  }
}
