const { query } = require('../config/database');
const { DEFAULT_SETTINGS } = require('../utils/settings-defaults');

const getSettings = async (req, res) => {
    try {
        // Auto-sync missing settings
        for (const def of DEFAULT_SETTINGS) {
            await query(
                'INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES (?, ?, ?, ?)',
                [def.key, def.value, def.type, def.description]
            );
        }

        const settings = await query('SELECT * FROM site_settings ORDER BY setting_key ASC');
        
        return res.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('Settings GET Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
};

const getPublicSettings = async (req, res) => {
    try {
        const settings = await query('SELECT setting_key, setting_value FROM site_settings');
        
        const settingsMap = settings.reduce((acc, s) => {
            acc[s.setting_key] = s.setting_value;
            return acc;
        }, {});

        return res.json({
            success: true,
            data: settingsMap,
        });
    } catch (error) {
        console.error('Public Settings GET Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { settings } = req.body;

        if (!settings || !Array.isArray(settings)) {
            return res.status(400).json({ success: false, error: 'Settings array is required' });
        }

        for (const setting of settings) {
            if (setting.key && setting.value !== undefined) {
                await query(
                    'INSERT INTO site_settings (setting_key, setting_value, setting_type, description, updated_by) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, updated_by = ?',
                    [
                        setting.key, 
                        typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value), 
                        setting.type || 'string', 
                        setting.description || null, 
                        req.user.userId, 
                        typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value), 
                        req.user.userId
                    ]
                );
            }
        }

        return res.json({
            success: true,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        console.error('Settings PUT Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
};

module.exports = {
    getSettings,
    getPublicSettings,
    updateSettings
};
