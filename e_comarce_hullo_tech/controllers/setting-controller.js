const { SiteSetting } = require('../models');

// Initialize settings if not exists
const initSettings = async () => {
  const count = await SiteSetting.count();
  if (count === 0) {
    await SiteSetting.create({}); // Creates with default values defined in model
  }
};

const getSettings = async (req, res) => {
  try {
    await initSettings();
    const settings = await SiteSetting.findOne();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { siteTitle, siteDescription, contactEmail, contactPhone, contactAddress, footerText, socialLinks } = req.body;
    
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
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
