import {
  Code2,
  Smartphone,
  Shield,
  Zap,
  Layout,
  ShoppingCart,
  Building2,
  Target,
  Sparkles,
  Palette,
  TrendingUp,
  Check,
  ArrowRight,
} from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import ProjectGrid from "../../components/ProjectGrid";
import BlogsSection from "../../components/BlogsSection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";

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

export default async function WebDesignDevelopmentPage() {
  const settings = await getSettings();

  let offerFeatures = [];
  try {
    offerFeatures = JSON.parse(
      settings.service_web_design_development_offer_features || "[]",
    );
  } catch (e) {}

  return (
    <>
      <ServiceHero
        icon={<Code2 />}
        title={settings.service_web_design_development_hero_title}
        tagline={settings.service_web_design_development_hero_tagline}
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_web_design_development_about_title}
              </h2>
              <p className="text-lg font-bold text-zinc-600 mb-8 leading-relaxed">
                {settings.service_web_design_development_about_subtitle}
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_web_design_development_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={settings.service_web_design_development_about_image}
                alt="Web Development"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <ServiceContent
        overview={{}}
        features={{
          title: service.features_title || "OUR APPROACH",
          items: features_items.map((item) => ({
            ...item,
            icon: ICON_MAP[item.icon_name] || <Check />,
          })),
        }}
        gridCols={3}
        relatedServices={related_services.map((s) => ({
          ...s,
          icon: ICON_MAP[s.icon_name] || <ArrowRight />,
        }))}
      />

      <div className="bg-zinc-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest">
            {settings.service_web_design_development_offer_title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {offerFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  {idx === 0 ? (
                    <ShoppingCart className="w-8 h-8" />
                  ) : idx === 1 ? (
                    <Building2 className="w-8 h-8" />
                  ) : (
                    <Target className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-600 text-sm">{feature.description}</p>
              </div>
            ))}
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
