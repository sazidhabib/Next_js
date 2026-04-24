"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const tabs = [
  {
    id: "seo-audits",
    label: "SEO AUDITS",
    title: "SEO Audits & Analysis",
    description: "Our comprehensive SEO audits dive deep into your website's performance, identifying technical issues, content gaps, and structural weaknesses that hinder your search rankings. We provide actionable insights to transform your visibility.",
    image: "/SEO-Audit.jpg",
  },
  {
    id: "keyword-research",
    label: "KEYWORD RESEARCH",
    title: "Keyword Research",
    description: "To achieve the ultimate objective of get in front of your customers when they are searching for you, you need to understand what they are looking for. This understanding starts with finding out the keywords using which the searches are being made by your potential customers. Just like any leading SEO agency, we conduct in-depth keyword research using industry-standard tools and market insights to identify high-impact, low-competition keywords. To become successful, you should be looking at intent-driven terms and long-tail keywords aligning with whatever you are selling and what customers are searching for. That's exactly what we do at Next Idea Solution. Interested? Contact Next Idea team for exploratory keyword research!",
    image: "/SEO_img01.jpg",

  },
  {
    id: "on-page-seo",
    label: "ON-PAGE SEO",
    title: "On-Page SEO Optimization",
    description: "We optimize your website's individual pages to rank higher and earn more relevant traffic. This includes optimizing meta tags, headings, content structure, and internal linking to ensure search engines understand your value proposition.",
    image: "/seo.jpg",
  },
  {
    id: "off-page-seo",
    label: "OFF-PAGE SEO",
    title: "Off-Page SEO & Link Building",
    description: "Building authority is key to ranking. Our off-page strategies focus on earning high-quality backlinks from reputable sources, enhancing your domain authority and establishing your brand as an industry leader.",
    image: "/Local-SEO.jpg",
  },
  {
    id: "technical-seo",
    label: "TECHNICAL SEO",
    title: "Technical SEO Optimization",
    description: "We ensure your website meets the technical requirements of modern search engines. From site speed and mobile-friendliness to crawlability and schema markup, we build a solid foundation for your SEO success.",
    image: "/tecnicalseo.jpeg",
  },
  {
    id: "local-seo",
    label: "LOCAL SEO",
    title: "Local SEO Solutions",
    description: "Be visible where your customers are. We optimize your local presence, including Google Business Profile management and local citations, to drive foot traffic and local inquiries to your business.",
    image: "/Local-SEO.jpg",
  },
  {
    id: "e-commerce-seo",
    label: "E-COMMERCE SEO",
    title: "E-Commerce SEO Strategies",
    description: "Drive sales with targeted e-commerce SEO. We optimize product pages, category structures, and user experience to ensure your products are found by shoppers ready to buy.",
    image: "/E-commerce-SEO.jpg",
  },
  {
    id: "aso",
    label: "APP STORE OPTIMIZATION (ASO)",
    title: "App Store Optimization",
    description: "Maximize your app's visibility in the Apple App Store and Google Play Store. We optimize titles, descriptions, and keywords to increase downloads and user engagement.",
    image: "/SEO-Services.jpg",
  },
  {
    id: "youtube-seo",
    label: "YOUTUBE SEO",
    title: "YouTube Video SEO",
    description: "Get your videos in front of the right audience. We optimize video titles, tags, and descriptions to ensure your content ranks in both YouTube and Google search results.",
    image: "/youtubeseo.jpeg",
  },
  {
    id: "vso",
    label: "VOICE SEARCH OPTIMIZATION (VSO)",
    title: "Voice Search Optimization",
    description: "Prepare for the future of search. We optimize your content for conversational queries and long-tail keywords used in voice searches on Alexa, Siri, and Google Assistant.",
    image: "/voicesearch.jpeg",
  },
  {
    id: "aeo",
    label: "ASK ENGINE OPTIMIZATION (AEO)",
    title: "Ask Engine Optimization",
    description: "In the era of AI and Answer Engines, we optimize your content to be the preferred answer for LLMs and AI-powered search results like Perplexity and Google SGE.",
    image: "/AEO.jpeg",
  },
];

export default function SEOTabbedServices({
  title = "End-To-End SEO Services Built For The AI-Powered Search Era",
  description = "Search isn't just about blue links anymore. With AI Overviews and smarter search algorithms changing how people find answers, your brand needs more than traditional SEO—it needs strategy that's built for how search works now.",
  servicesTabs = tabs,
}) {
  const [activeTab, setActiveTab] = useState(servicesTabs[1] || servicesTabs[0]); // Default to second tab or first if less than 2

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-6">
              {title}
            </h2>
            <p className="text-lg text-zinc-600 max-w-4xl mx-auto">
              {description}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tabs Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-2">
              {servicesTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-6 py-4 rounded-lg font-bold text-sm transition-all duration-300 border ${activeTab.id === tab.id
                    ? "bg-primary text-white border-primary-dark shadow-lg"
                    : "bg-white text-zinc-600 border-zinc-100 hover:bg-zinc-50 hover:border-zinc-200"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-zinc-100 p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-8"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl border border-zinc-100">
                    <img
                      src={activeTab.image}
                      alt={activeTab.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4 uppercase tracking-tight">
                      {activeTab.title}
                    </h3>
                    <p className="text-lg text-zinc-600 leading-relaxed mb-8">
                      {activeTab.description}
                    </p>
                    <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors flex items-center gap-2 group">
                      Get Started with Next Idea
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
