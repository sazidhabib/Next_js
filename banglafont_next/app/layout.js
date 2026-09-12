import "./globals.css";
import Script from "next/script";
import RootLayoutContent from "../components/RootLayoutContent";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://fonts.nextdigit.dev";

export const metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "NextType - বাংলা ফন্ট টাইপোগ্রাফির নতুন দিগন্ত",
    template: "%s | NextType",
  },

  description:
    "সেরা বাংলা ফন্ট টাইপোগ্রাফি প্ল্যাটফর্ম। বিনামূল্যে বাংলা ফন্ট ডাউনলোড করুন, ফন্ট টেস্ট করুন এবং আপনার ডিজাইনকে আরও আকর্ষণীয় করুন।",

  keywords: [
    "বাংলা ফন্ট",
    "Bangla font",
    "Bengali font",
    "বাংলা ফন্ট ডাউনলোড",
    "Bangla font download",
    "Bengali typography",
    "বাংলা টাইপোগ্রাফি",
    "Bangla typography",
    "বাংলা ফন্ট ফ্রি",
    "free Bangla fonts",
    "Bangla free fonts",
    "Bangla font tester",
    "Bengali font marketplace",
    "বাংলা টাইপফেস",
    "Bangla typeface",
    "NextType",
    "Next Type",
    "ফ্রি বাংলা ফন্ট",
    "NextDigit",
    "Next Digit",
    "নেক্সট টাইপ",
    "নেক্সট ডিজিট",

  ],

  authors: [
    {
      name: "NextType",
      url: APP_URL,
    },
  ],

  creator: "NextType",
  publisher: "NextType",

  applicationName: "NextType",

  generator: "Next.js",

  referrer: "origin-when-cross-origin",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/icons/favicon.ico",
      },
      {
        url: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/icons/site.webmanifest",

  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: APP_URL,

    siteName: "NextType",

    title: "NextType - বাংলা ফন্ট টাইপোগ্রাফির নতুন দিগন্ত",

    description:
      "সেরা বাংলা ফন্ট টাইপোগ্রাফি প্ল্যাটফর্ম। বিনামূল্যে বাংলা ফন্ট ডাউনলোড করুন, ফন্ট টেস্ট করুন এবং আপনার ডিজাইনকে আরও আকর্ষণীয় করুন।",

    images: [
      {
        url: "/images/nexttype-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextType - বাংলা ফন্ট টাইপোগ্রাফির নতুন দিগন্ত",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "NextType - বাংলা ফন্ট টাইপোগ্রাফির নতুন দিগন্ত",

    description:
      "সেরা বাংলা ফন্ট টাইপোগ্রাফি প্ল্যাটফর্ম। বাংলা ফন্ট ডাউনলোড করুন, টেস্ট করুন এবং সুন্দর টাইপোগ্রাফি তৈরি করুন।",

    images: ["/images/nexttype-og-image.jpg"],

    // username of your X/Twitter account if you have one
    // creator: "@nexttype",
    // site: "@nexttype",
  },

  category: "technology",

  other: {
    "theme-color": "#090a0f",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
        >{`
          (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({
              'gtm.start': new Date().getTime(),
              event:'gtm.js'
            });

            var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';

            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;

            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-T2CRNT4V');
        `}</Script>
      </head>

      <body
        className="min-h-full flex flex-col bg-[#090a0f] text-gray-100"
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T2CRNT4V"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}