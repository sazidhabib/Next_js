import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import { DEFAULT_SETTINGS } from '@/app/lib/settings-defaults';

export async function GET() {
  try {
    // Auto-sync missing settings
    for (const def of DEFAULT_SETTINGS) {
        await query(
            'INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES (?, ?, ?, ?)',
            [def.key, def.value, def.type, def.description]
        );
    }

    const settings = await query('SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key ASC');
    
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.setting_key] = s.setting_value;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: settingsMap,
    });
  } catch (error) {
    console.error('Settings public API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}
