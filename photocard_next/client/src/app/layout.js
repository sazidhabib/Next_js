import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Providers } from "../components/Providers";

export const metadata = {
  title: "Photo Card BD",
  description: "Digital photo card generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-background text-gray-900" suppressHydrationWarning>
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
