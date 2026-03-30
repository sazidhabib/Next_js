"use client";

import { useState } from "react";
import Link from "next/link";

const portfolioCategories = [
  {
    id: 1,
    title: "Campaigns",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    color: "from-orange-500 to-amber-400",
    link: "/protfolio?category=Campaigns",
  },
  {
    id: 2,
    title: "Audio Visuals",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80",
    color: "from-purple-500 to-pink-400",
    link: "/protfolio?category=Audio%20Visuals",
  },
  {
    id: 3,
    title: "Creatives",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    color: "from-blue-500 to-cyan-400",
    link: "/protfolio?category=Creatives",
  },
  {
    id: 4,
    title: "Printing and Packaging",
    image: "/Printing-packagi.png",
    color: "from-green-500 to-emerald-400",
    link: "/protfolio?category=Printing%20%26%20Packaging",
  },
  {
    id: 5,
    title: "Events and Activations",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    color: "from-rose-500 to-red-400",
    link: "/protfolio?category=Events%20and%20Activations",
  },
  {
    id: 6,
    title: "Website",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
    color: "from-indigo-500 to-violet-400",
    link: "/protfolio?category=Website",
  },
];

export default function PortfolioSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Split categories for the specific grid layout from reference
  // Top row: Campaigns, Audio Visuals (Wide + Wide)
  // Middle row: Creatives, Printing, Events (3 columns) -> Actually ref looks like:
  // Row 1: Campaigns (Wide Image L), Audio Visuals (Wide Image R)
  // Row 2: Creatives (Wide), Printing (Wide), Events (Wide) - 3 cols
  // Let's stick to a responsive grid that works well.

  return (
    <section id="portfolio" className="py-24 bg-white text-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-800 mb-4 uppercase tracking-wider">
            Our Work
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Row 1 - Large Cards */}
          {portfolioCategories.slice(0, 2).map((category, index) => (
            <Link
              href={category.link}
              key={category.id}
              className="group relative h-[300px] md:h-[400px] rounded-sm overflow-hidden block"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-50`} />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{category.title}</h3>
                <div className="w-12 h-1 bg-white/50 rounded-full mt-2 group-hover:w-20 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Row 2 - Smaller Cards */}
          {portfolioCategories.slice(2).map((category, index) => (
            <Link
              href={category.link}
              key={category.id}
              className="group relative h-[250px] md:h-[300px] rounded-sm overflow-hidden block"
              onMouseEnter={() => setHoveredIndex(index + 2)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-50`} />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{category.title}</h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
