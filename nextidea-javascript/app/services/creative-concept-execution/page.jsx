import {
  Target,
  Cpu,
  Settings,
  Trophy,
  FileText,
  Star,
  Palette,
  TrendingUp,
  Headphones,
  Sparkles,
  Check,
  ArrowRight,
  Lightbulb,
  Layers,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";
import PortfolioSection from "../../components/PortfolioSection";
import CaseStudySection from "../../components/CaseStudySection";
import { getSettings } from "../../lib/getSettings";
import { notFound } from "next/navigation";

// Icon mapping for rendering
const ICON_MAP = {
  Target: <Target />,
  Cpu: <Cpu />,
  Settings: <Settings />,
  Trophy: <Trophy />,
  FileText: <FileText />,
  Star: <Star />,
  Palette: <Palette />,
  TrendingUp: <TrendingUp />,
  Headphones: <Headphones />,
  Sparkles: <Sparkles />,
  Check: <Check />,
  Lightbulb: <Lightbulb />,
  Layers: <Layers />,
};

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.service_creative_concept_execution_hero_title || "Creative Concept & Execution | Next Idea Solutions",
    description: settings.service_creative_concept_execution_hero_tagline || "Elevate your brand with Next Idea Solutions' creative service that blends strategy, design, and technology to bring your concept to life.",
  };
}

export default async function CreativeConceptExecutionPage() {
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

  const features_items = parseJson(settings.service_creative_concept_execution_features);
  const process_steps = parseJson(settings.service_creative_concept_execution_process);
  const related_services = parseJson(settings.service_creative_concept_execution_related_services);

  return (
    <>
      <ServiceHero
        icon={<Sparkles />}
        title={settings.service_creative_concept_execution_hero_title}
        tagline={settings.service_creative_concept_execution_hero_tagline}
        buttonText="Explore More"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_creative_concept_execution_about_title}
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_creative_concept_execution_about_desc}
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src={settings.service_creative_concept_execution_about_image}
                alt="Creative Concept"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceContent
        overview={{}}
        features={{
          title: settings.service_creative_concept_execution_features_title || "WHAT SETS US APART",
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
          title: settings.service_creative_concept_execution_process_title || "WHAT WE OFFER",
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
      <CTASection
        title="Embark on a creative journey with Next Idea Solutions."
        description="Let's craft a narrative that captivates and converts."
        buttonText="Ask for A Proposal"
      />
    </>
  );
}
