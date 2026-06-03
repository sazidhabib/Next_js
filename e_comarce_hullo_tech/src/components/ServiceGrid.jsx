"use client";

import {
  Wrench,
  Laptop,
  Smartphone,
  Monitor,
  Clock,
  Shield,
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: Laptop,
    title: "Laptop Repair",
    description:
      "Screen replacement, keyboard repair, battery service, motherboard repair",
  },
  {
    id: 2,
    icon: Smartphone,
    title: "Mobile Repair",
    description:
      "Screen replacement, battery service, charging port repair, water damage recovery",
  },
  {
    id: 3,
    icon: Monitor,
    title: "Desktop & Monitor",
    description:
      "Hardware upgrades, software issues, display repair, power supply replacement",
  },
  {
    id: 4,
    icon: Wrench,
    title: "General Maintenance",
    description:
      "Cleaning, software updates, virus removal, performance optimization",
  },
  {
    id: 5,
    icon: Clock,
    title: "Express Service",
    description:
      "Quick turnaround on minor repairs. Same-day service for eligible items.",
  },
  {
    id: 6,
    icon: Shield,
    title: "Warranty Support",
    description:
      "Authorized warranty service for all major brands. Genuine parts only.",
  },
];

export default function ServiceGrid() {
  return (
    <section
      id="services"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive repair and maintenance services for all your electronics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white border border-star-gray rounded-lg p-6 hover:shadow-lg hover:border-star-blue transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <IconComponent className="w-7 h-7 text-star-blue" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
