import { Newspaper, Megaphone, Globe, Award, TrendingUp, Shield } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "Digital PR Services | Next Idea Solutions",
  description: "Elevate your brand's online visibility with strategic digital PR campaigns. Earn media coverage, build backlinks, and improve your SEO with our expert team.",
};

export default function DigitalPRPage() {
  return (
    <>
      <ServiceHero
        icon={Newspaper}
        title="Digital PR"
        tagline="Elevate Your Brand's Online Visibility"
        description="Our Digital PR Services help you earn media coverage, build reputation, trust and backlinks while improving your SEO and online authority. We connect your brand with top journalists, bloggers, and online publications."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Digital PR is a modern form of public relations that focuses on increasing your online presence through strategic content, media outreach and high-authority link placements. Unlike traditional PR, online PR focuses on digital outcomes like search rankings, referral traffic, and brand mentions on Google that bring measurable results.",
        }}
        features={{
          title: "What's Included",
          items: [
            "Media Coverage in Top-Tier News Sites",
            "Organic Backlinks to Improve SEO",
            "Thought Leadership Positioning",
            "Reputation Management",
            "Influencer Features and Brand Mentions",
            "Viral Storytelling and Reactive PR",
            "Press Release Distribution",
            "Media List Building & Outreach",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Audit & Research",
              description: "We study your brand, industry trends, and media landscape to identify opportunities.",
            },
            {
              title: "Strategy & Story Building",
              description: "We develop a pitch-ready PR strategy with strong angles that resonate with journalists.",
            },
            {
              title: "Media Outreach & Pitching",
              description: "Our PR specialists pitch to journalists and influencers to secure coverage.",
            },
            {
              title: "Placement & Reporting",
              description: "We secure features, mentions, and backlinks. You get full reports on results.",
            },
          ],
        }}
        relatedServices={[
          { title: "SEO Services", link: "/services/seo", icon: TrendingUp },
          { title: "Social Media Marketing", link: "/services/social-media-marketing", icon: Megaphone },
          { title: "Brand Identity", link: "/services/brand-identity", icon: Shield },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
