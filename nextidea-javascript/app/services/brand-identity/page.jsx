import { Palette, Box, Layers, Package, BookOpen, Sparkles } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PortfolioSection from "../../components/PortfolioSection";
import ClientsSection from "../../components/ClientsSection";
import FAQSection from "../../components/FAQSection";
import BlogsSection from "../../components/BlogsSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Brand Identity | Next Idea Solutions",
  description: "We help create strong brand identity that separates you from the noise. Build a memorable brand that resonates with your audience.",
};

export default function BrandIdentityPage() {
  return (
    <>
      <ServiceHero
        icon={<Palette />}
        title="Brand Identity"
        tagline="We help creating strong brand identity that will separate you from the noise."
        buttonText="Explore Our Service"


      />
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6 leading-tight">
                About this <span className="text-primary">Service</span>
              </h2>
              <p className="text-lg font-bold text-zinc-600 mb-8 leading-relaxed">
                Your brand is unique—let's make sure it stands out. Elevate your brand identity with Next Idea Solution
              </p>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                Your brand is more than a logo; it's an experience. Next Idea Solution's Brand identity design service goes beyond aesthetics, diving deep into the core of your brand to create a visual and emotional identity that speaks to your audience.
              </p>
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                GET A FREE QUOTE
              </button>
            </div>
            <div className="md:w-1/2">
              <img
                src="/brandidentity.jpeg"
                alt="Local SEO Illustration"
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
          items: [
            {
              title: "Logo Design & Visual Elements",
              description: "Craft a distinctive and memorable logo that embodies your brand essence.",
              icon: <Palette />,
            },
            {
              title: "Branding Material & Packaging",
              description: "Design & print your unique branding materials with out of the box design and execution.",
              icon: <Package />,
            },
            {
              title: "Brand Guidelines",
              description: "Establish a cohesive visual identity with comprehensive brand guidelines.",
              icon: <BookOpen />,
            },
          ],
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
