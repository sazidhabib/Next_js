import {
  Share2,
  Users,
  TrendingUp,
  Target,
  Megaphone,
  Globe,
  Sparkles,
  Calendar,
  Palette,
  Check,
  ArrowRight,
  Video,
  Filter,
  BarChart2,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";
import { notFound } from "next/navigation";

// Icon mapping for rendering
const ICON_MAP = {
  Share2: <Share2 />,
  Users: <Users />,
  TrendingUp: <TrendingUp />,
  Target: <Target />,
  Megaphone: <Megaphone />,
  Globe: <Globe />,
  Sparkles: <Sparkles />,
  Calendar: <Calendar />,
  Palette: <Palette />,
  Check: <Check />,
  Video: <Video />,
  Filter: <Filter />,
  BarChart2: <BarChart2 />,
};

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.service_social_media_marketing_hero_title || "Social Media Marketing | Next Idea Solutions",
    description: settings.service_social_media_marketing_hero_tagline || "Engage with your audience and grow your brand presence across all social platforms.",
  };
}

export default async function SocialMediaMarketingPage() {
  const settings = await getSettings();

  if (!settings) return notFound();

  // Helper for parsing JSON safely
  const parseJson = (val, fallback = []) => {
    if (!val) return fallback;
    try {
      return typeof val === 'string' ? JSON.parse(val) : val;
    } catch (e) {
      console.error("Error parsing JSON setting:", e);
      return fallback;
    }
  };

  const features_items = parseJson(settings.service_social_media_marketing_features);
  const related_services = parseJson(settings.service_social_media_marketing_related_services);

  return (
    <>
      <ServiceHero
        icon={<Share2 />}
        title={settings.service_social_media_marketing_hero_title}
        tagline={settings.service_social_media_marketing_hero_tagline}
        image={
          settings.service_social_media_marketing_hero_image ||
          "/Social-Media.png"
        }
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_social_media_marketing_about_title}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_social_media_marketing_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={
                  settings.service_social_media_marketing_about_image ||
                  "/digitalmedia.jpeg"
                }
                alt="Social Media Marketing"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceContent
        overview={{}}
        features={{
          title: settings.service_social_media_marketing_features_title || "What's Included",
          items: features_items.map((item) => ({
            ...item,
            icon: ICON_MAP[item.icon] || ICON_MAP[item.icon_name] || <Check />,
          })),
        }}
        relatedServices={related_services.map((s) => ({
          ...s,
          icon: ICON_MAP[s.icon] || ICON_MAP[s.icon_name] || <ArrowRight />,
        }))}
      />
      <PackagesSection
        title="Let's Engage and Grow Together"
        subtitle="Choose the social media strategy that fits your growth goals"
        footerText="*Media budget is not included in the plan"
        packages={[
          {
            name: "Organic",
            buttonText: "Schedule A Call",
            features: [
              { name: "Monthly Strategy Development", included: true },
              { name: "Monthly Content Calendar", included: true },
              { name: "Media Buying (Paid Ads)", included: false },
              { name: "Sales Funnel Development", included: false },
            ],
          },
          {
            name: "Optimal",
            buttonText: "Schedule A Call",
            features: [
              { name: "Monthly Strategy Development", included: true },
              { name: "Monthly Content Calendar", included: true },
              { name: "Media Buying (Paid Ads)", included: true },
              { name: "Sales Funnel Development", included: false },
            ],
          },
          {
            name: "Turbo",
            buttonText: "Schedule A Call",
            features: [
              { name: "Monthly Strategy Development", included: true },
              { name: "Monthly Content Calendar", included: true },
              { name: "Media Buying (Paid Ads)", included: true },
              { name: "Sales Funnel Development", included: true },
            ],
          },
        ]}
      />
      <PortfolioSection />
      <CaseStudySection />
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
