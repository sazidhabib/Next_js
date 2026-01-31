const pool = require('../config/db');

// Get settings (only one row exists)
exports.getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ph_settings WHERE id = 1');
        if (rows.length === 0) return res.status(404).json({ message: 'Settings not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    // Map frontend fields (site_title, support_email) to DB columns (site_name, contact_email)
    const { site_title, support_email, helpline_number, footer_text, site_description, facebook_url, youtube_url, website_url, address_text } = req.body;

    // DB columns: site_name, contact_email, helpline_number, footer_text, logo_url, favicon_url

    try {
        console.log('=== Settings Update Debug ===');
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        console.log('===========================');

        // Fetch current settings to keep existing images if not updated
        const [currentRows] = await pool.query('SELECT * FROM ph_settings WHERE id = 1');
        const current = currentRows[0];

        let logo_url = current.logo_url;
        let favicon_url = current.favicon_url;

        const serverUrl = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;

        if (req.files) {
            if (req.files.logo) {
                logo_url = `${serverUrl}/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.favicon) {
                favicon_url = `${serverUrl}/uploads/${req.files.favicon[0].filename}`;
            }
        }

        const [result] = await pool.query(
            'UPDATE ph_settings SET site_name = ?, support_email = ?, helpline_number = ?, footer_text = ?, logo_url = ?, favicon_url = ?, site_description = ?, facebook_url = ?, youtube_url = ?, website_url = ?, address_text = ? WHERE id = 1',
            [
                site_title || current.site_name,
                support_email || current.support_email,
                helpline_number || current.helpline_number,
                footer_text || current.footer_text,
                logo_url,
                favicon_url,
                site_description || current.site_description,
                facebook_url || current.facebook_url,
                youtube_url || current.youtube_url,
                website_url || current.website_url,
                address_text || current.address_text
            ]
        );

        // Return updated settings
        res.status(200).json({
            message: 'Settings updated successfully',
            settings: {
                site_name: site_title || current.site_name,
                support_email: support_email || current.support_email,
                helpline_number: helpline_number || current.helpline_number,
                footer_text: footer_text || current.footer_text,
                logo_url,
                favicon_url,
                site_description: site_description || current.site_description,
                facebook_url: facebook_url || current.facebook_url,
                youtube_url: youtube_url || current.youtube_url,
                website_url: website_url || current.website_url,
                address_text: address_text || current.address_text
            }
        });
    } catch (error) {
        console.error('Settings update error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message, error: error.toString() });
    }
};
