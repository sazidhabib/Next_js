"use client";

import { Laptop, AlertCircle, Home, Wrench } from "lucide-react";

const features = [
  {
    id: 1,
    icon: Laptop,
    title: "Laptop Finder",
    description: "Find Your Laptop Easily",
  },
  {
    id: 2,
    icon: AlertCircle,
    title: "Raise a Complain",
    description: "Share your experience",
  },
  {
    id: 3,
    icon: Home,
    title: "Home Service",
    description: "Get expert help.",
  },
  {
    id: 4,
    icon: Wrench,
    title: "Servicing Center",
    description: "Repair Your Device",
  },
];

export default function FeatureCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              className="bg-white border border-star-gray rounded-lg p-6 flex flex-col items-center gap-3 hover:shadow-lg hover:border-star-blue transition-all duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-star-light-gray rounded-full flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <IconComponent className="w-6 h-6 text-star-blue" />
              </div>
              <h3 className="text-center font-semibold text-gray-800 group-hover:text-star-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-center text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
