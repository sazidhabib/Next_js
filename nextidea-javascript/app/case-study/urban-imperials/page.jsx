"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Target, CheckCircle2, List, BarChart3, TrendingUp, Sparkles, Building2, Layout, Landmark, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export default function UrbanImperialsCaseStudy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <ServiceHero
          icon={<Target className="w-10 h-10" />}
          title="300X ROAS for Urban Imperials"
          tagline="Real Estate Marketing Success"
          description="How we helped GEEKY Social drive unprecedented returns for a premium real estate project in Dhaka through hyper-targeted digital campaigns."
          image="https://geekysocial.com/wp-content/uploads/2026/01/Imperial_Areal-view_01_Post-scaled-1.jpg"
        />

        <ServiceContent
          overview={{
            title: "The Challenge",
            description: "Urban's Premium Real Estate Project in Dhaka faced intense competition in a saturated luxury property market. They struggled to reach high-net-worth individuals through traditional channels and needed a sophisticated digital strategy that could deliver massive ROI for high-ticket sales."
          }}
          features={{
            title: "Our Solution",
            items: [
              "Hyper-Targeted Audience Segmentation",
              "Precision Targeting for High-Net-Worth Individuals",
              "High-Quality Visual & Lifestyle Content Strategy",
              "3D Renderings & Virtual Tours Integration",
              "Conversion-Optimized Luxury Landing Pages",
              "Advanced Retargeting & Lead Sequencing",
              "Exclusive Lead Nurturing Workflows"
            ]
          }}
          process={{
            title: "The Results",
            steps: [
              {
                title: "300X Return on Ad Spend",
                description: "Delivered extraordinary ROI by focusing on high-intent buyers rather than broad reach."
              },
              {
                title: "850+ Qualified Leads",
                description: "Generated a massive pool of high-quality leads specifically interested in premium real estate."
              },
              {
                title: "45% Lead-to-Appointment Rate",
                description: "Optimized the funnel to ensure leads actually converted into physical project visits."
              },
              {
                title: "68% Appointment-to-Sale Conversion",
                description: "Highest conversion rate in the project's history from qualified physical appointments."
              }
            ]
          }}
          relatedServices={[
            { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: <TrendingUp className="w-8 h-8 text-primary mb-4" /> },
            { title: "Social Media Marketing", link: "/services/social-media-marketing", icon: <Sparkles className="w-8 h-8 text-primary mb-4" /> },
            { title: "Creative Execution", link: "/services/creative-concept-execution", icon: <Layout className="w-8 h-8 text-primary mb-4" /> },
          ]}
        />
        
        {/* Results Highlights */}
        <section className="py-20 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <Landmark className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">300X</div>
                <div className="text-zinc-600 font-medium font-sans">ROAS</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">850+</div>
                <div className="text-zinc-600 font-medium font-sans">Qualified Leads</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <List className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">45%</div>
                <div className="text-zinc-600 font-medium font-sans">Appt. Rate</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">68%</div>
                <div className="text-zinc-600 font-medium font-sans">Sales Conv.</div>
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