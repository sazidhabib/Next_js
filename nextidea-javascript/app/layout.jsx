import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nextideasolution.com"),
  title: {
    default: "Next Idea Solution - Your Ideas Our Solution",
    template: "%s | Next Idea Solution",
  },
  description: "We are an award-winning, certified, 360-degree digital-first advertising agency in Bangladesh. We offer complete end-to-end solutions that drives meaningful results for our clients.",
  keywords: ["digital agency", "advertising agency Bangladesh", "SEO", "social media marketing", "web design", "branding", "Next Idea Solution"],
  authors: [{ name: "Next Idea Solution" }],
  creator: "Next Idea Solution",
  publisher: "Next Idea Solution",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://nextideasolution.com",
    siteName: "Next Idea Solution",
    title: "Next Idea Solution - Your Ideas Our Solution",
    description: "Award-winning 360-degree digital-first advertising agency in Bangladesh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next Idea Solution - Your Ideas Our Solution",
    description: "Award-winning 360-degree digital-first advertising agency in Bangladesh.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://nextideasolution.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
