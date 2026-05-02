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
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";
import CaseStudySection from "../../components/CaseStudySection";
import { getSettings } from "../../lib/getSettings";

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
};

export default async function CreativeConceptExecutionPage() {
  const settings = await getSettings();

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
          title: service.features_title || "WHAT SETS US APART",
          items: features_items.map((item) => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />,
          })),
        }}
        process={{
          title: service.process_title || "WHAT WE OFFER",
          steps: process_steps,
        }}
        relatedServices={related_services.map((s) => ({
          ...s,
          icon: ICON_MAP[s.icon_name] || <ArrowRight />,
        }))}
      />
      <CaseStudySection />
      <CTASection
        title="Embark on a creative journey with Next Idea Solutions."
        description="Let's craft a narrative that captivates and converts."
        buttonText="Ask for A Proposal"
      />
    </>
  );
}
