import { Share2, Users, TrendingUp, Target, Megaphone, Globe, Sparkles, Calendar, Palette, Check, ArrowRight } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { query } from "@/app/lib/db";
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
};

async function getService() {
  const services = await query("SELECT * FROM services WHERE slug = 'social-media-marketing' AND is_active = 1");
  return services[0];
}

export async function generateMetadata() {
  const service = await getService();
  if (!service) return { title: "Social Media Marketing | Next Idea Solutions" };

  return {
    title: service.meta_title || "Social Media Marketing | Next Idea Solutions",
    description: service.meta_description || service.tagline,
  };
}

export default async function SocialMediaMarketingPage() {
  const service = await getService();
  if (!service) return notFound();

  // Parse JSON fields
  const features_items = typeof service.features_items === 'string' ? JSON.parse(service.features_items || '[]') : service.features_items;
  const related_services = typeof service.related_services === 'string' ? JSON.parse(service.related_services || '[]') : service.related_services;

  return (
    <>
      <ServiceHero
        icon={ICON_MAP[service.hero_icon] || <Share2 />}
        title={service.title}
        tagline={service.tagline}
        buttonText="Get A Quote"
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
          title: service.features_title || "What's Included",
          items: features_items.map(item => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />
          })),
        }}
        relatedServices={related_services.map(s => ({
          ...s,
          icon: ICON_MAP[s.icon_name] || <ArrowRight />
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
      <ClientsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
