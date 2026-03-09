import { Sparkles, TrendingUp, Code2, Megaphone } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Digital Media Buying | Next Idea Solutions",
  description: "Funnel-driven media buying solutions that generate higher ROI. We optimize your ad spend across all digital platforms.",
};

export default function DigitalMediaBuyingPage() {
  return (
    <>
      <ServiceHero
        icon={TrendingUp}
        title="Digital Media Buying"
        tagline="Data-Driven Campaigns That Deliver Results"
        description="We specialize in funnel-driven media buying solutions that maximize your ROI. Our strategic approach ensures your message reaches the right audience at the right time."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Our Digital Media Buying service is designed to amplify your brand's reach and drive conversions through strategically planned and optimized campaigns. We leverage advanced targeting capabilities, real-time bidding strategies, and continuous performance optimization to ensure every dollar of your advertising budget delivers maximum value.",
        }}
        features={{
          title: "What's Included",
          items: [
            "Media Strategy & Planning",
            "Campaign Setup & Configuration",
            "Audience Targeting & Segmentation",
            "A/B Testing & Creative Optimization",
            "Budget Allocation & Bidding Strategy",
            "Cross-platform Campaign Management",
            "Performance Tracking & Reporting",
            "Conversion Rate Optimization",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Audience Analysis",
              description: "We identify and segment your target audience based on demographics, behaviors, and conversion intent.",
            },
            {
              title: "Channel Selection",
              description: "We recommend the most effective platforms based on your audience and business objectives.",
            },
            {
              title: "Campaign Launch",
              description: "We set up and launch campaigns with optimized targeting and bidding strategies.",
            },
            {
              title: "Continuous Optimization",
              description: "We monitor performance and make data-driven adjustments to improve results over time.",
            },
          ],
        }}
        relatedServices={[
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: Sparkles },
          { title: "Web Development", link: "/services/web-design-development", icon: Code2 },
          { title: "Event & Activation", link: "/services/event-and-activation", icon: Megaphone },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
