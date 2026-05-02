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
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";

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
};

export default async function VideoProductionPhotographyPage() {
  const settings = await getSettings();

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
        overview={{
          title: "",
          description: "",
        }}
        features={{
          title: service.features_title || "What's Included",
          items: features_items.map((item) => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />,
          })),
        }}
        process={{
          title: service.process_title || "Our Process",
          steps: process_steps,
        }}
        relatedServices={related_services.map((s) => ({
          ...s,
          icon: ICON_MAP[s.icon_name] || <ArrowRight />,
        }))}
      />
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
