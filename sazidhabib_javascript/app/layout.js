import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Mahbub Sazid Habib | Portfolio",
  description: "Full-Stack Web Developer portfolio showcasing web development, React, Next.js, Node.js, Express, MySQL with Sequelize ORM, and 3D WebGL projects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#03030a] text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
