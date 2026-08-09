const { SiteSetting } = require('../models');

const defaultBrands = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Gigabyte", "Corsair", "Samsung"];

const defaultMenuItems = [
  {
    name: "Desktop",
    href: "/desktops",
    subCategories: [
      {
        name: "Gaming PC",
        href: "/desktops/gaming-pc",
        subCategories: [
          { name: "Intel Gaming PC", href: "/desktops/gaming-pc/intel" },
          { name: "AMD Gaming PC", href: "/desktops/gaming-pc/amd" },
          { name: "Custom Gaming Build", href: "/desktops/gaming-pc/custom" }
        ]
      },
      {
        name: "Brand PC",
        href: "/desktops/brand-pc",
        subCategories: [
          { name: "HP Brand PC", href: "/desktops/brand-pc/hp" },
          { name: "Dell Brand PC", href: "/desktops/brand-pc/dell" },
          { name: "Lenovo Brand PC", href: "/desktops/brand-pc/lenovo" }
        ]
      },
      { name: "All-in-One PC", href: "/desktops/all-in-one-pc" },
      { name: "Portable Mini PC", href: "/desktops/portable-mini-pc" }
    ]
  },
  {
    name: "Laptop",
    href: "/laptop-notebook",
    subCategories: [
      {
        name: "All Laptop",
        href: "/laptop-notebook/laptop",
        subCategories: [
          { name: "HP Laptops", href: "/laptop-notebook/laptop/hp" },
          { name: "Dell Laptops", href: "/laptop-notebook/laptop/dell" },
          { name: "Lenovo Laptops", href: "/laptop-notebook/laptop/lenovo" },
          { name: "Asus Laptops", href: "/laptop-notebook/laptop/asus" }
        ]
      },
      {
        name: "Gaming Laptop",
        href: "/laptop-notebook/Gaming-Laptop",
        subCategories: [
          { name: "ASUS ROG/TUF", href: "/laptop-notebook/Gaming-Laptop/asus" },
          { name: "MSI Gaming", href: "/laptop-notebook/Gaming-Laptop/msi" },
          { name: "Lenovo Legion", href: "/laptop-notebook/Gaming-Laptop/lenovo" }
        ]
      },
      { name: "Premium Ultrabook", href: "/laptop-notebook/ultrabook" },
      { name: "Laptop Bag", href: "/laptop-bag-backpack" }
    ]
  },
  {
    name: "Component",
    href: "/component",
    subCategories: [
      {
        name: "Processor",
        href: "/component/processor",
        subCategories: [
          { name: "Intel Processor", href: "/component/processor/intel" },
          { name: "AMD Processor", href: "/component/processor/amd" }
        ]
      },
      {
        name: "Motherboard",
        href: "/component/motherboard",
        subCategories: [
          { name: "ASUS Motherboard", href: "/component/motherboard/asus" },
          { name: "MSI Motherboard", href: "/component/motherboard/msi" },
          { name: "Gigabyte Motherboard", href: "/component/motherboard/gigabyte" }
        ]
      },
      {
        name: "Graphics Card",
        href: "/component/graphics-card",
        subCategories: [
          { name: "NVIDIA GeForce", href: "/component/graphics-card/nvidia" },
          { name: "AMD Radeon", href: "/component/graphics-card/amd" }
        ]
      },
      { name: "RAM (Desktop)", href: "/component/ram" },
      { name: "RAM (Laptop)", href: "/component/laptop-ram" },
      { name: "SSD", href: "/ssd" },
      { name: "Hard Disk Drive", href: "/component/hard-disk-drive" },
      { name: "Power Supply", href: "/component/power-supply" },
      { name: "Casing", href: "/component/casing" }
    ]
  },
  {
    name: "Monitor",
    href: "/monitor",
    subCategories: [
      {
        name: "Gaming Monitor",
        href: "/gaming-monitor",
        subCategories: [
          { name: "144Hz Monitor", href: "/gaming-monitor/144hz" },
          { name: "240Hz Monitor", href: "/gaming-monitor/240hz" },
          { name: "Ultrawide Gaming", href: "/gaming-monitor/ultrawide" }
        ]
      },
      { name: "Curved Monitor", href: "/curved-monitor" },
      { name: "4K Monitor", href: "/4k-monitor" },
      { name: "Portable Monitor", href: "/portable-monitor" }
    ]
  },
  {
    name: "Power",
    href: "/power",
    subCategories: [
      { name: "UPS", href: "/ups" },
      { name: "Online UPS", href: "/online-ups" },
      { name: "Mini UPS", href: "/mini-ups" },
      { name: "Portable Power Station", href: "/portable-power-station" }
    ]
  },
  {
    name: "Phone",
    href: "/mobile-phone",
    subCategories: [
      {
        name: "iPhone",
        href: "/apple-iphone",
        subCategories: [
          { name: "iPhone 15 Pro Max", href: "/apple-iphone/iphone-15-pro-max" },
          { name: "iPhone 15 Pro", href: "/apple-iphone/iphone-15-pro" },
          { name: "iPhone 15", href: "/apple-iphone/iphone-15" },
          { name: "iPhone 14 Series", href: "/apple-iphone/iphone-14" },
          { name: "iPhone 13 Series", href: "/apple-iphone/iphone-13" }
        ]
      },
      {
        name: "Samsung",
        href: "/samsung-mobile-phone",
        subCategories: [
          { name: "Galaxy S24 Ultra", href: "/samsung-mobile-phone/s24-ultra" },
          { name: "Galaxy S24 Series", href: "/samsung-mobile-phone/s24" },
          { name: "Galaxy Fold/Flip", href: "/samsung-mobile-phone/fold-flip" },
          { name: "Galaxy A Series", href: "/samsung-mobile-phone/a-series" }
        ]
      },
      { name: "Redmi", href: "/xiaomi-mobile-phone" },
      { name: "Realme", href: "/realme-mobile-phone" }
    ]
  },
  {
    name: "Tablet",
    href: "/tablet-pc",
    subCategories: [
      {
        name: "iPad",
        href: "/apple-ipad",
        subCategories: [
          { name: "iPad Pro", href: "/apple-ipad/ipad-pro" },
          { name: "iPad Air", href: "/apple-ipad/ipad-air" },
          { name: "iPad Mini", href: "/apple-ipad/ipad-mini" },
          { name: "iPad 10.2", href: "/apple-ipad/ipad-10-2" }
        ]
      },
      { name: "Samsung", href: "/samsung-tablet" },
      { name: "Lenovo", href: "/tablet-pc/lenovo-tablet-pc" },
      { name: "Graphics Tablet", href: "/graphics-tablet" }
    ]
  },
  {
    name: "Office Equipment",
    href: "/office-equipment",
    subCategories: [
      { name: "Printer", href: "/printer" },
      { name: "Photocopier", href: "/photocopier" },
      { name: "Projector", href: "/projector" },
      { name: "Scanner", href: "/office-equipment/Scanner" }
    ]
  },
  {
    name: "Camera",
    href: "/camera",
    subCategories: [
      { name: "DSLR", href: "/dslr-camera" },
      { name: "Mirrorless Camera", href: "/mirrorless-camera" },
      { name: "Action Camera", href: "/camera/action-camera" },
      { name: "Security Camera", href: "/security-camera" }
    ]
  },
  {
    name: "Security",
    href: "/security-camera",
    subCategories: [
      { name: "WiFi Camera", href: "/wifi-camera" },
      { name: "IP Camera", href: "/ip-camera" },
      { name: "DVR/NVR", href: "/dvr-nvr" },
      { name: "Accessories", href: "/security-accessories" }
    ]
  }
];

