import "./globals.css";
import RootLayoutContent from "../components/RootLayoutContent";

export const metadata = {
  title: "BanglaType - বাংলা ফন্ট টাইপোগ্রাফির নতুন দিগন্ত",
  description: "বাংলাদেশের সর্ববৃহৎ ফন্ট ফাউন্ড্রি। বিনামূল্যে বাংলা ফন্ট ডাউনলোড করুন। Download free Bangla fonts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#090a0f] text-gray-100" suppressHydrationWarning>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
