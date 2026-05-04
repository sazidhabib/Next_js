import DigitalPRHero from "../../components/DigitalPRHero";
import WhatIsDigitalPR from "../../components/WhatIsDigitalPR";
import DigitalPRProcess from "../../components/DigitalPRProcess";
import WhyTrustDigitalPR from "../../components/WhyTrustDigitalPR";
import PartnerSection from "../../components/PartnerSection";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import ServiceContactForm from "../../components/ServiceContactForm";
import { getSettings } from "../../lib/getSettings";

export const metadata = {
  title: "Digital PR Services | Next Idea Solutions",
  description: "Elevate your brand's online visibility with strategic digital PR campaigns. Earn media coverage, build backlinks, and improve your SEO with our expert team.",
};

const mediaPartners = [
  { name: "The Daily Star", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/The_Daily_Star_%28Bangladesh%29_logo.png/220px-The_Daily_Star_%28Bangladesh%29_logo.png" },
  { name: "The Business Standard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_Business_Standard_Logo.svg/2560px-The_Business_Standard_Logo.svg.png" },
  { name: "Prothom Alo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Prothom_Alo_logo.svg/2560px-Prothom_Alo_logo.svg.png" },
  { name: "Jugantor", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jugantor_Logo.svg/1024px-Jugantor_Logo.svg.png" },
];

export default async function DigitalPRPage() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-white">
      <DigitalPRHero 
        title={settings.service_digital_pr_hero_title}
        tagline={settings.service_digital_pr_hero_tagline}
        description={settings.service_digital_pr_hero_description}
      />
      <WhatIsDigitalPR 
        title={settings.service_digital_pr_about_title}
        description={settings.service_digital_pr_about_desc}
      />
      <DigitalPRProcess />
      <WhyTrustDigitalPR />
      <PartnerSection 
        title="Work with One of The Best Digital PR Agencies in Bangladesh" 
        partnersList={mediaPartners} 
      />
      <PortfolioSection />
      <CaseStudySection />
      <ServiceContactForm 
        title="Ready To Launch Your Digital PR Campaign?"
        description="Partner with our digital PR agency and let us create a storytelling PR campaign that grabs the attention of your target audience, builds your brand reputation, and boosts your online visibility."
      />
    </main>
  );
}
