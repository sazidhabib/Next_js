"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, List, BarChart3, PieChart, TrendingUp, Mail, MousePointer2, Briefcase, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/ServiceHero";
import ServiceContent from "../../components/ServiceContent";
import CTASection from "../../components/CTASection";

export default function WesternConsultingCaseStudy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <ServiceHero
          icon={<Briefcase className="w-10 h-10" />}
          title="Turning Conversations into Conversions"
          tagline="Lead Generation Excellence: Western Consulting"
          description="How we helped Western Consulting Firm transform their digital presence from a passive brochure into an active lead generation engine with a 340% case improvement."
          image="https://geekysocial.com/wp-content/uploads/2026/01/Westerncf-home-slide-china.webp"
        />

        <ServiceContent
          overview={{
            title: "The Challenge",
            description: "Western Consulting Firm, a prominent business advisory consultancy, faced significant challenges in generating qualified leads through digital channels. Despite strong industry expertise, their website wasn't converting visitors into meaningful business opportunities. They struggled with low conversion rates and poor targeting of decision-makers."
          }}
          features={{
            title: "Our Solution",
            items: [
              "Multi-Channel Targeted Digital Campaigns",
              "LinkedIn & Google Ads Precision Targeting",
              "Conversion-Optimized Landing Page Design",
              "Strategic Call-to-Action (CTA) Implementation",
              "Automated Lead Nurturing Email Workflows",
              "Thought Leadership Content Strategy",
              "Performance Analytics & Funnel Monitoring"
            ]
          }}
          process={{
            title: "The Results",
            steps: [
              {
                title: "340% Increase in Lead Gen",
                description: "Delivered a massive surge in qualified business inquiries through optimized funnels."
              },
              {
                title: "65% Lower Cost Per Lead",
                description: "Improved targeting efficiency, significantly reducing the cost of acquiring each prospect."
              },
              {
                title: "120+ High-Value Leads",
                description: "Generated a consistent pipe of decision-makers from target industries."
              },
              {
                title: "45% Lead-to-Customer Rate",
                description: "The quality of leads improved so much that the sales team achieved record conversion levels."
              }
            ]
          }}
          relatedServices={[
            { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: <TrendingUp className="w-8 h-8 text-primary mb-4" /> },
            { title: "Social Media Marketing", link: "/services/social-media-marketing", icon: <Sparkles className="w-8 h-8 text-primary mb-4" /> },
            { title: "Brand Identity", link: "/services/brand-identity", icon: <Briefcase className="w-8 h-8 text-primary mb-4" /> },
          ]}
        />
        
        {/* Results Highlights */}
        <section className="py-20 bg-zinc-50 border-t border-zinc-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <MousePointer2 className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">340%</div>
                <div className="text-zinc-600 font-medium font-sans">Lead Growth</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <TrendingUp className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">65%</div>
                <div className="text-zinc-600 font-medium font-sans">Lower CPL</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">120+</div>
                <div className="text-zinc-600 font-medium font-sans">High-Val Leads</div>
              </div>
              <div className="p-8 text-center bg-white rounded-3xl shadow-lg border border-zinc-100">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-zinc-900 mb-2">45%</div>
                <div className="text-zinc-600 font-medium font-sans">Customer Conv.</div>
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