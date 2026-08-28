"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Hassan",
    device: "Dell Laptop",
    rating: 5,
    comment:
      "Excellent service! My laptop screen was replaced quickly and professionally. Highly recommended!",
  },
  {
    id: 2,
    name: "Fatima Begum",
    device: "iPhone 12",
    rating: 5,
    comment:
      "Very friendly staff and fair pricing. Got my phone battery replaced with genuine parts. Very satisfied!",
  },
  {
    id: 3,
    name: "Karim Khan",
    device: "HP Desktop",
    rating: 4,
    comment:
      "Good service overall. The technician diagnosed the issue well. Only wish the repair took a bit less time.",
  },
  {
    id: 4,
    name: "Nadia Sultana",
    device: "Samsung Monitor",
    rating: 5,
    comment:
      "Professional team, clean workspace, and they explained everything clearly. Will definitely come back!",
  },
  {
    id: 5,
    name: "Rashed Ahmed",
    device: "Lenovo Laptop",
    rating: 5,
    comment:
      "Fast and reliable service. They even called me during the repair to update me. 10/10!",
  },
  {
    id: 6,
    name: "Sana Khan",
    device: "Portable Charger",
    rating: 4,
    comment:
      "Good experience. Minor issue was resolved quickly. Pricing is reasonable.",
  },
];

export default function ServiceTestimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Customer Testimonials
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hear what our satisfied customers say about our service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white border border-star-gray rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 mb-4 italic text-sm">
              "{testimonial.comment}"
            </p>

            {/* Author Info */}
            <div className="border-t border-star-gray pt-4">
              <p className="font-bold text-gray-800 text-sm">
                {testimonial.name}
              </p>
              <p className="text-gray-600 text-xs">{testimonial.device}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
