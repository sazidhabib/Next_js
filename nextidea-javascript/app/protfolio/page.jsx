import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PortfolioPage from "../components/PortfolioPage";

export const metadata = {
  title: "Portfolio | Next Idea Solutions",
  description: "Explore our latest projects, demos, and case studies. High-performance solutions designed to scale your business.",
};

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen bg-zinc-50 pt-24 pb-20 flex items-center justify-center">Loading...</div>}>
          <PortfolioPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
