import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Idea Solutions -Your ideas our solution",
  description: "We are an award-winning, certified, 360-degree digital-first advertising agency in Bangladesh. We offer complete end-to-end solutions that drives meaningful results for our clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
