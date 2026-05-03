import {
  Palette,
  Box,
  Layers,
  Package,
  BookOpen,
  Sparkles,
  Check,
  ArrowRight,
  Code2,
  Megaphone,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import BlogsSection from "../../components/BlogsSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";
import { notFound } from "next/navigation";

// Icon mapping for rendering
const ICON_MAP = {
  Palette: <Palette />,
  Box: <Box />,
  Layers: <Layers />,
  Package: <Package />,
  BookOpen: <BookOpen />,
  Sparkles: <Sparkles />,
  Check: <Check />,
  Code2: <Code2 />,
  Megaphone: <Megaphone />,
};

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.service_brand_identity_hero_title || "Brand Identity | Next Idea Solutions",
    description: settings.service_brand_identity_hero_tagline || "We help creating strong brand identity that will separate you from the noise.",
  };
}

export default async function BrandIdentityPage() {
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

  const features_items = parseJson(settings.service_brand_identity_features);
  const related_services = parseJson(settings.service_brand_identity_related_services);

  return (
    <>
      <ServiceHero
        icon={<Palette />}
        title={settings.service_brand_identity_hero_title}
        tagline={settings.service_brand_identity_hero_tagline}
        buttonText="Explore Our Service"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_brand_identity_about_title}
              </h2>
              <p className="text-lg font-bold text-zinc-600 mb-8 leading-relaxed">
                {settings.service_brand_identity_about_subtitle}
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_brand_identity_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={settings.service_brand_identity_about_image}
                alt="Brand Identity"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceContent
        overview={{}}
        features={{
          title: settings.service_brand_identity_features_title || "WHAT WE OFFER",
          items: features_items.map((item, idx) => {
            const icons = [<Palette />, <Package />, <BookOpen />];
            return { 
              ...item, 
              icon: ICON_MAP[item.icon] || ICON_MAP[item.icon_name] || icons[idx % icons.length] 
            };
          }),
        }}
        gridCols={3}
        relatedServices={related_services.map((s) => ({
          ...s,
          icon: ICON_MAP[s.icon] || ICON_MAP[s.icon_name] || <ArrowRight />,
        }))}
      />
      <PortfolioSection />
      <CaseStudySection />
      <CTASection
        title="Embark on a creative journey with Next Idea Solution."
        description="Let's craft a narrative that captivates and converts."
        buttonText="Ask for A Proposal"
      />
      <ClientsSection />
      <FAQSection />
      <BlogsSection />
    </>
  );
}