// Fallback in-memory settings in case DB is not available
let fallbackSettings = {
  siteTitle: 'HulloTech E-Commerce',
  siteDescription: 'Tech & Electronics Marketplace in Bangladesh',
  contactEmail: 'support@hullotech.com',
  contactPhone: '+880 1234 567890',
  contactAddress: 'Dhaka, Bangladesh',
  footerText: '© 2026 HulloTech. All rights reserved.',
  socialLinks: {},
  deliveryCharge: 120,
  freeShippingThreshold: 5000,
  mainSlider: [
    { image: "/1st-post.jpeg" },
    { image: "/2nd_post.jpeg" },
    { image: "/cover.jpeg" }
  ],
  topSlider: [
    { image: "/3rd_post.png", link: "/offers" },
    { image: "/1st-post.jpeg", link: "/offers" },
    { image: "/cover.jpeg", link: "/offers" }
  ],
  bottomSlider: [
    { image: "/4th_post.png", link: "/offers" },
    { image: "/2nd_post.jpeg", link: "/offers" },
    { image: "/cover.jpeg", link: "/offers" }
  ],
  menuItems: defaultMenuItems,
  brands: defaultBrands
};

// Initialize settings if not exists
const initSettings = async () => {
  if (!SiteSetting) return;
  try {
    const count = await SiteSetting.count();
    if (count === 0) {
      await SiteSetting.create({
        menuItems: defaultMenuItems,
        brands: defaultBrands
      });
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
      let settings = await SiteSetting.findOne();
      
      // If menuItems in database is null, seed it dynamically
      if (settings && !settings.menuItems) {
        settings.menuItems = defaultMenuItems;
        await settings.save();
      }
      
      // If brands in database is null, seed it dynamically
      if (settings && !settings.brands) {
        settings.brands = defaultBrands;
        await settings.save();
      }
      
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
    const { siteTitle, siteDescription, contactEmail, contactPhone, contactAddress, footerText, socialLinks, deliveryCharge, freeShippingThreshold, mainSlider, topSlider, bottomSlider, menuItems, brands } = req.body;
    
    if (!SiteSetting) {
      fallbackSettings = {
        siteTitle: siteTitle || fallbackSettings.siteTitle,
        siteDescription: siteDescription || fallbackSettings.siteDescription,
        contactEmail: contactEmail || fallbackSettings.contactEmail,
        contactPhone: contactPhone || fallbackSettings.contactPhone,
        contactAddress: contactAddress || fallbackSettings.contactAddress,
        footerText: footerText || fallbackSettings.footerText,
        socialLinks: socialLinks || fallbackSettings.socialLinks,
        deliveryCharge: deliveryCharge !== undefined ? Number(deliveryCharge) : fallbackSettings.deliveryCharge,
        freeShippingThreshold: freeShippingThreshold !== undefined ? Number(freeShippingThreshold) : fallbackSettings.freeShippingThreshold,
        mainSlider: mainSlider || fallbackSettings.mainSlider,
        topSlider: topSlider || fallbackSettings.topSlider,
        bottomSlider: bottomSlider || fallbackSettings.bottomSlider,
        menuItems: menuItems || fallbackSettings.menuItems,
        brands: brands || fallbackSettings.brands
      };
      return res.json({ success: true, data: fallbackSettings });
    }

    try {
      let settings = await SiteSetting.findOne();
      if (!settings) {
        settings = await SiteSetting.create({ menuItems: defaultMenuItems, brands: defaultBrands });
      }

      settings.siteTitle = siteTitle || settings.siteTitle;
      settings.siteDescription = siteDescription || settings.siteDescription;
      settings.contactEmail = contactEmail || settings.contactEmail;
      settings.contactPhone = contactPhone || settings.contactPhone;
      settings.contactAddress = contactAddress || settings.contactAddress;
      settings.footerText = footerText || settings.footerText;
      settings.socialLinks = socialLinks || settings.socialLinks;
      if (deliveryCharge !== undefined) settings.deliveryCharge = Number(deliveryCharge);
      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);
      if (mainSlider !== undefined) settings.mainSlider = mainSlider;
      if (topSlider !== undefined) settings.topSlider = topSlider;
      if (bottomSlider !== undefined) settings.bottomSlider = bottomSlider;
      if (menuItems !== undefined) settings.menuItems = menuItems;
      if (brands !== undefined) settings.brands = brands;

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
        socialLinks: socialLinks || fallbackSettings.socialLinks,
        deliveryCharge: deliveryCharge !== undefined ? Number(deliveryCharge) : fallbackSettings.deliveryCharge,
        freeShippingThreshold: freeShippingThreshold !== undefined ? Number(freeShippingThreshold) : fallbackSettings.freeShippingThreshold,
        mainSlider: mainSlider || fallbackSettings.mainSlider,
        topSlider: topSlider || fallbackSettings.topSlider,
        bottomSlider: bottomSlider || fallbackSettings.bottomSlider,
        menuItems: menuItems || fallbackSettings.menuItems,
        brands: brands || fallbackSettings.brands
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
