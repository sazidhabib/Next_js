import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "ফন্টবিডি - FREE Bangla Font | বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি",
  description: "বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি। বিনামূল্যে বাংলা ফন্ট ডাউনলোড করুন। Download free Bangla fonts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
