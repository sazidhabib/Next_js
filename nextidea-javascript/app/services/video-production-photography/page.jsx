import {
  Sparkles,
  Code2,
  Megaphone,
  Headphones,
  Video,
  Camera,
  Clapperboard,
  Users,
  Share2,
  Scissors,
  Zap,
  Plane,
  Check,
  ArrowRight,
  Palette,
  Film,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import ClientsSection from "../../components/ClientsSection";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";
import { notFound } from "next/navigation";

// Icon mapping for rendering
const ICON_MAP = {
  Sparkles: <Sparkles />,
  Video: <Video />,
  Camera: <Camera />,
  Clapperboard: <Clapperboard />,
  Users: <Users />,
  Share2: <Share2 />,
  Scissors: <Scissors />,
  Zap: <Zap />,
  Plane: <Plane />,
  Code2: <Code2 />,
  Megaphone: <Megaphone />,
  Headphones: <Headphones />,
  Check: <Check />,
  Palette: <Palette />,
  Film: <Film />,
};

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.service_video_production_photography_hero_title || "Video Production & Photography | Next Idea Solutions",
    description: settings.service_video_production_photography_hero_tagline || "We provide engaging and high-end video & photography services for your business.",
  };
}

export default async function VideoProductionPhotographyPage() {
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

  const features_items = parseJson(settings.service_video_production_photography_features);
  const process_steps = parseJson(settings.service_video_production_photography_process);
  const related_services = parseJson(settings.service_video_production_photography_related_services);

  return (
    <>
      <ServiceHero
        icon={<Sparkles />}
        title={settings.service_video_production_photography_hero_title}
        tagline={settings.service_video_production_photography_hero_tagline}
        buttonText="Explore Our Service"
        image={
          settings.service_video_production_photography_hero_image ||
          "/Video-Production.png"
        }
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_video_production_photography_about_title}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_video_production_photography_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={
                  settings.service_video_production_photography_about_image ||
                  "/video_photography.jpeg"
                }
                alt="Video Production Photography"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceContent
        overview={{}}
        features={{
          title: settings.service_video_production_photography_features_title || "What's Included",
          items: features_items.map((item) => {
            const getIcon = (text) => {
              const lowerText = text.toLowerCase();
              if (lowerText.includes("commercial") || lowerText.includes("video production")) return <Film />;
              if (lowerText.includes("corporate")) return <Clapperboard />;
              if (lowerText.includes("photography") || lowerText.includes("camera")) return <Camera />;
              if (lowerText.includes("event") || lowerText.includes("coverage")) return <Users />;
              if (lowerText.includes("social media") || lowerText.includes("content creation")) return <Share2 />;
              if (lowerText.includes("post-production") || lowerText.includes("editing")) return <Scissors />;
              if (lowerText.includes("motion") || lowerText.includes("animation")) return <Zap />;
              if (lowerText.includes("drone") || lowerText.includes("aerial")) return <Plane />;
              return <Check />;
            };

            if (typeof item === 'string') return { title: item, icon: getIcon(item) };
            return {
              ...item,
              icon: ICON_MAP[item.icon] || ICON_MAP[item.icon_name] || getIcon(item.title || ""),
            };
          }),
        }}
        process={{
          title: settings.service_video_production_photography_process_title || "Our Process",
          steps: process_steps.map(step => ({
            ...step,
            icon: ICON_MAP[step.icon] || ICON_MAP[step.icon_name] || <Sparkles />
          })),
        }}
        relatedServices={related_services.map((s) => ({
          ...s,
          icon: ICON_MAP[s.icon] || ICON_MAP[s.icon_name] || <ArrowRight />,
        }))}
      />
      <PortfolioSection />
      <CaseStudySection />
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
