import { ShoppingBag, Tag, CreditCard, TrendingUp, Search, BarChart2, Globe } from "lucide-react";
import ServiceHero from "../../../components/ServiceHero";
import ServiceContent from "../../../components/ServiceContent";
import PackagesSection from "../../../components/PackagesSection";
import CTASection from "../../../components/CTASection";

export const metadata = {
  title: "E-commerce SEO Services | Next Idea Solutions",
  description: "Turn product views into sales with SEO that drives high-intent traffic. Optimize your online store for better rankings and increased conversions.",
};

export default function EcommerceSEOPage() {
  return (
    <>
      <ServiceHero
        icon={ShoppingBag}
        title="E-commerce SEO"
        tagline="Turn Product Views Into Sales"
        description="Selling products online? Then you need more than just a good-looking website. Our E-commerce SEO Services help you rank higher, get discovered by buyers, and turn product pages into conversion machines."
      />
      <ServiceContent
        overview={{
          title: "About This Service",
          description: "E-commerce SEO is the process of optimizing your online store to rank on search engines like Google. This includes keyword research, product page optimization, category page optimization, technical SEO, and link building. We comfortably work with Shopify, WooCommerce, Magento, or any custom platform to drive traffic and improve ROI.",
        }}
        features={{
          title: "Our E-commerce SEO Services",
          items: [
            "Laser-Focused Keyword Strategy",
            "Product Page SEO Optimization",
            "Category Page Optimization",
            "Technical SEO (Site Speed, Mobile)",
            "High-Quality Backlink Building",
            "Structured Data & Schema for Rich Snippets",
            "Internal Linking Strategy",
            "Ongoing SEO Monitoring & Growth Support",
          ],
        }}
        process={{
          title: "Our Process",
          steps: [
            {
              title: "Keyword Research",
              description: "We identify high purchase-intent keywords that attract ready-to-convert customers.",
            },
            {
              title: "Product & Category Optimization",
              description: "We optimize titles, descriptions, and content for maximum visibility and conversions.",
            },
            {
              title: "Technical Fixes",
              description: "We improve site speed, mobile responsiveness, and crawlability.",
            },
            {
              title: "Link Building & Schema",
              description: "We build authority through ethical backlinks and implement rich snippets.",
            },
          ],
        }}
        relatedServices={[
          { title: "SEO Services", link: "/services/seo", icon: TrendingUp },
          { title: "SEO Audit", link: "/services/seo/seo-audit", icon: BarChart2 },
          { title: "Local SEO", link: "/services/seo/local-seo", icon: Globe },
        ]}
      />
      <PackagesSection />
      <CTASection />
    </>
  );
}
