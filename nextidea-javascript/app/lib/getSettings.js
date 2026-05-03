import { query } from './db';
import { DEFAULT_SETTINGS } from './settings-defaults';

export async function getSettings() {
  try {
    const settings = await query('SELECT setting_key, setting_value FROM site_settings');
    const settingsMap = settings.reduce((acc, s) => {
      acc[s.setting_key] = s.setting_value;
      return acc;
    }, {});
    
    // Add defaults for missing ones
    for (const def of DEFAULT_SETTINGS) {
      if (!settingsMap[def.key]) {
        settingsMap[def.key] = def.value;
      }
    }
    
    return settingsMap;
  } catch (error) {
    console.error('Error fetching settings in server component:', error);
    
    // Fallback to defaults
    const fallback = {};
    for (const def of DEFAULT_SETTINGS) {
      fallback[def.key] = def.value;
    }
    return fallback;
  }
}
