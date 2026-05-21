import { Inter } from "next/font/google";
import "./globals.css";
import PageLayout from "../components/PageLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HulloTech",
  description: "Tech eCommerce Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageLayout>{children}</PageLayout>
      </body>
    </html>
  );
}