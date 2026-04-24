import DesignPrintingHero from "../../components/DesignPrintingHero";
import DesignPrintingShowcase from "../../components/DesignPrintingShowcase";
import DesignPrintingFeatures from "../../components/DesignPrintingFeatures";
import ServiceContactForm from "../../components/ServiceContactForm";

export const metadata = {
  title: "Design and Printing Solutions | Next Idea Solutions",
  description: "Premium corporate designs and customized printing solutions. Elevate your brand with diaries, calendars, notebooks, annual reports, and corporate gifts.",
};

export default function DesignPrintingPage() {
  return (
    <main className="min-h-screen bg-white">
      <DesignPrintingHero />
      <DesignPrintingShowcase />
      <DesignPrintingFeatures />
      <ServiceContactForm 
        title="Get started today!"
        description="Connect with our design and printing experts to elevate your corporate image with premium, custom-made solutions."
      />
    </main>
  );
}
