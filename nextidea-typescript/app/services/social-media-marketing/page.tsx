import { Share2, Users, TrendingUp, Target, Megaphone, Globe } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Social Media Marketing | Next Idea Solutions",
  description: "Strategic social media marketing that builds brand awareness, drives engagement, and generates results. Connect with your audience through compelling content.",
};

export default function SocialMediaMarketingPage() {
  return (
    <>
      <ServiceHero
        icon={Share2}
        title="Social Media Marketing"
        tagline="Connect With Your Audience Where They Spend Their Time"
        description="Every 6 out of 11 people use social media to research products before making a purchase decision. We help brands tell their story with strategic, creative social media posts, videos, stories, and reels that generate engagement and drive results."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Social media marketing is the new word-of-mouth. Staying on top of social media is an effective way to build people's trust and can help you establish as a prominent brand over time. We take a results-oriented approach to generate more engagement, increase your reach, drive more website traffic, and support your broader business objectives through social media.",
        }}
        features={{
          title: "What's Included",
          items: [
            "Monthly Strategy Development",
            "Content Calendar Planning",
            "Organic Social Media Management",
            "Paid Social Media Advertising",
            "Community Management",
            "Social Media Analytics & Reporting",
            "Influencer Marketing",
            "Content Creation & Design",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Audience Research",
              description: "We identify your target audience, understand their behavior, and determine the best platforms to reach them.",
            },
            {
              title: "Strategy Development",
              description: "We create a comprehensive social media strategy aligned with your business goals and brand voice.",
            },
            {
              title: "Content Creation",
              description: "Our team produces engaging posts, videos, stories, and reels tailored to each platform.",
            },
            {
              title: "Community Engagement",
              description: "We actively engage with your audience, respond to comments, and build lasting relationships.",
            },
            {
              title: "Performance Optimization",
              description: "We analyze results and continuously optimize our strategy for better engagement and ROI.",
            },
          ],
        }}
        relatedServices={[
          { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: Megaphone },
          { title: "Creative Concept", link: "/services/creative-concept-execution", icon: Globe },
          { title: "Brand Identity", link: "/services/brand-identity", icon: Target },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
