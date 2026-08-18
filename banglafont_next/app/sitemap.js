import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nexttype.com";

  // 1. Static Paths
  const staticPaths = [
    "",
    "/free-fonts",
    "/premium-font",
    "/unicode-to-ansi-converter",
    "/type-tester",
    "/about-us",
    "/contact",
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Font Paths
  let fontUrls = [];
  try {
    const fonts = await prisma.font.findMany({
      where: { published: true },
      select: { slug: true, fontType: true, updatedAt: true },
    });

    fontUrls = fonts.map((font) => {
      const pathSegment = font.fontType === "FREE" ? "/free-font" : "/premium-font";
      return {
        url: `${baseUrl}${pathSegment}/${font.slug}`,
        lastModified: font.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Error fetching fonts for sitemap:", error);
  }

  // 3. Dynamic Designer Paths
  let designerUrls = [];
  try {
    const designers = await prisma.designer.findMany({
      select: { slug: true, updatedAt: true },
    });

    designerUrls = designers.map((designer) => ({
      url: `${baseUrl}/designer/${designer.slug}`,
      lastModified: designer.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching designers for sitemap:", error);
  }

  // 4. Dynamic Developer Paths
  let developerUrls = [];
  try {
    const developers = await prisma.developer.findMany({
      select: { slug: true, updatedAt: true },
    });

    developerUrls = developers.map((developer) => ({
      url: `${baseUrl}/developer/${developer.slug}`,
      lastModified: developer.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error fetching developers for sitemap:", error);
  }

  return [...staticUrls, ...fontUrls, ...designerUrls, ...developerUrls];
}
