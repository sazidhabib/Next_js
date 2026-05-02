import { Palette, Box, Layers, Package, BookOpen, Sparkles } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PortfolioSection from "../../components/PortfolioSection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import BlogsSection from "../../components/BlogsSection";
import CTASection from "../../components/CTASection";
import { getSettings } from "../../lib/getSettings";

export const metadata = {
  title: "Brand Identity | Next Idea Solutions",
  description: "We help create strong brand identity that separates you from the noise. Build a memorable brand that resonates with your audience.",
};

export default async function BrandIdentityPage() {
  const settings = await getSettings();

  return (
    <>
      <ServiceHero
        icon={<Palette />}
        title={settings.service_brand_identity_hero_title}
        tagline={settings.service_brand_identity_hero_tagline}
        buttonText="Explore Our Service"
      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                {settings.service_brand_identity_about_title}
              </h2>
              <p className="text-lg font-bold text-zinc-600 mb-8 leading-relaxed">
                {settings.service_brand_identity_about_subtitle}
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {settings.service_brand_identity_about_desc}
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src={settings.service_brand_identity_about_image}
                alt="Brand Identity"
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
          title: "WHAT WE OFFER",
          items: (() => {
            try {
              return JSON.parse(settings.service_brand_identity_features || "[]").map((item, idx) => {
                const icons = [<Palette />, <Package />, <BookOpen />];
                return { ...item, icon: icons[idx % icons.length] };
              });
            } catch(e) {
              return [];
            }
          })(),
        }}
        gridCols={3}
      />
      <PortfolioSection />
      <CTASection
        title="Embark on a creative journey with Next Idea Solution."
        description="Let's craft a narrative that captivates and converts."
        buttonText="Ask for A Proposal"
      />
      <ClientsSection />
      <FAQSection />
      <BlogsSection />
    </>
  );
}
