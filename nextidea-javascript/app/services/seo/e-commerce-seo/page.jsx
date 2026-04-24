import EcommerceHero from "../../../components/EcommerceHero";
import ScrollingTicker from "../../../components/ScrollingTicker";
import WhatIsEcommerceSEO from "../../../components/WhatIsEcommerceSEO";
import SEOTabbedServices from "../../../components/SEOTabbedServices";
import CaseStudySection from "../../../components/CaseStudySection";
import TrustSection from "../../../components/TrustSection";
import PackagesSection from "../../../components/PackagesSection";
import EcommerceFAQ from "../../../components/EcommerceFAQ";
import ServiceContactForm from "../../../components/ServiceContactForm";

export const metadata = {
  title: "E-commerce SEO Services | Next Idea Solutions",
  description: "Turn product views into sales with SEO that drives high-intent traffic. Optimize your online store for better rankings and increased conversions.",
};

const ecommerceTabs = [
  {
    id: "laser-focused",
    label: "LASER-FOCUSED KEYWORD STRATEGY",
    title: "Laser-Focused Keyword Strategy",
    description: "We go beyond just targeting informational keywords. Our approach identifies and prioritizes high purchase-intent keywords that attract ready-to-convert customers, ensuring your SEO drives real business results.",
    image: "/SEO_img01.jpg",
  },
  {
    id: "seo-product",
    label: "SEO FOR ECOMMERCE PRODUCT PAGES THAT CONVERT",
    title: "SEO For Ecommerce Product Pages That Convert",
    description: "We optimize titles, descriptions, and metadata to turn your product pages into high-ranking, conversion-focused landing pages.",
    image: "/E-commerce-SEO.png",
  },
  {
    id: "technical-seo",
    label: "TECHNICAL SEO OPTIMIZATION",
    title: "Technical SEO Optimization",
    description: "We improve site speed, mobile responsiveness, and crawlability to ensure search engines can easily index your e-commerce site.",
    image: "/SEO-Services.png",
  },
  {
    id: "backlink",
    label: "HIGH-QUALITY BACKLINK BUILDING",
    title: "High-Quality Backlink Building",
    description: "We earn high-quality backlinks from reputable sites to boost your domain authority and improve your rankings.",
    image: "/Local-SEO.jpg",
  },
  {
    id: "schema",
    label: "STRUCTURED DATA & SCHEMA FOR RICH SNIPPETS",
    title: "Structured Data & Schema For Rich Snippets",
    description: "We implement structured data to help search engines understand your products, enabling rich snippets like ratings and prices in search results.",
    image: "/SEO-Audit.png",
  },
  {
    id: "monitoring",
    label: "ONGOING SEO MONITORING & GROWTH SUPPORT",
    title: "Ongoing SEO Monitoring & Growth Support",
    description: "We continuously monitor your SEO performance, adapt to algorithm changes, and provide ongoing support to ensure sustained growth.",
    image: "/Video-Production.png",
  },
];

const ecommercePackages = [
  {
    name: "Starter",
    features: [
      { name: "Ideal for small businesses with limited product listings (up to 100 products)", included: true },
      { name: "Product/Keyword Optimization per Month: Up to 20", included: true },
      { name: "Comprehensive SEO Audit & Action Plan", included: true },
      { name: "Keyword Research for Core Product Pages", included: true },
      { name: "On-Page SEO Optimization (Titles, Meta, Alt Tags)", included: true },
      { name: "Technical SEO Setup (Sitemap, Robots.txt, Indexing)", included: true },
      { name: "Speed & Mobile Optimization", included: true },
      { name: "Competitor SEO Analysis", included: true },
    ],
    managementFee: "৳ 25,000",
  },
  {
    name: "Growth",
    features: [
      { name: "Suitable for mid-sized e-commerce stores with multiple categories & products (101 to 500 products)", included: true },
      { name: "Product/Keyword Optimization per Month: Over 20 to 30", included: true },
      { name: "Keyword Research & Category Optimization", included: true },
      { name: "On-Page, Off-Page, Technical SEO and Mobile Optimization", included: true },
      { name: "Content Planning and Blog Post Suggestions", included: true },
      { name: "Internal Linking Strategy for Products & Categories", included: true },
      { name: "Schema Markup for Rich Snippets (Reviews, Prices)", included: true },
      { name: "Competitor SEO Analysis", included: true },
    ],
    managementFee: "৳ 35,000",
  },
  {
    name: "Pro",
    features: [
      { name: "Suitable for large e-commerce stores or marketplaces with unlimited product listings", included: true },
      { name: "Product/Keyword Optimization per Month: More than 30", included: true },
      { name: "Competitor SEO Analysis", included: true },
      { name: "Full Technical SEO Optimization (Core Web Vitals, Site Architecture)", included: true },
      { name: "Advanced Content Strategy & Topic Clusters", included: true },
      { name: "Conversion Rate Optimization (CRO) Insights", included: true },
      { name: "International/Multilingual SEO (if needed)", included: true },
      { name: "Dedicated Ecommerce SEO Consultant", included: true },
    ],
    managementFee: "Starts From ৳ 40,000",
  },
];

export default function EcommerceSEOPage() {
  return (
    <main className="min-h-screen bg-white">
      <EcommerceHero />
      <ScrollingTicker />
      <WhatIsEcommerceSEO />
      <SEOTabbedServices 
        title="Growth-Driven E-Commerce SEO By The Leading SEO Experts In The Country"
        description="Our holistic SEO approach covers everything from market research, competitor analysis, content planning to technical fixing, conversion rate optimization and link building which ensures sustainable growth from every angle. The team of our proven ecommerce SEO experts understands both SEO and online buying psychology. The kind of visibility that brings long-term growth."
        servicesTabs={ecommerceTabs}
      />
      <CaseStudySection />
      <TrustSection />
      <PackagesSection 
        title="Our Ecommerce SEO Packages" 
        subtitle="We offer flexible and scalable ecommerce SEO packages that match your business stage and goals"
        packages={ecommercePackages} 
      />
      <EcommerceFAQ />
      <ServiceContactForm 
        title="Ready To Bring Traffic And Conversions?"
        description="Partner with Next Idea, the leading SEO agency in Bangladesh. We're dedicated to scaling your e-commerce business with proven, data-driven SEO strategies that deliver measurable ROI."
      />
    </main>
  );
}
