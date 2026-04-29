import { Code2, Smartphone, Shield, Zap, Layout, ShoppingCart, Building2, Target, Sparkles, Palette, TrendingUp, Check, ArrowRight } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import ProjectGrid from "../../components/ProjectGrid";
import BlogsSection from "../../components/BlogsSection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { query } from "@/app/lib/db";
import { notFound } from "next/navigation";

// Icon mapping for rendering
const ICON_MAP = {
  Code2: <Code2 />,
  Smartphone: <Smartphone />,
  Shield: <Shield />,
  Zap: <Zap />,
  Layout: <Layout />,
  ShoppingCart: <ShoppingCart />,
  Building2: <Building2 />,
  Target: <Target />,
  Sparkles: <Sparkles />,
  Palette: <Palette />,
  TrendingUp: <TrendingUp />,
  Check: <Check />,
};

async function getService() {
  const services = await query("SELECT * FROM services WHERE slug = 'web-design-development' AND is_active = 1");
  return services[0];
}

export async function generateMetadata() {
  const service = await getService();
  if (!service) return { title: "Web Design & Development | Next Idea Solutions" };

  return {
    title: service.meta_title || "Web Design & Development | Next Idea Solutions",
    description: service.meta_description || service.tagline,
  };
}

export default async function WebDesignDevelopmentPage() {
  const service = await getService();
  if (!service) return notFound();

  // Parse JSON fields
  const features_items = typeof service.features_items === 'string' ? JSON.parse(service.features_items || '[]') : service.features_items;
  const related_services = typeof service.related_services === 'string' ? JSON.parse(service.related_services || '[]') : service.related_services;

  return (
    <>
      <ServiceHero
        icon={ICON_MAP[service.hero_icon] || <Code2 />}
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
          title: service.features_title || "OUR APPROACH",
          items: features_items.map(item => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />
          })),
        }}
        gridCols={3}
        relatedServices={related_services.map(s => ({
          ...s,
          icon: ICON_MAP[s.icon_name] || <ArrowRight />
        }))}
      />

      <div className="bg-zinc-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest">WHAT WE OFFER</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Ecommerce Solutions</h3>
              <p className="text-zinc-600 text-sm">Empower your business with robust and scalable online stores that drive sales and provide a seamless shopping experience.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Corporate Website Development</h3>
              <p className="text-zinc-600 text-sm">Establish a professional and impactful online presence for your corporation with a custom-designed website.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Landing page creation</h3>
              <p className="text-zinc-600 text-sm">Drive higher conversions for your marketing campaigns with high-impact and optimized landing pages.</p>
            </div>
          </div>
        </div>
      </div>

      <ProjectGrid categoryId={12} title="OUR DESIGNED WEBSITES" />

      <PackagesSection
        title="OUR WEBSITE PACKAGES"
        subtitle="Choose the perfect web solution to scale your online presence"
        footerText="*Prices are subject to project complexity and specific requirements"
        packages={[
          {
            name: "Starter Site",
            setupCost: "৳ 60,000",
            features: [
              { name: "Modern design & development", included: true },
              { name: "Responsive across all devices", included: true },
              { name: "Up to 5 pages", included: true },
              { name: "Basic SEO optimization", included: true },
              { name: "Contact form integration", included: true },
              { name: "Speed optimization", included: true },
              { name: "Social media integration", included: true },
              { name: "20 days support after delivery", included: true },
            ],
          },
          {
            name: "Business Website",
            setupCost: "৳ 80,000",
            features: [
              { name: "Custom design & Unique UI/UX", included: true },
              { name: "Up to 10 pages", included: true },
              { name: "Advanced SEO optimization", included: true },
              { name: "Content Management System (CMS)", included: true },
              { name: "Google Analytics & Search Console", included: true },
              { name: "Performance optimization", included: true },
              { name: "45 days support after delivery", included: true },
            ],
          },
          {
            name: "Ecommerce Solution",
            setupCost: "৳ 100,000",
            features: [
              { name: "Product catalog & Checkout", included: true },
              { name: "Payment gateway integration", included: true },
              { name: "Order & Inventory management", included: true },
              { name: "User accounts & Login", included: true },
              { name: "Discount coupons & Promos", included: true },
              { name: "All features of Business Site", included: true },
              { name: "60 days support after delivery", included: true },
            ],
          },
        ]}
      />

      <ClientsSection />
      <FAQSection />
      <CTASection />
      <BlogsSection />
    </>
  );
}
