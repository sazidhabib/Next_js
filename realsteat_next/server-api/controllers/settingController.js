const pool = require('../config/db');

// Get settings (only one row exists)
exports.getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.*, f.title as hero_frame_title, f.image_url as hero_frame_image_url 
            FROM re_settings s
            LEFT JOIN re_projects f ON s.hero_frame_id = f.id
            WHERE s.id = 1
        `);
        if (rows.length === 0) return res.status(404).json({ message: 'Settings not found' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    // Map frontend fields (site_title, support_email) to DB columns (site_name, contact_email)
    const {
        site_title, support_email, helpline_number, footer_text, site_description,
        facebook_url, youtube_url, website_url, address_text, hero_frame_id,
        hero_title, hero_description, instagram_url, x_url,
        hotline_number, secondary_email, business_hours, existing_hero_images
    } = req.body;

    // DB columns: site_name, contact_email, helpline_number, footer_text, logo_url, favicon_url

    try {
        console.log('=== Settings Update Debug ===');
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        console.log('===========================');

        // Fetch current settings to keep existing images if not updated
        const [currentRows] = await pool.query('SELECT * FROM re_settings WHERE id = 1');
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
            if (req.files.hero_images) {
                const newImages = req.files.hero_images.map(file => `${serverUrl}/uploads/${file.filename}`);
                let baseImages = [];
                if (existing_hero_images) {
                    try {
                        baseImages = JSON.parse(existing_hero_images);
                    } catch (e) {
                        baseImages = [];
                    }
                } else if (current.hero_images) {
                    try {
                        baseImages = JSON.parse(current.hero_images);
                    } catch (e) {
                        baseImages = [];
                    }
                }
                hero_images = JSON.stringify([...baseImages, ...newImages]);
            }
        } else if (existing_hero_images) {
            hero_images = existing_hero_images;
        }

        const [result] = await pool.query(
            `UPDATE re_settings SET 
                site_name = ?, support_email = ?, helpline_number = ?, footer_text = ?, 
                logo_url = ?, favicon_url = ?, site_description = ?, facebook_url = ?, 
                youtube_url = ?, website_url = ?, address_text = ?, hero_frame_id = ?,
                hero_title = ?, hero_description = ?, instagram_url = ?, x_url = ?,
                hotline_number = ?, secondary_email = ?, business_hours = ?, hero_images = ?
            WHERE id = 1`,
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
                address_text || current.address_text,
                hero_frame_id !== undefined ? hero_frame_id : current.hero_frame_id,
                hero_title !== undefined ? hero_title : current.hero_title,
                hero_description !== undefined ? hero_description : current.hero_description,
                instagram_url !== undefined ? instagram_url : current.instagram_url,
                x_url !== undefined ? x_url : current.x_url,
                hotline_number !== undefined ? hotline_number : current.hotline_number,
                secondary_email !== undefined ? secondary_email : current.secondary_email,
                business_hours !== undefined ? business_hours : current.business_hours,
                hero_images !== undefined ? hero_images : current.hero_images
            ]
        );

        // Return updated settings
        res.status(200).json({
            message: 'Settings updated successfully',
            settings: {
                site_name: site_title || current.site_name,
                support_email: support_email || current.support_email,
                hero_images: hero_images ? (typeof hero_images === 'string' ? JSON.parse(hero_images) : hero_images) : []
            }
        });
    } catch (error) {
        console.error('Settings update error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: error.message, error: error.toString() });
    }
};
