import { Sparkles, TrendingUp, Megaphone, Headphones, Palette, Target, CheckCircle, Check, ArrowRight } from "lucide-react";
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
  TrendingUp: <TrendingUp />,
  Megaphone: <Megaphone />,
  Headphones: <Headphones />,
  Palette: <Palette />,
  Target: <Target />,
  CheckCircle: <CheckCircle />,
  Check: <Check />,
};

async function getService() {
  const services = await query("SELECT * FROM services WHERE slug = 'event-and-activation' AND is_active = 1");
  return services[0];
}

export async function generateMetadata() {
  const service = await getService();
  if (!service) return { title: "Event & Activation | Next Idea Solution" };

  return {
    title: service.meta_title || "Event & Activation | Next Idea Solution",
    description: service.meta_description || service.tagline,
  };
}

export default async function EventAndActivationPage() {
  const service = await getService();
  if (!service) return notFound();

  // Parse JSON fields
  const features_items = typeof service.features_items === 'string' ? JSON.parse(service.features_items || '[]') : service.features_items;
  const process_steps = typeof service.process_steps === 'string' ? JSON.parse(service.process_steps || '[]') : service.process_steps;
  const related_services = typeof service.related_services === 'string' ? JSON.parse(service.related_services || '[]') : service.related_services;

  return (
    <>
      <ServiceHero
        icon={ICON_MAP[service.hero_icon] || <Megaphone />}
        title={service.title}
        tagline={service.tagline}
        image={service.hero_image}
      />
      
      {service.about_title && (
        <section className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                  {service.about_title.split(' ').map((word, i, arr) => 
                    i === arr.length - 1 ? <span key={i} className="text-primary">{word}</span> : word + ' '
                  )}
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
        overview={{}}
        features={{
          title: service.features_title || "Why Choose Us",
          items: features_items.map(item => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />
          })),
        }}
        process={{
          title: service.process_title || "What We Bring to the Table",
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
