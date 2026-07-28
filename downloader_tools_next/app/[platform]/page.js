import { notFound } from "next/navigation";
import PlatformPageClient from "../components/PlatformPageClient";

const PLATFORM_MAP = {
  facebook: "Facebook",
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter / X",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
  douyin: "Douyin",
  kuaishou: "Kuaishou",
  discord: "Discord",
  quora: "Quora",
  tencent: "Tencent QQ",
  reels: "Instagram Reels",
  shorts: "YouTube Shorts",
};

export async function generateStaticParams() {
  return Object.keys(PLATFORM_MAP).map((platform) => ({
    platform,
  }));
}

export async function generateMetadata({ params }) {
  const { platform } = await params;
  const platformName = PLATFORM_MAP[platform.toLowerCase()];

  if (!platformName) {
    return {};
  }

  return {
    title: `Download ${platformName} Videos Free Online - No Watermark`,
    description: `Download video from ${platformName} online for free. Clean, fast, and works on Android, iOS, PC, and Mac without any watermark.`,
    alternates: {
      canonical: `/${platform.toLowerCase()}`,
    },
  };
}

export default async function Page({ params }) {
  const { platform } = await params;
  const platformName = PLATFORM_MAP[platform.toLowerCase()];

  if (!platformName) {
    notFound();
  }

  return <PlatformPageClient platformName={platformName} />;
}
