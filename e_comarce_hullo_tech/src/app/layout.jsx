import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import PageLayout from "../components/PageLayout";
import { Providers } from "../components/Providers";

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
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <PageLayout>{children}</PageLayout>
        </Providers>
      </body>
    </html>
  );
}
