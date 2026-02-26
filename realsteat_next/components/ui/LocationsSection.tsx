"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useRef, useEffect } from "react";

const locations = [
    {
        id: 1,
        city: "Munich",
        rentImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 2,
        city: "New York City",
        rentImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 3,
        city: "Paris",
        rentImage: "https://images.unsplash.com/photo-1502602898657-3e90760b2695?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 4,
        city: "Tokyo",
        rentImage: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 5,
        city: "Munich",
        rentImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 6,
        city: "New York City",
        rentImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 7,
        city: "Paris",
        rentImage: "https://images.unsplash.com/photo-1502602898657-3e90760b2695?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
    {
        id: 8,
        city: "Tokyo",
        rentImage: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80",
        saleImage: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80",
        rentLabel: "CABIN RETREATS",
        saleLabel: "URBAN APARTMENTS",
    },
];

export function LocationsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    const itemWidth = (scrollRef.current.firstElementChild as HTMLElement)?.offsetWidth || 400;
                    scrollRef.current.scrollBy({ left: itemWidth + 24, behavior: "smooth" });
                }
            }
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateFocus = () => {
            if (!scrollRef.current) return;
            const container = scrollRef.current;

            // Find the horizontal center of the scroll container
            const containerCenter = container.scrollLeft + container.clientWidth / 2;
            const slides = Array.from(container.querySelectorAll(".loc-slide")) as HTMLElement[];

            let closestIndex = 0;
            let minDistance = Infinity;

            // Find the slide that is closest to the center
            slides.forEach((slide, index) => {
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
                const distance = Math.abs(containerCenter - slideCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            });

            // Loop through all slides and focus the closest one + its immediate left and right neighbors
            slides.forEach((slide, index) => {
                if (Math.abs(index - closestIndex) <= 1) {
                    // IN FOCUS
                    slide.classList.remove("opacity-50", "blur-[4px]", "scale-[0.95]");
                    slide.classList.add("opacity-100", "blur-0", "scale-100");
                } else {
                    // BLURRED (edges)
                    slide.classList.add("opacity-50", "blur-[4px]", "scale-[0.95]");
                    slide.classList.remove("opacity-100", "blur-0", "scale-100");
                }
            });
        };

        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateFocus);
            window.addEventListener("resize", updateFocus);
            // Run initially with a small timeout to let images render and offsets calculate accurately
            setTimeout(updateFocus, 100);

            return () => {
                container.removeEventListener("scroll", updateFocus);
                window.removeEventListener("resize", updateFocus);
            };
        }
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const itemWidth = (scrollRef.current.firstElementChild as HTMLElement)?.offsetWidth || 400;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -(itemWidth + 24) : itemWidth + 24,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="py-24 bg-background relative">
            <div className=" mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">
                        EXPLORE CITIES
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
                        Our Location For You
                    </h2>
                </div>

                <div className="relative">
                    {/* Scroll Prev Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg flex items-center justify-center -ml-6 hover:bg-gray-50 transition-colors hidden md:flex"
                        aria-label="Previous locations"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>

                    {/* Carousel Container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {locations.map((loc) => (
                            <Link
                                key={loc.id}
                                href={`/projects?location=${encodeURIComponent(loc.city)}`}
                                className="loc-slide relative shrink-0 w-[350px] sm:w-[400px] h-[450px] overflow-hidden snap-center group shadow-md transition-all duration-700 opacity-50 blur-[4px] scale-[0.95] cursor-pointer block"
                            >
                                {/* Top Labels */}
                                <div className="absolute top-0 inset-x-0 h-12 flex z-20 font-bold text-xs">
                                    <div className="flex-1 bg-[#1e3250] text-white flex items-center justify-center tracking-wider">
                                        FOR RENT
                                    </div>
                                    <div className="flex-1 bg-[#2a4365] text-white flex items-center justify-center tracking-wider">
                                        FOR SALE
                                    </div>
                                </div>

                                {/* Sub Labels */}
                                <div className="absolute top-16 inset-x-0 flex px-4 gap-4 z-20">
                                    <div className="flex-1 text-center">
                                        <span className="inline-block px-3 py-1 bg-black/60 text-white text-[10px] font-bold tracking-wider rounded-sm backdrop-blur-sm">
                                            {loc.rentLabel}
                                        </span>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <span className="inline-block px-3 py-1 bg-black/60 text-white text-[10px] font-bold tracking-wider rounded-sm backdrop-blur-sm">
                                            {loc.saleLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Split Images */}
                                <div className="absolute inset-0 flex mt-12">
                                    <div className="relative flex-1 h-full">
                                        <Image
                                            src={loc.rentImage}
                                            alt={`${loc.city} Rent`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="w-[2px] bg-white/20 h-full relative z-10"></div>
                                    <div className="relative flex-1 h-full">
                                        <Image
                                            src={loc.saleImage}
                                            alt={`${loc.city} Sale`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                                {/* Center Logo */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-md px-4 py-2 flex flex-col items-center justify-center text-[#1e3250] shadow-lg rounded-sm">
                                    <Home className="w-8 h-8 mb-1" />
                                    <span className="font-bold text-sm tracking-widest uppercase">Estate</span>
                                    <span className="font-bold text-sm tracking-widest uppercase text-slate-500">Finder</span>
                                </div>

                                {/* Bottom Overlay & Actions */}
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#1e3250]/90 to-transparent z-20 flex flex-col justify-end h-1/2">
                                    <div className="flex justify-between items-center mb-2">
                                        <button className="text-[10px] text-white/70 hover:text-white uppercase tracking-wider font-semibold transition-colors flex items-center gap-1">
                                            FIND YOUR LEASE &gt;
                                        </button>
                                        <button className="text-[10px] text-white/70 hover:text-white uppercase tracking-wider font-semibold transition-colors flex items-center gap-1">
                                            BUY YOUR HOME &gt;
                                        </button>
                                    </div>
                                    <h3 className="text-white text-2xl font-bold">{loc.city}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Scroll Next Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg flex items-center justify-center -mr-6 hover:bg-gray-50 transition-colors hidden md:flex"
                        aria-label="Next locations"
                    >
                        <ChevronRight className="w-6 h-6 text-slate-800" />
                    </button>
                </div>
            </div>
        </section>
    );
}
