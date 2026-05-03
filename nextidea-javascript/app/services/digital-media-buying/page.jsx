import {
  TrendingUp,
  Code2,
  Megaphone,
  Sparkles,
  Target,
  Layers,
  Zap,
  Filter,
  BarChart,
  Wallet,
  Check,
  ArrowRight,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import ClientsSection from "../../components/ClientsSection";
import PartnerSection from "../../components/PartnerSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";

export const metadata = {
  title: "Digital Media Buying | Next Idea Solutions",
  description:
    "Funnel-driven media buying solutions that generate higher ROI. We optimize your ad spend across all digital platforms.",
};

export default async function DigitalMediaBuyingPage() {
  const settings = await getSettings();

  return (
    <>
      <ServiceHero
        icon={<TrendingUp />}
        title={settings.service_digital_media_buying_hero_title}
        tagline={settings.service_digital_media_buying_hero_tagline}

      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_digital_media_buying_about_title}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_digital_media_buying_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={
                  settings.service_digital_media_buying_about_image ||
                  "/digitalmedia.jpeg"
                }
                alt="Digital Media Buying"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
      <ServiceContent
        overview={{}}
        features={{
          title: "Why Choose Us",
          items: (() => {
            try {
              return JSON.parse(
                settings.service_digital_media_buying_features || "[]",
              ).map((item, idx) => {
                const icons = [
                  <Target className="w-6 h-6" />,
                  <Layers className="w-6 h-6" />,
                  <Zap className="w-6 h-6" />,
                  <Filter className="w-6 h-6" />,
                  <BarChart className="w-6 h-6" />,
                  <Wallet className="w-6 h-6" />,
                ];
                return { ...item, icon: icons[idx % icons.length] };
              });
            } catch (e) {
              return [];
            }
          })(),
        }}
        relatedServices={[
          {
            title: "Creative Concept",
            link: "/services/creative-concept-execution",
            icon: <TrendingUp />,
          },
          {
            title: "Web Development",
            link: "/services/web-design-development",
            icon: <Code2 />,
          },
          {
            title: "Event & Activation",
            link: "/services/event-and-activation",
            icon: <Megaphone />,
          },
        ]}
      />
      <PackagesSection />
      <PortfolioSection />
      <CaseStudySection />
      <ClientsSection />
      <PartnerSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
