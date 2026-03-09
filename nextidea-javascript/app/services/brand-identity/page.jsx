import { Sparkles, Palette, Code2, Headphones } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Brand Identity | Next Idea Solutions",
  description: "We help create strong brand identity that separates you from the noise. Build a memorable brand that resonates with your audience.",
};

export default function BrandIdentityPage() {
  return (
    <>
      <ServiceHero
        icon={Palette}
        title="Brand Identity"
        tagline="Building Brands That Stand Out"
        description="We help create a strong, distinctive brand identity that sets you apart from the competition and resonates with your target audience."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Your brand is more than just a logo - it's the entire perception customers have of your business. Our Brand Identity service encompasses everything from visual elements to brand voice and messaging. We work closely with you to develop a cohesive brand identity that communicates your values, differentiates you from competitors, and creates lasting impressions in the minds of your audience.",
        }}
        features={{
          title: "What&apos;s Included",
          items: [
            "Logo Design & Visual Identity",
            "Brand Color Palette & Typography",
            "Brand Guidelines & Style Guide",
            "Brand Messaging & Voice",
            "Tagline & Slogan Development",
            "Brand Application (Stationery, etc.)",
            "Brand Strategy & Positioning",
            "Brand Identity Guidelines",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Brand Discovery",
              description: "We conduct in-depth interviews and research to understand your brand's essence, values, and goals.",
            },
            {
              title: "Visual Exploration",
              description: "Our design team creates multiple visual directions exploring different ways to express your brand.",
            },
            {
              title: "Refinement",
              description: "We refine the chosen direction based on your feedback, perfecting every detail.",
            },
            {
              title: "Delivery & Guidelines",
              description: "We deliver all brand assets and create comprehensive guidelines for consistent application.",
            },
          ],
        }}
        relatedServices={[
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: Sparkles },
          { title: "Web Development", link: "/services/web-design-development", icon: Code2 },
          { title: "Video Production", link: "/services/video-production-photography", icon: Headphones },
        ]}
      />
      <CTASection />
    </>
  );
}
