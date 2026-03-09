"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const caseStudies = [
  {
    id: 1,
    title: "Turning Conversations into Conversions: The Lead Generation Success Story of Western Consulting Firm",
    category: "Lead Generation",
    image: "https://geekysocial.com/wp-content/uploads/2026/01/Westerncf-home-slide-china.webp",
    link: "/case-study/western-consulting",
  },
  {
    id: 2,
    title: "From Zero to High-Intent Traffic: How Mostofa Pipe Built SEO Visibility in Just 5 Months",
    category: "SEO",
    image: "https://geekysocial.com/wp-content/uploads/2026/01/Webiste-main-BG-1-08-scaled-1.webp",
    link: "/case-study/mostofa-pipe",
  },
  {
    id: 3,
    title: "How GEEKY Social Drove 300X ROAS for Urban's Premium Real Estate Project in Dhaka",
    category: "Real Estate",
    image: "https://geekysocial.com/wp-content/uploads/2026/01/Imperial_Areal-view_01_Post-scaled-1.jpg",
    link: "/case-study/urban-imperials",
  },
];

export default function CaseStudySection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Case Studies
          </h2>
          <p className="text-lg text-zinc-600">
            Results that speak for themselves
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <Link
              href={study.link}
              key={study.id}
              className="group block"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${study.image})` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-zinc-900">
                  {study.category}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-primary transition-colors line-clamp-2">
                {study.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors"
          >
            See More Case Studies
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
