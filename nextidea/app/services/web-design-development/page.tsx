import { Sparkles, TrendingUp, Palette, Code2 } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Web Design & Development | Next Idea Solutions",
  description: "We excel in creating user-friendly, high-converting landing pages, websites, and apps. Modern design meets powerful functionality.",
};

export default function WebDesignDevelopmentPage() {
  return (
    <>
      <ServiceHero
        icon={Code2}
        title="Web Design & Development"
        tagline="Building Digital Experiences That Convert"
        description="We excel at creating user-friendly, high-converting websites, landing pages, and applications that deliver exceptional user experiences."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "In today's digital-first world, your website is often the first interaction customers have with your brand. Our Web Design & Development service combines stunning visual design with robust technical implementation to create websites that not only look beautiful but also drive conversions. We specialize in creating responsive, SEO-friendly, and high-performance web solutions tailored to your business objectives.",
        }}
        features={{
          title: "What&apos;s Included",
          items: [
            "Website Design & UI/UX",
            "Landing Page Design",
            "Responsive Web Development",
            "E-commerce Solutions",
            "CMS Development (WordPress, etc.)",
            "API Integration",
            "Performance Optimization",
            "SEO Implementation",
            "Website Maintenance & Support",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Requirements Gathering",
              description: "We work with you to understand your goals, target audience, and functional requirements.",
            },
            {
              title: "Design & Prototyping",
              description: "We create wireframes and visual designs that align with your brand and user needs.",
            },
            {
              title: "Development",
              description: "Our developers build your website using modern technologies and best practices.",
            },
            {
              title: "Testing & Launch",
              description: "We thoroughly test across devices and browsers before launching your site.",
            },
          ],
        }}
        relatedServices={[
          { title: "Brand Identity", link: "/services/brand-identity", icon: Palette },
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: Sparkles },
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: TrendingUp },
        ]}
      />
      <CTASection />
    </>
  );
}
