import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Providers } from "../components/Providers";

export const metadata = {
  title: "Photo Card BD - Digital Photo Card Generator",
  description: "Create political and social photo cards in just one click. Bangladesh's most popular digital photo card generator.",
  keywords: ["photo card", "digital frame", "bangladesh", "political frame", "social media frame", "photo editor"],
  openGraph: {
    title: "Photo Card BD",
    description: "Create political and social photo cards in just one click.",
    url: "https://photocardbd.com",
    siteName: "Photo Card BD",
    images: [
      {
        url: "/og-image.jpg", // Make sure this file exists in public folder or use a remote URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Card BD",
    description: "Create political and social photo cards in just one click.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen .container flex flex-col bg-background text-gray-900" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
