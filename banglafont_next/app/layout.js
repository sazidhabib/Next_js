import "./globals.css";
import RootLayoutContent from "../components/RootLayoutContent";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nexttype.com"),
  title: "NextType - বাংলা ফন্ট টাইপোগ্রাফির নতুন দিগন্ত",
  description: "সেরা বাংলা ফন্ট টাইপোগ্রাফি প্ল্যাটফর্ম। বিনামূল্যে বাংলা ফন্ট ডাউনলোড করুন এবং ডিজাইন উন্নত করুন।",
  alternates: {
    canonical: "/",
  },
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
