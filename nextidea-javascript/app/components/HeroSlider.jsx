"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.home_hero_slides) {
          try {
            const parsedSlides = JSON.parse(data.data.home_hero_slides);
            setSlides(parsedSlides);
          } catch (e) {
            console.error("Failed to parse hero slides", e);
          }
        }
      })
      .catch(err => console.error("Hero slides fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  return (
    <section
      className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden min-h-screen flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
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
              <AnimatePresence mode="wait">
                {index === currentSlide && (
                  <motion.div
                    key={`slide-content-${slide.id || index}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8">
                      <span className="block text-2xl md:text-3xl font-normal text-white/80 mb-2 italic font-serif">
                        It&apos;s
                      </span>
                      {slide.headline}
                      <span className="text-primary"> {slide.subheadline}</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-white/80 text-lg md:text-xl mb-12">
                      {slide.description}
                    </p>

                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors"
                    >
                      {slide.ctaText}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
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
