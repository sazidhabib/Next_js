import { BookOpen, Calendar, FileText, Gift, Truck, Palette } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Design and Printing Solutions | Next Idea Solutions",
  description: "Premium corporate designs and customized printing solutions. Elevate your brand with diaries, calendars, notebooks, annual reports, and corporate gifts.",
};

export default function DesignPrintingPage() {
  return (
    <>
      <ServiceHero
        icon={BookOpen}
        title="Design and Printing Solutions"
        tagline="Redefine Your Corporate Image"
        description="Elevate your brand presence with custom-designed diaries, calendars, notebooks, annual reports, and corporate gifts—perfect tools to keep your brand top-of-mind and make a lasting impression."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "At Next Idea Solutions, we understand that your brand's image is crucial. That's why we offer top-notch designing and printing services that not only meet but exceed your expectations. From elegant diaries and professional calendars to bespoke corporate gifts, we ensure that every product reflects your brand's identity with precision and creativity.",
        }}
        features={{
          title: "Our Offerings",
          items: [
            "Custom Diaries with branded covers",
            "Desk and Wall Calendars",
            "Professional Notebooks",
            "Annual Reports Design & Print",
            "Corporate Gifts Customization",
            "Brochures & Flyers",
            "Business Cards",
            "Packaging Design & Printing",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Consultation",
              description: "We discuss your requirements, brand guidelines, and design preferences.",
            },
            {
              title: "Design & Proofing",
              description: "Our designers create mockups for your approval before final production.",
            },
            {
              title: "Production",
              description: "We use high-quality materials and printing techniques for a premium finish.",
            },
            {
              title: "Delivery",
              description: "Reliable and punctual delivery to meet your deadlines.",
            },
          ],
        }}
        relatedServices={[
          { title: "Brand Identity", link: "/services/brand-identity", icon: Palette },
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: FileText },
          { title: "Web Design", link: "/services/web-design-development", icon: BookOpen },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
