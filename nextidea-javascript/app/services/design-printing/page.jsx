import DesignPrintingHero from "../../components/DesignPrintingHero";
import DesignPrintingShowcase from "../../components/DesignPrintingShowcase";
import DesignPrintingFeatures from "../../components/DesignPrintingFeatures";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import ServiceContactForm from "../../components/ServiceContactForm";
import { getSettings } from "../../lib/getSettings";

export const metadata = {
  title: "Design and Printing Solutions | Next Idea Solutions",
  description: "Premium corporate designs and customized printing solutions. Elevate your brand with diaries, calendars, notebooks, annual reports, and corporate gifts.",
};

export default async function DesignPrintingPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-white">
      <DesignPrintingHero 
        title={settings.service_design_printing_hero_title}
        tagline={settings.service_design_printing_hero_tagline}
        description={settings.service_design_printing_hero_description}
      />
      <DesignPrintingShowcase />
      <DesignPrintingFeatures />
      <PortfolioSection />
      <CaseStudySection />
      <ServiceContactForm 
        title="Get started today!"
        description="Connect with our design and printing experts to elevate your corporate image with premium, custom-made solutions."
      />
    </main>
  );
}
