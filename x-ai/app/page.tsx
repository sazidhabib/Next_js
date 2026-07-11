"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import PipelineSection from "@/components/sections/PipelineSection";
import DashboardSection from "@/components/sections/DashboardSection";
import SignatureSection from "@/components/sections/SignatureSection";
import Footer from "@/components/layout/Footer";

export default function App() {
  return (
    <div
      className="min-h-screen bg-[#09090B] text-white overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar />
      <HeroSection />
      <PipelineSection />
      <DashboardSection />
      <SignatureSection />
      <Footer />
    </div>
  );
}
