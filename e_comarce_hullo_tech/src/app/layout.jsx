import { Inter } from "next/font/google";
import "./globals.css";
import PageLayout from "../components/PageLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HulloTech",
  description: "Tech eCommerce Store",
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}
