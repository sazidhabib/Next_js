import { Search, BarChart2, Code, MapPin, ShoppingCart, Smartphone, Youtube, Mic, MessageSquare } from "lucide-react";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import PackagesSection from "../../components/PackagesSection";
import CTASection from "../../components/CTASection";

export const metadata = {
  title: "SEO Services | Next Idea Solutions",
  description: "Future-proof your visibility with professional SEO services. We offer SEO audits, local SEO, e-commerce SEO, and comprehensive search engine optimization strategies.",
};

export default function SEOPage() {
  return (
    <>
      <ServiceHero
        icon={Search}
        title="SEO Services"
        tagline="Future-Proof Your Visibility"
        description="We don't believe in chasing quick wins that disappear with the next algorithm update. We focus on sustainable strategies that build a solid foundation for long-term growth. We understand how search engines work and how they're evolving."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "Whether you are an online or an offline business, in this age of customers searching online to gather information and then make a purchase, you're losing sales if you're not present in front of their eyes when they're searching. Our SEO strategies are built to align with search engine priorities: helpfulness, authority, and relevance.",
        }}
        features={{
          title: "Our SEO Services",
          items: [
            "SEO Audits & Analysis",
            "Keyword Research",
            "On-Page SEO Optimization",
            "Off-Page SEO & Link Building",
            "Technical SEO",
            "Local SEO",
            "E-commerce SEO",
            "App Store Optimization (ASO)",
            "YouTube SEO",
            "Voice Search Optimization",
            "Ask Engine Optimization (AEO)",
          ],
        }}
        process={{
          title: "How We Work",
          steps: [
            {
              title: "Research and Analysis",
              description: "We analyze top competitors, conduct SERP analysis, and study user intent to identify content gaps and opportunities.",
            },
            {
              title: "Strategy Development",
              description: "We create a customized SEO strategy aligned with your business goals, defining success metrics and timelines.",
            },
            {
              title: "Implementation",
              description: "Our SEO experts optimize your website content, improve technical health, and launch targeted link building campaigns.",
            },
            {
              title: "Monitoring and Reporting",
              description: "You receive monthly performance reports highlighting keyword rankings, organic traffic growth, and ROI metrics.",
            },
          ],
        }}
        relatedServices={[
          { title: "SEO Audit", link: "/services/seo/seo-audit", icon: BarChart2 },
          { title: "Local SEO", link: "/services/seo/local-seo", icon: MapPin },
          { title: "E-commerce SEO", link: "/services/seo/e-commerce-seo", icon: ShoppingCart },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
