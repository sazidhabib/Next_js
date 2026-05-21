const { SiteSetting } = require('../models');

// Fallback in-memory settings in case DB is not available
let fallbackSettings = {
  siteTitle: 'HulloTech E-Commerce',
  siteDescription: 'Tech & Electronics Marketplace in Bangladesh',
  contactEmail: 'support@hullotech.com',
  contactPhone: '+880 1234 567890',
  contactAddress: 'Dhaka, Bangladesh',
  footerText: '© 2026 HulloTech. All rights reserved.',
  socialLinks: {}
};

// Initialize settings if not exists
const initSettings = async () => {
  if (!SiteSetting) return;
  try {
    const count = await SiteSetting.count();
    if (count === 0) {
      await SiteSetting.create({}); // Creates with default values defined in model
    }
  } catch (error) {
    console.warn('⚠️ Database not reachable during initSettings:', error.message);
  }
};

const getSettings = async (req, res) => {
  try {
    if (!SiteSetting) {
      return res.json({ success: true, data: fallbackSettings });
    }
    try {
      await initSettings();
      const settings = await SiteSetting.findOne();
      return res.json({ success: true, data: settings });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during getSettings, using fallback settings:', dbError.message);
      return res.json({ success: true, data: fallbackSettings });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { siteTitle, siteDescription, contactEmail, contactPhone, contactAddress, footerText, socialLinks } = req.body;
    
    if (!SiteSetting) {
      fallbackSettings = {
        siteTitle: siteTitle || fallbackSettings.siteTitle,
        siteDescription: siteDescription || fallbackSettings.siteDescription,
        contactEmail: contactEmail || fallbackSettings.contactEmail,
        contactPhone: contactPhone || fallbackSettings.contactPhone,
        contactAddress: contactAddress || fallbackSettings.contactAddress,
        footerText: footerText || fallbackSettings.footerText,
        socialLinks: socialLinks || fallbackSettings.socialLinks
      };
      return res.json({ success: true, data: fallbackSettings });
    }

    try {
      let settings = await SiteSetting.findOne();
      if (!settings) {
        settings = await SiteSetting.create({});
      }

      settings.siteTitle = siteTitle || settings.siteTitle;
      settings.siteDescription = siteDescription || settings.siteDescription;
      settings.contactEmail = contactEmail || settings.contactEmail;
      settings.contactPhone = contactPhone || settings.contactPhone;
      settings.contactAddress = contactAddress || settings.contactAddress;
      settings.footerText = footerText || settings.footerText;
      settings.socialLinks = socialLinks || settings.socialLinks;

      await settings.save();
      
      return res.json({ success: true, data: settings });
    } catch (dbError) {
      console.warn('⚠️ Database not reachable during updateSettings, updating fallback settings:', dbError.message);
      fallbackSettings = {
        siteTitle: siteTitle || fallbackSettings.siteTitle,
        siteDescription: siteDescription || fallbackSettings.siteDescription,
        contactEmail: contactEmail || fallbackSettings.contactEmail,
        contactPhone: contactPhone || fallbackSettings.contactPhone,
        contactAddress: contactAddress || fallbackSettings.contactAddress,
        footerText: footerText || fallbackSettings.footerText,
        socialLinks: socialLinks || fallbackSettings.socialLinks
      };
      return res.json({ success: true, data: fallbackSettings });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
