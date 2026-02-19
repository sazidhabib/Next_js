"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Users, Target } from "lucide-react";

const caseStudies = [
  {
    company: "TechStart",
    industry: "SaaS / Technology",
    title: "How We Increased Lead Generation by 300%",
    results: [
      { icon: TrendingUp, value: "300%", label: "More Leads" },
      { icon: Users, value: "2.5M+", label: "Impressions" },
      { icon: Target, value: "45%", label: "Conversion Rate" },
    ],
    description:
      "Complete digital transformation including brand overhaul, website redesign, and targeted content marketing strategy.",
  },
  {
    company: "HealthFirst",
    industry: "Healthcare",
    title: "Building Trust Through Digital Excellence",
    results: [
      { icon: TrendingUp, value: "150%", label: "Patient Growth" },
      { icon: Users, value: "89%", label: "Satisfaction" },
      { icon: Target, value: "3x", label: "ROI" },
    ],
    description:
      "Strategic brand positioning and patient-focused web experience that established trust and drove significant growth.",
  },
  {
    company: "FinanceHub",
    industry: "FinTech",
    title: "Reimagining Financial Services for Digital Natives",
    results: [
      { icon: TrendingUp, value: "500%", label: "App Downloads" },
      { icon: Users, value: "1M+", label: "Active Users" },
      { icon: Target, value: "4.8★", label: "App Rating" },
    ],
    description:
      "Mobile-first platform design and comprehensive digital strategy that disrupted the traditional finance space.",
  },
];

export default function CaseStudySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + caseStudies.length) % caseStudies.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % caseStudies.length);
  };

  const study = caseStudies[currentIndex];

  return (
    <section className="py-24 bg-white border-t border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">
            Case Studies
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <div className="text-primary font-medium mb-1">
                  {study.company}
                </div>
                <div className="text-zinc-400 text-sm">{study.industry}</div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-6">{study.title}</h3>

            <div className="grid grid-cols-3 gap-6 mb-8">
              {study.results.map((result, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <result.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {result.value}
                  </div>
                  <div className="text-zinc-400 text-sm">{result.label}</div>
                </div>
              ))}
            </div>

            <p className="text-zinc-400">{study.description}</p>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {caseStudies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "bg-zinc-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
