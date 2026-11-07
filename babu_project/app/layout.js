import "./globals.css";

export const metadata = {
  title: "BetLuxa Casino | Slots, Live Dealer & Crash Games",
  description: "Next-generation online casino with seamless wallet integration and instant payouts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased bg-slate-950 text-slate-100">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
