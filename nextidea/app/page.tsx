import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CredibilitySection from "./components/CredibilitySection";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import CaseStudySection from "./components/CaseStudySection";
import ClientLogosSection from "./components/ClientLogosSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <CredibilitySection />
        <ServicesSection />
        <PortfolioSection />
        <CaseStudySection />
        <ClientLogosSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
