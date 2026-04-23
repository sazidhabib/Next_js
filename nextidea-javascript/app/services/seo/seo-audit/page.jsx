import { ClipboardList, Search, MapPin, ShoppingCart, CheckCircle2 } from "lucide-react";
import ServiceHero from "../../../components/ServiceHero";
import ServiceContent from "../../../components/ServiceContent";
import PackagesSection from "../../../components/PackagesSection";
import CTASection from "../../../components/CTASection";
import SEOProcess from "../../../components/SEOProcess";

export const metadata = {
  title: "SEO Audit Service | Next Idea Solution",
  description: "Identify and fix what's holding your website back from ranking on the 1st page of Google. Get a comprehensive, human-led SEO audit and roadmap.",
};

export default function SEOAuditPage() {
  const auditPackages = [
    {
      name: "Starter (Basic)",
      features: [
        { name: "Up to 40 Web pages", included: true },
        { name: "Technical Audit", included: true },
        { name: "On-Page Audit", included: true },
        { name: "Off-Page (Backlink) Audit", included: true },
        { name: "Core Web Vitals Assessment", included: true },
        { name: "Prioritized Action Plan", included: true },
        { name: "Competitor Comparison (1)", included: true },
      ],
      mediaSpending: "Small Websites",
      setupCost: "One-time Payment",
      managementFee: "৳ 20,000",
    },
    {
      name: "Growth Hacker (Standard)",
      features: [
        { name: "40 to 100 Web Pages", included: true },
        { name: "Full Technical Deep-Dive", included: true },
        { name: "Content Gap Analysis", included: true },
        { name: "Conversion Rate Review", included: true },
        { name: "Mobile Usability Audit", included: true },
        { name: "Detailed Roadmap (3 Months)", included: true },
        { name: "Competitor Comparison (3)", included: true },
      ],
      mediaSpending: "Medium Businesses",
      setupCost: "Most Popular",
      managementFee: "৳ 50,000",
    },
    {
      name: "Progressive (Custom)",
      features: [
        { name: "More than 100 Pages", included: true },
        { name: "Enterprise-Scale Audit", included: true },
        { name: "Log File Analysis", included: true },
        { name: "JavaScript SEO Review", included: true },
        { name: "International SEO Audit", included: true },
        { name: "Custom Implementation Support", included: true },
        { name: "Full Competitor Landscape", included: true },
      ],
      mediaSpending: "Enterprise & E-commerce",
      setupCost: "Bespoke Solution",
      managementFee: "Custom Pricing",
    },
  ];

  const auditSteps = [
    {
      number: "1",
      title: "Discovery & Analysis",
      description: "We start by crawling your site using industry-leading tools and manually reviewing your Google Search Console data to identify critical errors and indexing issues.",
      color: "red",
    },
    {
      number: "2",
      title: "Technical & On-Page Review",
      description: "Our experts dive deep into your site's code, structure, and content to find issues that hinder search engine understanding and user satisfaction.",
      color: "black",
    },
    {
      number: "3",
      title: "Off-Page & Competitor Audit",
      description: "We analyze your external authority and compare your profile with 3-5 top competitors to find opportunities for growth and authority building.",
      color: "red",
    },
    {
      number: "4",
      title: "Actionable Roadmap",
      description: "You receive a detailed report with prioritized recommendations, categorized into 'Quick Wins' and 'Strategic Improvements' for immediate impact.",
      color: "black",
    },
  ];

  return (
    <>
      <ServiceHero
        icon={<ClipboardList className="w-12 h-12 text-primary" />}
        title="SEO Audit Service"
        tagline="Uncover What's Holding Your Website Back from Ranking"
        description="Is your website struggling to generate organic traffic or leads? Our SEO Audit Service helps you identify exactly what's wrong and gives you a clear roadmap to fix it fast. No automated reports—you get human-led insights and actionable steps."
        image="/SEO-Audit.png"
      />
      <ServiceContent
        overview={{
          title: "The First Step to SEO Dominance",
          description: "An SEO audit is a comprehensive analysis of your website's technical health, content relevance, backlink authority, and user experience. It's the most essential step before starting any SEO campaign. At Next Idea Solution, we follow a rigorous 200+ point checklist to ensure we find every hidden bottleneck, from indexing issues to content gaps. We don't just find problems; we provide a prioritized roadmap for 'Quick Wins' and long-term growth.",
        }}
        features={{
          title: "What's Included in Our SEO Audit",
          items: [
            "Technical Infrastructure & Crawlability Check",
            "Core Web Vitals & Page Speed Performance",
            "Mobile-First Indexing & Responsiveness Analysis",
            "Information Architecture & URL Structure Review",
            "Content Quality & Keyword Gap Analysis",
            "On-Page Optimization (Titles, Meta, Headers)",
            "Image SEO & Schema Markup Assessment",
            "Internal Linking & Site Navigation Audit",
            "Backlink Profile & Spam Link Analysis",
            "Toxic Link Identification & Disavow Support",
            "Competitor Benchmarking & Comparison",
            "Conversion Path & User Experience (UX) Review",
            "Google Search Console & Analytics Audit",
            "Local SEO Presence & Citation Audit",
          ],
        }}
        relatedServices={[
          { title: "SEO Strategy", link: "/services/seo", icon: <Search />},
          { title: "Local SEO", link: "/services/seo/local-seo", icon: <MapPin />},
          { title: "E-commerce SEO", link: "/services/seo/e-commerce-seo", icon: <ShoppingCart />},
        ]}
      />
      <SEOProcess 
        title="Our Proven Audit Methodology"
        steps={auditSteps}
      />
      <PackagesSection 
        title="SEO Audit Packages"
        subtitle="Transparent pricing for websites of all sizes. Choose the audit that fits your scale."
        packages={auditPackages}
        footerText="*All audits are human-led and typically delivered within 7-10 business days."
      />
      <CTASection 
        title="Ready to Fix Your SEO Problems?"
        subtitle="Get a professional audit and stop guessing why your rankings are stuck."
      />
    </>
  );
}
