"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

const slides = [
  {
    tagline: "We Build Digital Experiences That Drive Results",
    subtitle:
      "Award-winning digital agency specializing in creative strategy, brand development, and cutting-edge technology.",
    cta: "View Our Work",
    ctaLink: "#portfolio",
  },
  {
    tagline: "Transform Your Brand Into A Digital Powerhouse",
    subtitle:
      "From concept to execution, we craft compelling narratives that resonate with your audience and grow your business.",
    cta: "Explore Services",
    ctaLink: "#services",
  },
  {
    tagline: "Strategic Creativity Meets Technical Excellence",
    subtitle:
      "We combine data-driven insights with bold creative vision to deliver measurable outcomes for forward-thinking brands.",
    cta: "Get In Touch",
    ctaLink: "#contact",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-white to-zinc-100" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-100 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6 opacity-0 animate-fade-in-up">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-sm font-medium text-zinc-600">
              Award-Winning Digital Agency
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-6 tracking-tight opacity-0 animate-fade-in-up delay-100">
            {slides[currentSlide].tagline}
          </h1>

          <p className="text-xl text-zinc-600 mb-10 max-w-2xl opacity-0 animate-fade-in-up delay-200">
            {slides[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up delay-300">
            <Link
              href={slides[currentSlide].ctaLink}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25"
            >
              {slides[currentSlide].cta}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-full hover:border-primary hover:text-primary transition-all duration-300"
            >
              Book Consultation
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
