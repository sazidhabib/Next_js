"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, List, BarChart3, TrendingUp as TrendingUpIcon, FileText, MapPin, ShoppingCart, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export default function MostofaPipeCaseStudy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        <ServiceHero
          icon={<TrendingUp className="w-10 h-10" />}
          title="From Zero to High-Intent Traffic"
          tagline="SEO Success Story: Mostofa Pipe"
          description="How we helped Mostofa Pipe build SEO visibility from zero to high-intent traffic in just 5 months, increasing organic traffic by 480%."
          image="case-study.jpg"
        />

        <ServiceContent
          overview={{
            title: "The Challenge",
            description: "Mostofa Pipe, a leading manufacturer of PVC pipes and fittings, had virtually no online presence in search engines. Despite being a market leader offline, their website wasn't ranking for any relevant keywords, making it nearly impossible for potential customers to find them through organic search. They faced zero keyword rankings and significant technical SEO issues preventing proper indexing."
          }}
          features={{
            title: "Our Solution",
            items: [
              "Comprehensive Technical SEO Audit & Fixes",
              "Site Speed & Mobile Responsiveness Optimization",
              "Advanced Keyword Research & Commercial Intent Strategy",
              "On-Page Optimization for Target Industry Terms",
              "Content Marketing & Strategic Link Building",
              "Schema Markup Implementation",
              "Industry-Specific Local SEO Targeting"
            ]
          }}
          process={{
            title: "The Results",
            steps: [
              {
                title: "480% Organic Traffic Growth",
                description: "Transformed from zero visibility to a heavy steady stream of industry-specific organic traffic."
              },
              {
                title: "85+ Keywords on Page 1",
                description: "Achieved top-tier rankings for high-competition keywords related to PVC pipes and construction."
              },
              {
                title: "12 Keywords in Top 3",
                description: "Dominance in search results for the most valuable commercial intent search terms."
              },
              {
                title: "320% Increase in Lead Quality",
                description: "The traffic generated was highly targeted, leading to a massive spike in qualified business inquiries."
              }
            ]
          }}
          relatedServices={[
            { title: "SEO Audit", link: "/services/seo/seo-audit", icon: <FileText className="w-8 h-8 text-primary mb-4" /> },
            { title: "Local SEO", link: "/services/seo/local-seo", icon: <MapPin className="w-8 h-8 text-primary mb-4" /> },
            { title: "E-commerce SEO", link: "/services/seo/e-commerce-seo", icon: <ShoppingCart className="w-8 h-8 text-primary mb-4" /> },
          ]}
        />

        {/* Results Highlights (Custom Section for Case Study) */}
        <section className="py-20 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">480%</div>
                <div className="text-zinc-600 font-medium font-sans">Traffic Increase</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <BarChart3 className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">85+</div>
                <div className="text-zinc-600 font-medium font-sans">Page 1 Keywords</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <List className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">12</div>
                <div className="text-zinc-600 font-medium font-sans">Top 3 Rankings</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <TrendingUpIcon className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">320%</div>
                <div className="text-zinc-600 font-medium font-sans">Lead Quality</div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}