import { 
  Sparkles, Video, Camera, Clapperboard, Users, Share2, 
  Scissors, Zap, Plane, Code2, Megaphone, Headphones, 
  Target, Cpu, Trophy, FileText, Star, Palette, TrendingUp, Check
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { query } from "@/app/lib/db";
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
  Target: <Target />,
  Cpu: <Cpu />,
  Trophy: <Trophy />,
  FileText: <FileText />,
  Star: <Star />,
  Palette: <Palette />,
  TrendingUp: <TrendingUp />,
  Check: <Check />,
};

async function getService(slug) {
  const services = await query("SELECT * FROM services WHERE slug = ? AND is_active = 1", [slug]);
  return services[0];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};

  return {
    title: service.meta_title || `${service.title} | Next Idea Solutions`,
    description: service.meta_description || service.tagline,
  };
}

export default async function DynamicServicePage({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    // If not in DB, it might still be a static page in the filesystem.
    // However, since we are moving to dynamic, we can handle it here.
    // For now, let's return null or trigger notFound if we want to force DB.
    notFound();
  }

  // Parse JSON fields
  const features_items = typeof service.features_items === 'string' ? JSON.parse(service.features_items || '[]') : service.features_items;
  const process_steps = typeof service.process_steps === 'string' ? JSON.parse(service.process_steps || '[]') : service.process_steps;
  const related_services = typeof service.related_services === 'string' ? JSON.parse(service.related_services || '[]') : service.related_services;

  return (
    <>
      <ServiceHero
        icon={ICON_MAP[service.hero_icon] || <Sparkles />}
        title={service.title}
        tagline={service.tagline}
        buttonText="Explore Our Service"
        image={service.hero_image}
      />
      
      {service.about_title && (
        <section className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                  {service.about_title}
                </h2>
                <div 
                  className="text-lg text-zinc-600 mb-8 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: service.about_description }}
                />
                <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  GET A FREE QUOTE
                </button>
              </div>
              <div className="md:w-1/2">
                {service.about_image && (
                  <img
                    src={service.about_image}
                    alt={service.about_title}
                    className="w-full h-auto drop-shadow-2xl rounded-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <ServiceContent
        overview={{
          title: "", // We use the About section above instead
          description: "",
        }}
        features={{
          title: service.features_title || "What's Included",
          items: features_items.map(item => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />
          })),
        }}
        process={{
          title: service.process_title || "Our Process",
          steps: process_steps,
        }}
        relatedServices={related_services.map(s => ({
          ...s,
          icon: ICON_MAP[s.icon_name] || <ArrowRight />
        }))}
      />
      
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
