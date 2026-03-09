import { MapPin, Building2, Phone, Star, Globe, TrendingUp } from "lucide-react";
import ServiceHero from "../../../components/ServiceHero";
import ServiceContent from "../../../components/ServiceContent";
import PackagesSection from "../../../components/PackagesSection";
import CTASection from "../../../components/CTASection";

export const metadata = {
  title: "Local SEO Services | Next Idea Solutions",
  description: "Dominate local search results and attract high-intent customers nearby. Optimize your Google Business Profile and rank higher in local searches.",
};

export default function LocalSEOPage() {
  return (
    <>
      <ServiceHero
        icon={MapPin}
        title="Local SEO"
        tagline="Find Customers Near You Consistently"
        description="Be the first one to show up when your customers search your product or service in your local area. Whether you're a retail store, service provider, or multi-location business, our local SEO strategy is customized to grow your visibility where it matters most."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "46% of all Google searches are either for a local product or service. If your business serves specific areas, local SEO helps you stand out in location-based searches. We optimize your Google Business Profile, build citations, and ensure local keyword targeting to help you dominate local search results and maps.",
        }}
        features={{
          title: "Our Local SEO Services",
          items: [
            "Google Business Profile (GMB) Optimization",
            "Local Keyword Research",
            "NAP Consistency & Directory Citations",
            "Local Link Building & Outreach",
            "Reputation Management & Review Boosting",
            "On-page SEO with Geo-Modifiers",
            "Location Page Creation & Optimization",
            "Monthly Reporting & Insights",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Google Business Profile Setup",
              description: "We optimize your GMB profile with accurate business information, photos, and regular posts.",
            },
            {
              title: "Local Citation Building",
              description: "We ensure NAP consistency across top local directories and citation sites.",
            },
            {
              title: "Review Management",
              description: "We help you generate and manage positive reviews to build trust.",
            },
            {
              title: "Local Content Optimization",
              description: "We create and optimize location-specific content to target local keywords.",
            },
          ],
        }}
        relatedServices={[
          { title: "SEO Services", link: "/services/seo", icon: TrendingUp },
          { title: "SEO Audit", link: "/services/seo/seo-audit", icon: Globe },
          { title: "E-commerce SEO", link: "/services/seo/e-commerce-seo", icon: Star },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
