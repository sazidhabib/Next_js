"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "TechStart Rebrand",
    category: "Branding",
    image: "/portfolio/techstart.jpg",
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "FinanceHub App",
    category: "Web Development",
    image: "/portfolio/financehub.jpg",
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: 3,
    title: "HealthFirst Campaign",
    category: "Digital Marketing",
    image: "/portfolio/healthfirst.jpg",
    color: "from-rose-500 to-pink-400",
  },
  {
    id: 4,
    title: "EcoLife Platform",
    category: "Web Development",
    image: "/portfolio/ecolife.jpg",
    color: "from-green-500 to-lime-400",
  },
  {
    id: 5,
    title: "Luxury Auto Show",
    category: "Creative Design",
    image: "/portfolio/autoshow.jpg",
    color: "from-purple-500 to-violet-400",
  },
  {
    id: 6,
    title: "FoodieApp Launch",
    category: "Brand Strategy",
    image: "/portfolio/foodie.jpg",
    color: "from-orange-500 to-amber-400",
  },
];

export default function PortfolioSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Our Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900">
              Featured Projects
            </h2>
          </div>
          <a
            href="#contact"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Work
            <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <ArrowUpRight className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent transition-all duration-500 ${
                  hoveredIndex === index ? "translate-y-0" : "translate-y-16"
                }`}
              >
                <div className="text-white/80 text-sm font-medium mb-1">
                  {project.category}
                </div>
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              </div>

              <div
                className={`absolute inset-0 border-2 border-white/30 rounded-2xl transition-opacity duration-500 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
