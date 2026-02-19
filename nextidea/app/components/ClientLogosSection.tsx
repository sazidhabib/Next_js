"use client";

import { useState } from "react";

const clients = [
  { name: "TechCorp", logo: "TC" },
  { name: "InnovateLabs", logo: "IL" },
  { name: "GlobalTech", logo: "GT" },
  { name: "DataFlow", logo: "DF" },
  { name: "CloudBase", logo: "CB" },
  { name: "NextGen", logo: "NG" },
  { name: "SmartSystems", logo: "SS" },
  { name: "FutureWorks", logo: "FW" },
];

export default function ClientLogosSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-zinc-50 border-y border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Trusted Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Our Clients
          </h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            We&apos;ve had the privilege of working with remarkable brands across
            industries.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-center p-8 bg-white rounded-2xl border border-zinc-200 hover:border-primary/50 transition-all duration-300"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`text-2xl font-bold text-zinc-300 group-hover:text-primary transition-all duration-300 ${
                  hoveredIndex === index ? "scale-110" : "scale-100"
                }`}
              >
                {client.logo}
              </div>

              <span className="absolute bottom-2 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {client.name}
              </span>

              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
