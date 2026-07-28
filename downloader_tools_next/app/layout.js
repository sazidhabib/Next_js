import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Save Social Videos - Download Video HD Free from Facebook YouTube Instagram TikTok",
  description:
    "Download videos from Facebook, YouTube, Instagram, TikTok in HD, 2K, 4K quality for free. Fast video downloader for Android, iOS, PC.",
  keywords: [
    "video downloader",
    "download facebook videos",
    "download youtube videos",
    "download instagram reels",
    "download tiktok videos",
    "HD video download",
    "4K video downloader",
    "free video downloader",
    "save social videos",
    "download twitter videos",
  ],
  authors: [{ name: "SaveSocialVideos" }],
  openGraph: {
    title: "Download Video HD Free | SaveSocialVideos",
    description:
      "Free video downloader. Facebook, YouTube, Instagram, TikTok. HD, 2K, 4K quality.",
    type: "website",
    siteName: "SaveSocialVideos",
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL("https://savesocialvideos.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
