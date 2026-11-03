import FloatingNav from "@/components/portfolio/FloatingNav";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import WorkSection from "@/components/portfolio/WorkSection";
import ServicesSection from "@/components/portfolio/ServicesSection";
import PricingSection from "@/components/portfolio/PricingSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";

export const metadata = {
  title: "Sazid Habib — Senior Full-Stack & Next.js Engineer",
  description:
    "Portfolio of Sazid Habib, Senior Full-Stack & Next.js Engineer. 5+ years building scalable, high-converting web applications, custom CMSs, and APIs.",
};

export const viewport = {
  themeColor: "#07070A",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07070A] text-zinc-100 selection:bg-cyan-500/20 selection:text-cyan-200 relative">
      {/* Floating Glass Pill Navigation Bar */}
      <FloatingNav />

      {/* Hero Section */}
      <HeroSection />

      {/* 01 · About Section (Bento) */}
      <AboutSection />

      {/* 02 · Career Path & Interactive Impact */}
      <ExperienceSection />

      {/* 03 · Selected Work */}
      <WorkSection />

      {/* 04 · Engineering Services */}
      <ServicesSection />

      {/* 05 · Pricing & Packages */}
      <PricingSection />

      {/* 06 · Contact & Direct Inquiry */}
      <ContactSection />

      {/* Minimal Footer */}
      <Footer />
    </main>
  );
}
