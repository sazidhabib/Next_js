import "dotenv/config";
import bcrypt from "bcryptjs";
import {
  sequelize,
  AdminUser,
  Designer,
  Developer,
  Font,
  FontVariant,
} from "../models/index.js";

async function main() {
  console.log("🌱 Seeding database with Sequelize...");

  await sequelize.authenticate();
  await sequelize.sync();

  const adminPassword = await bcrypt.hash("admin123", 10);

  const [admin] = await AdminUser.findOrCreate({
    where: { email: "admin@fontbd.com" },
    defaults: {
      email: "admin@fontbd.com",
      name: "Admin",
      password: adminPassword,
      role: "SUPERADMIN",
    },
  });
  if (admin) {
    admin.password = adminPassword;
    admin.name = "Admin";
    admin.role = "SUPERADMIN";
    await admin.save();
  }
  console.log("✓ Admin user created/updated");

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

  const designers = [];
  for (const d of designerList) {
    const [designer] = await Designer.findOrCreate({
      where: { slug: d.slug },
      defaults: d,
    });
    await designer.update(d);
    designers.push(designer);
  }
  console.log("✓ Designers created");

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

  const developers = [];
  for (const dev of developerList) {
    const [developer] = await Developer.findOrCreate({
      where: { slug: dev.slug },
      defaults: dev,
    });
    await developer.update(dev);
    developers.push(developer);
  }
  console.log("✓ Developers created");

  const fontData = [
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

  for (const f of fontData) {
    const designer = designers.find((d) => d.slug === f.designerSlug);
    const developer = f.developerSlug
      ? developers.find((d) => d.slug === f.developerSlug)
      : null;

    if (!designer) {
      console.error(`  ✗ Designer not found for slug: ${f.designerSlug}`);
      continue;
    }

    const [font] = await Font.findOrCreate({
      where: { slug: f.slug },
      defaults: {
        name: f.name,
        banglaName: f.banglaName,
        slug: f.slug,
        description: f.description,
        detailsDescription: `${f.name} একটি চমৎকার বাংলা টাইপফেস। এটি পরিষ্কার লেটারফর্ম ও সুন্দর ড্রয়িংয়ের সাথে ডিজাইন করা হয়েছে যা আপনার যেকোনো ডিজিটাল বা প্রিন্ট ডিজাইনের প্রকাশভঙ্গিকে এক নতুন শৈল্পিক রূপ দেবে।`,
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

    await font.update({
      name: f.name,
      banglaName: f.banglaName,
      description: f.description,
      fontFileUrl: f.fontFileUrl,
      designerId: designer.id,
      developerId: developer?.id ?? null,
    });

    // Clear and seed FontVariants for idempotency
    await FontVariant.destroy({ where: { fontId: font.id } });
    const defaultWeights = ["Regular", "Medium", "Bold"];
    for (const weight of defaultWeights) {
      await FontVariant.create({
        weight,
        fileUrl: f.fontFileUrl,
        fontId: font.id,
      });
    }
    console.log(`  ✓ Font: ${f.name} (with variants: ${defaultWeights.join(", ")})`);
  }

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sequelize.close();
  });
