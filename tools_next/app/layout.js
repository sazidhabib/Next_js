import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  title: {
    default: "FileConvert - Convert Any File Online",
    template: "%s | FileConvert",
  },
  description:
    "Convert any file format online. Support for 200+ formats including PDF, DOCX, JPG, PNG, MP4, and more. Fast, secure, and free for personal use.",
  keywords: [
    "file converter",
    "online converter",
    "PDF converter",
    "image converter",
    "video converter",
    "audio converter",
    "document converter",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FileConvert",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
