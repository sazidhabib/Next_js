"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    headline: "Necessary To Have",
    subheadline: "The Right Formula To Grow Big",
    description: "We inject the right formula to grow your business with award-winning digital campaigns.",
    ctaText: "Get Started",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80",
  },
  {
    id: 2,
    headline: "Digital Excellence",
    subheadline: "360-Degree Marketing Solutions",
    description: "We create award-winning, certified, 360-degree digital-first advertising campaigns.",
    ctaText: "Our Services",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
  },
  {
    id: 3,
    headline: "Measurable Results",
    subheadline: "Data-Driven Growth Strategies",
    description: "Our campaigns produce measurable results that impact your bottom line.",
    ctaText: "View Portfolio",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden min-h-screen flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.imageUrl}
              alt={slide.headline}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
            <div className="flex flex-col items-center text-center w-full">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8">
                <span className="block text-2xl md:text-3xl font-normal text-white/80 mb-2 italic font-serif">
                  It&apos;s
                </span>
                {slide.headline}
                <span className="text-primary"> {slide.subheadline}</span>
              </h1>

              <p className="max-w-2xl text-white/80 text-lg md:text-xl mb-12">
                {slide.description}
              </p>

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors"
              >
                {slide.ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-10"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
