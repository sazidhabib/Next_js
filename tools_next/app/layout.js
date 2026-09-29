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

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tools.nextdigit.dev'

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FileConvert - Free Online File Converter (200+ Formats)",
    template: "%s | FileConvert",
  },
  description:
    "Convert any file format online for free. Convert PDF, Word, Excel, JPG, PNG, WEBP, MP4, MP3, and 200+ formats instantly. 100% free, secure 256-bit encryption, no software installation required.",
  keywords: [
    "file converter",
    "online file converter",
    "free file converter",
    "convert PDF to Word",
    "image converter",
    "video converter",
    "audio converter",
    "document converter",
    "archive converter",
    "WEBP to PNG",
    "MP4 to MP3",
  ],
  authors: [{ name: "FileConvert Team" }],
  creator: "FileConvert",
  publisher: "Next Tools",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "FileConvert",
    title: "FileConvert - Free Online File Converter",
    description: "Convert 200+ formats online in seconds. Free, fast, private, and secure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileConvert - Free Online File Converter",
    description: "Convert 200+ formats online in seconds. Free, fast, and secure.",
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_SITE_VERIFICATION || undefined,
    other: {
      ...(process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : {}),
    },
  },
};

const GLOBAL_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "FileConvert",
      "description": "Fast, secure, and free online file converter supporting 200+ formats.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/{search_term_string}-converter`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "FileConvert",
      "url": BASE_URL,
      "logo": `${BASE_URL}/favicon.ico`,
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(GLOBAL_SCHEMA),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

