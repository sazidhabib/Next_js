import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import CaseStudySection from "./components/CaseStudySection";
import StatsSection from "./components/StatsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import ClientsSection from "./components/ClientsSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <ServicesSection />
        <PortfolioSection />
        <CaseStudySection />
        <ClientsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
