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
  title: "MediaDrop - Download Media From Anywhere | Fast, Free & No Watermark",
  description:
    "Save videos, audio, and images from Facebook, YouTube, Instagram, TikTok, Twitter/X, and more in high quality without watermarks.",
  keywords: [
    "MediaDrop",
    "video downloader",
    "download media from anywhere",
    "download facebook videos",
    "download youtube videos",
    "download instagram reels",
    "download tiktok videos",
    "HD video download",
    "4K video downloader",
    "free video downloader",
  ],
  authors: [{ name: "MediaDrop" }],
  openGraph: {
    title: "MediaDrop - Download Media From Anywhere",
    description:
      "Save videos, audio, and images from your favorite platforms in high quality.",
    type: "website",
    siteName: "MediaDrop",
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL("https://mediadrop.app"),
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
