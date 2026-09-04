import bcrypt from "bcryptjs";
import {
  sequelize,
  AdminUser,
  Designer,
  Developer,
  Font,
  FontVariant,
  Download,
  Order,
} from "../models/index.js";

/**
 * Ensures all tables, columns, indexes, and essential baseline data exist in the database.
 * Safe to run multiple times (idempotent).
 */
export async function ensureDatabaseReady(options = { verbose: true, autoSeedIfEmpty: true }) {
  const log = (...args) => {
    if (options.verbose) console.log(...args);
  };

  try {
    log("🔄 [Database Sync] Checking MySQL database connection & schema...");
    await sequelize.authenticate();
    log("✓ [Database Sync] Database connection authenticated successfully.");

    // Sync all models (creates missing tables, adds missing columns/indexes)
    await sequelize.sync({ alter: true });
    log("✓ [Database Sync] All MySQL tables and columns synchronized successfully.");

    // Ensure default Super Admin exists
    const adminCount = await AdminUser.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await AdminUser.create({
        email: "admin@fontbd.com",
        password: hashedPassword,
        name: "Admin",
        role: "SUPERADMIN",
      });
      log("✓ [Database Sync] Default Superadmin created: admin@fontbd.com (password: admin123)");
    } else {
      log("✓ [Database Sync] Admin user verified.");
    }

    // If database is completely fresh and empty, seed initial starter fonts and designers
    if (options.autoSeedIfEmpty) {
      const fontCount = await Font.count();
      if (fontCount === 0) {
        log("🌱 [Database Sync] No fonts found. Seeding initial starter fonts and designers...");
        await seedStarterData(log);
      } else {
        log(`✓ [Database Sync] Font catalog verified (${fontCount} fonts loaded).`);
      }
    }

    log("✅ [Database Sync] Database is 100% ready and up-to-date!\n");
    return { success: true };
  } catch (error) {
    console.error("❌ [Database Sync Error]:", error.message);
    return { success: false, error: error.message };
  }
}

