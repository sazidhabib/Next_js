import { ClipboardList, Search, BarChart, FileText, Settings, Link2 } from "lucide-react";
import ServiceHero from "../../../components/ServiceHero";
import ServiceContent from "../../../components/ServiceContent";
import PackagesSection from "../../../components/PackagesSection";
import CTASection from "../../../components/CTASection";

export const metadata = {
  title: "SEO Audit Service | Next Idea Solutions",
  description: "Comprehensive SEO audit to uncover what's holding your website back. Get actionable insights and a roadmap to improve your rankings.",
};

export default function SEOAuditPage() {
  return (
    <>
      <ServiceHero
        icon={ClipboardList}
        title="SEO Audit Service"
        tagline="Uncover What's Holding You Back"
        description="Is your website struggling to generate organic traffic or leads? Our SEO Audit Service helps you identify what's wrong and gives you a roadmap to fix it fast. No automated report—you get human insights and actionable steps."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "An SEO audit is a comprehensive analysis of your website's technical setup, content, backlinks, and user experience to find SEO errors and optimization gaps. It's the first and most essential step before starting any SEO campaign. Our audit follows a proven SEO audit checklist ensuring you get Quick Wins first and then slowly get into the complex works.",
        }}
        features={{
          title: "What's Included in Our SEO Audit",
          items: [
            "Keyword Analysis & Gap Analysis",
            "Content Audit",
            "Missing Title Tags and Meta Descriptions",
            "Duplicate Content & Thin Content Analysis",
            "Product & Category Page Analysis",
            "Internal Link Analysis",
            "Missing Image Alt Text",
            "Site Structure & Crawl Analysis",
            "Page Speed Overview",
            "Broken Link & Orphan Page Checking",
            "Sitemaps & Redirects",
            "Schema Markup Check",
            "Core Web Vitals Assessment",
            "Mobile Responsiveness",
            "Competitor Backlink Analysis",
            "Spam Link Analysis",
          ],
        }}
        process={{
          title: "Our Audit Process",
          steps: [
            {
              title: "Technical Analysis",
              description: "We analyze site structure, crawlability, page speed, mobile responsiveness, and Core Web Vitals.",
            },
            {
              title: "On-Page Analysis",
              description: "We check content quality, meta tags, internal linking, and keyword optimization.",
            },
            {
              title: "Off-Page Analysis",
              description: "We analyze your backlink profile and compare it with 3-4 competitors.",
            },
            {
              title: "Reporting",
              description: "We provide a comprehensive report with prioritized action items and quick wins.",
            },
          ],
        }}
        relatedServices={[
          { title: "SEO Services", link: "/services/seo", icon: Search },
          { title: "Local SEO", link: "/services/seo/local-seo", icon: BarChart },
          { title: "E-commerce SEO", link: "/services/seo/e-commerce-seo", icon: FileText },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
