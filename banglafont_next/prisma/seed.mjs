import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const factory = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter: factory });

async function main() {
  console.log("🌱 Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@fontbd.com" },
    update: {},
    create: {
      email: "admin@fontbd.com",
      name: "Admin",
      password: adminPassword,
      role: "SUPERADMIN",
    },
  });
  console.log("✓ Admin user created");

  const designers = await Promise.all([
    prisma.designer.upsert({
      where: { slug: "ahmad-tofayel" },
      update: {},
      create: {
        name: "Ahmad Tofayel",
        slug: "ahmad-tofayel",
        bio: "বাংলা টাইপোগ্রাফি ডিজাইনার",
        photo: "/uploads/images/placeholder-designer.jpg",
      },
    }),
    prisma.designer.upsert({
      where: { slug: "jayed-ahsan-sad" },
      update: {},
      create: {
        name: "Jayed Ahsan Sad",
        slug: "jayed-ahsan-sad",
        bio: "Founder of Codepotro",
        photo: "/uploads/images/placeholder-designer.jpg",
      },
    }),
    prisma.designer.upsert({
      where: { slug: "masuda-akter-lima" },
      update: {},
      create: {
        name: "Masuda Akter Lima",
        slug: "masuda-akter-lima",
        bio: "Typography Designer",
        photo: "/uploads/images/placeholder-designer.jpg",
      },
    }),
    prisma.designer.upsert({
      where: { slug: "codepotro-fonts" },
      update: {},
      create: {
        name: "Codepotro Fonts",
        slug: "codepotro-fonts",
        bio: "বাংলা ফন্ট ডেভেলপমেন্ট টিম",
      },
    }),
  ]);
  console.log("✓ Designers created");

  const developers = await Promise.all([
    prisma.developer.upsert({
      where: { slug: "ehsan-al-mahfuz" },
      update: {},
      create: {
        name: "Ehsan Al Mahfuz",
        slug: "ehsan-al-mahfuz",
        bio: "Font Developer",
        photo: "/uploads/images/placeholder-developer.jpg",
      },
    }),
    prisma.developer.upsert({
      where: { slug: "codepotro-dev" },
      update: {},
      create: {
        name: "Codepotro Dev",
        slug: "codepotro-dev",
        bio: "Software Development Team",
      },
    }),
  ]);
  console.log("✓ Developers created");

  const fontData = [
    {
      name: "বর্ণ বাংলা",
      slug: "borno-bangla",
      description: "বর্ণ বাংলা একটি ফ্রি বাংলা ফন্ট। ইউনিকোড এবং ANSI সাপোর্টেড।",
      style: "GENERAL",
      encoding: JSON.stringify(["UNICODE", "ANSI"]),
      downloadCount: 549,
      fontFileUrl: "/uploads/fonts/placeholder-font.ttf",
      featured: true,
      designerSlug: "ahmad-tofayel",
    },
    {
      name: "শহীদ আবু সাঈদ",
      slug: "abu-sayed",
      description: "শহীদ আবু সাঈদ একটি হেডিং বাংলা ফন্ট।",
      style: "HEADING",
      encoding: JSON.stringify(["UNICODE"]),
      downloadCount: 149398,
      fontFileUrl: "/uploads/fonts/placeholder-font.ttf",
      featured: true,
      designerSlug: "jayed-ahsan-sad",
    },
    {
      name: "হাদি",
      slug: "hadi",
      description: "হাদি একটি সাধারণ বাংলা ফন্ট। ইউনিকোড সাপোর্টেড।",
      style: "GENERAL",
      encoding: JSON.stringify(["UNICODE"]),
      downloadCount: 49646,
      fontFileUrl: "/uploads/fonts/placeholder-font.ttf",
      featured: true,
      designerSlug: "codepotro-fonts",
    },
    {
      name: "লিমা বসন্ত",
      slug: "lima-bosonto",
      description: "লিমা বসন্ত একটি ফ্রি বাংলা ফন্ট, ইউনিকোড, আনসি এবং বর্ণ এনকোডিং সমর্থন।",
      style: "GENERAL",
      encoding: JSON.stringify(["UNICODE", "ANSI", "BORNA"]),
      downloadCount: 261663,
      fontFileUrl: "/uploads/fonts/placeholder-font.ttf",
      featured: true,
      designerSlug: "masuda-akter-lima",
      developerSlug: "ehsan-al-mahfuz",
    },
    {
      name: "মাহিন দুই দশক",
      slug: "mahin-dui-dashok",
      description: "মাহিন দুই দশক একটি স্টাইলিশ বাংলা ফন্ট।",
      style: "STYLISH",
      encoding: JSON.stringify(["UNICODE"]),
      downloadCount: 100322,
      fontFileUrl: "/uploads/fonts/placeholder-font.ttf",
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

    const font = await prisma.font.upsert({
      where: { slug: f.slug },
      update: {},
      create: {
        name: f.name,
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

    // Clear and seed FontVariants for idempotency
    await prisma.fontVariant.deleteMany({ where: { fontId: font.id } });
    const defaultWeights = ["Regular", "Medium", "Bold"];
    for (const weight of defaultWeights) {
      await prisma.fontVariant.create({
        data: {
          weight,
          fileUrl: f.fontFileUrl, // Use the default font file url for simplicity
          fontId: font.id,
        },
      });
    }
    console.log(`  ✓ Font: ${f.name} (with variants: ${defaultWeights.join(", ")})`);
  }

  console.log("\n✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