async function seedStarterData(log) {
  const designerList = [
    {
      name: "Ahmad Tofayel",
      banglaName: "আহমদ তোফায়েল",
      slug: "ahmad-tofayel",
      bio: "বাংলা টাইপোগ্রাফি ডিজাইনার",
      photo: "/uploads/images/placeholder-designer.jpg",
    },
    {
      name: "Jayed Ahsan Sad",
      banglaName: "জায়েদ আহসান সাদ",
      slug: "jayed-ahsan-sad",
      bio: "Founder of Codepotro",
      photo: "/uploads/images/placeholder-designer.jpg",
    },
    {
      name: "Masuda Akter Lima",
      banglaName: "মাসুদা আক্তার লিমা",
      slug: "masuda-akter-lima",
      bio: "Typography Designer",
      photo: "/uploads/images/placeholder-designer.jpg",
    },
    {
      name: "Codepotro Fonts",
      banglaName: "কোডপত্র ফন্টস",
      slug: "codepotro-fonts",
      bio: "বাংলা ফন্ট ডেভেলপমেন্ট টিম",
    },
  ];

  const designers = {};
  for (const d of designerList) {
    const [designer] = await Designer.findOrCreate({
      where: { slug: d.slug },
      defaults: d,
    });
    designers[d.slug] = designer;
  }

  const developerList = [
    {
      name: "Ehsan Al Mahfuz",
      banglaName: "এহসান আল মাহফুজ",
      slug: "ehsan-al-mahfuz",
      bio: "Font Developer",
      photo: "/uploads/images/placeholder-developer.jpg",
    },
    {
      name: "Codepotro Dev",
      banglaName: "কোডপত্র দেব",
      slug: "codepotro-dev",
      bio: "Software Development Team",
    },
  ];

  const developers = {};
  for (const dev of developerList) {
    const [developer] = await Developer.findOrCreate({
      where: { slug: dev.slug },
      defaults: dev,
    });
    developers[dev.slug] = developer;
  }

  const starterFonts = [
    {
      name: "Borno Bangla",
      banglaName: "বর্ণ বাংলা",
      slug: "borno-bangla",
      description: "বর্ণ বাংলা একটি ফ্রি বাংলা ফন্ট। ইউনিকোড এবং ANSI সাপোর্টেড।",
      style: "GENERAL",
      encoding: JSON.stringify(["UNICODE", "ANSI"]),
      downloadCount: 549,
      fontFileUrl: "/uploads/fonts/Atma-preview.ttf",
      featured: true,
      designerSlug: "ahmad-tofayel",
    },
    {
      name: "Abu Sayed",
      banglaName: "শহীদ আবু সাঈদ",
      slug: "abu-sayed",
      description: "শহীদ আবু সাঈদ একটি হেডিং বাংলা ফন্ট।",
      style: "HEADING",
      encoding: JSON.stringify(["UNICODE"]),
      downloadCount: 149398,
      fontFileUrl: "/uploads/fonts/abu-sayed-preview.ttf",
      featured: true,
      designerSlug: "jayed-ahsan-sad",
    },
    {
      name: "Hadi",
      banglaName: "হাদি",
      slug: "hadi",
      description: "হাদি একটি সাধারণ বাংলা ফন্ট। ইউনিকোড সাপোর্টেড।",
      style: "GENERAL",
      encoding: JSON.stringify(["UNICODE"]),
      downloadCount: 49646,
      fontFileUrl: "/uploads/fonts/Hind-Siliguri-preview.ttf",
      featured: true,
      designerSlug: "codepotro-fonts",
    },
    {
      name: "Lima Bosonto",
      banglaName: "লিমা বসন্ত",
      slug: "lima-bosonto",
      description: "লিমা বসন্ত একটি ফ্রি বাংলা ফন্ট, ইউনিকোড, আনসি এবং বর্ণ এনকোডিং সমর্থন।",
      style: "GENERAL",
      encoding: JSON.stringify(["UNICODE", "ANSI", "BORNA"]),
      downloadCount: 261663,
      fontFileUrl: "/uploads/fonts/lima-bosonto-preview.ttf",
      featured: true,
      designerSlug: "masuda-akter-lima",
      developerSlug: "ehsan-al-mahfuz",
    },
    {
      name: "Mahin Dui Dashok",
      banglaName: "মাহিন দুই দশক",
      slug: "mahin-dui-dashok",
      description: "মাহিন দুই দশক একটি স্টাইলিশ বাংলা ফন্ট।",
      style: "STYLISH",
      encoding: JSON.stringify(["UNICODE"]),
      downloadCount: 100322,
      fontFileUrl: "/uploads/fonts/Atma-preview.ttf",
      featured: true,
      designerSlug: "jayed-ahsan-sad",
      developerSlug: "codepotro-dev",
    },
  ];

  for (const f of starterFonts) {
    const designer = designers[f.designerSlug];
    const developer = f.developerSlug ? developers[f.developerSlug] : null;

    if (!designer) continue;

    const [font] = await Font.findOrCreate({
      where: { slug: f.slug },
      defaults: {
        name: f.name,
        banglaName: f.banglaName,
        slug: f.slug,
        description: f.description,
        detailsDescription: `${f.name} একটি চমৎকার বাংলা টাইপফেস। এটি পরিষ্কার লেটারফর্ম ও সুন্দর ড্রয়িংয়ের সাথে ডিজাইন করা হয়েছে।`,
        fontType: "FREE",
        style: f.style,
        encoding: f.encoding,
        downloadCount: f.downloadCount,
        fontFileUrl: f.fontFileUrl,
        featured: f.featured,
        designerId: designer.id,
        developerId: developer?.id ?? null,
      },
    });

    const defaultWeights = ["Regular", "Medium", "Bold"];
    for (const weight of defaultWeights) {
      await FontVariant.findOrCreate({
        where: { fontId: font.id, weight },
        defaults: {
          weight,
          fileUrl: f.fontFileUrl,
          fontId: font.id,
        },
      });
    }
  }
  log("✓ [Database Sync] Starter fonts and variants initialized successfully.");
}

export default ensureDatabaseReady;
