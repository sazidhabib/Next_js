import { Geist, Geist_Mono, Hind_Siliguri, Noto_Serif_Bengali } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
});

const notoSerifBengali = Noto_Serif_Bengali({
  weight: ["400", "600", "700", "900"],
  subsets: ["bengali", "latin"],
  variable: "--font-noto-serif-bengali",
});

export const metadata = {
  title: "আজকের পত্রিকা | ই-পেপার সংস্করণ",
  description: "আজকের পত্রিকা ই-পেপার - পড়ুন অনলাইন ডিজিটাল সংস্করণ",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${notoSerifBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f1f5f9] text-slate-800 font-sans">{children}</body>
    </html>
  );
}
