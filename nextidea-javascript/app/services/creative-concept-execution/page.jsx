import { Sparkles, TrendingUp, Palette, Headphones } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Creative Concept & Execution | Next Idea Solutions",
  description: "Expert conceptualization and impeccable execution for your brand. We create award-winning campaigns that deliver measurable results.",
};

export default function CreativeConceptExecutionPage() {
  return (
    <>
      <ServiceHero
        icon={Sparkles}
        title="Creative Concept & Execution"
        tagline="Transforming Ideas Into Impactful Campaigns"
        description="We bring your brand vision to life through expert conceptualization and impeccable execution. Our creative team crafts compelling narratives that resonate with your audience and drive measurable results."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Our Creative Concept & Execution service is the foundation of every successful marketing campaign. We combine strategic thinking with creative excellence to develop concepts that not only capture attention but also drive business results. From initial ideation to final execution, our team ensures every touchpoint reflects your brand's unique personality and communicates your key messages effectively.",
        }}
        features={{
          title: "What's Included",
          items: [
            "Brand Strategy Development",
            "Creative Concept Development",
            "Campaign Theme & Messaging",
            "Visual Identity Creation",
            "Content Strategy & Production",
            "Multi-channel Campaign Execution",
            "Creative Direction & Oversight",
            "Performance Optimization",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Discovery & Research",
              description: "We dive deep into understanding your brand, audience, competitors, and market landscape to identify unique opportunities.",
            },
            {
              title: "Strategy & Concept Development",
              description: "Our creative team develops multiple concept directions aligned with your brand objectives and audience insights.",
            },
            {
              title: "Refinement & Approval",
              description: "We refine the selected concept based on your feedback, ensuring every detail aligns with your vision.",
            },
            {
              title: "Execution & Delivery",
              description: "Our team executes the approved concept across all chosen channels, maintaining quality and consistency throughout.",
            },
          ],
        }}
        relatedServices={[
          { title: "Brand Identity", link: "/services/brand-identity", icon: Palette },
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: TrendingUp },
          { title: "Video Production", link: "/services/video-production-photography", icon: Headphones },
        ]}
      />
      <CTASection />
    </>
  );
}
