import {
  Sparkles,
  TrendingUp,
  Megaphone,
  Headphones,
  Palette,
  Target,
  CheckCircle,
  Check,
  ArrowRight,
  Video,
  Globe,
  Lightbulb,
  Layers,
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
  TrendingUp: <TrendingUp />,
  Megaphone: <Megaphone />,
  Headphones: <Headphones />,
  Palette: <Palette />,
  Target: <Target />,
  CheckCircle: <CheckCircle />,
  Check: <Check />,
  Video: <Video />,
  Globe: <Globe />,
  Lightbulb: <Lightbulb />,
  Layers: <Layers />,
};

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.service_event_and_activation_hero_title || "Event and Activation | Next Idea Solutions",
    description: settings.service_event_and_activation_hero_tagline || "We help you connect with your audience through creative events and brand activations.",
  };
}

export default async function EventAndActivationPage() {
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

  const features_items = parseJson(settings.service_event_and_activation_features);
  const process_steps = parseJson(settings.service_event_and_activation_process);
  const related_services = parseJson(settings.service_event_and_activation_related_services);

  return (
    <>
      <ServiceHero
        icon={<Megaphone />}
        title={settings.service_event_and_activation_hero_title}
        tagline={settings.service_event_and_activation_hero_tagline}
        image={
          settings.service_event_and_activation_hero_image ||
          "/Event-Activation.png"
        }
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_event_and_activation_about_title}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_event_and_activation_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={
                  settings.service_event_and_activation_about_image ||
                  "/event2.jpeg"
                }
                alt="Event and Activation"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceContent
        overview={{}}
        features={{
          title: settings.service_event_and_activation_features_title || "Why Choose Us",
          items: features_items.map((item) => {
            const getIcon = () => {
              if (ICON_MAP[item.icon] || ICON_MAP[item.icon_name]) return ICON_MAP[item.icon] || ICON_MAP[item.icon_name];
              const title = (item.title || "").toLowerCase();
              if (title.includes("creative")) return <Lightbulb />;
              if (title.includes("strategic") || title.includes("planning")) return <Target />;
              if (title.includes("diverse") || title.includes("offering")) return <Layers />;
              return <Check />;
            };
            return {
              ...item,
              icon: getIcon(),
            };
          }),
        }}
        process={{
          title: settings.service_event_and_activation_process_title || "What We Bring to the Table",
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
