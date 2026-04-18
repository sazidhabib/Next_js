import { Palette, Box, Layers, Package, BookOpen, Sparkles } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PortfolioSection from "../../components/PortfolioSection";
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
        description="Your brand is more than a logo; it's an experience. Our design service goes beyond aesthetics, diving deep into the core of your brand to create a visual and emotional identity that speaks to your audience."
        image="/Brand-Identity.png"
      />
      <ServiceContent
        overview={{
          title: "Your brand is unique—let's make sure it stands out. Elevate your brand identity with Next Idea Solution",
          description: "Your brand is more than a logo; it's an experience. Next Idea Solution's Brand identity design service goes beyond aesthetics, diving deep into the core of your brand to create a visual and emotional identity that speaks to your audience.",
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
      <BlogsSection />
    </>
  );
}
