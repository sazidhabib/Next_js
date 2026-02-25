"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect } from "react";

const testimonials = [
    {
        id: 1,
        text: "I am impressed by the level of expertise and commitment demonstrated by this real estate team. Their insights into the market helped me make informed investment decisions, and I couldn't be happier with the results.",
        name: "Robert Evans",
        role: "Property Investor",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        rating: 5,
    },
    {
        id: 2,
        text: "Selling my home with the help of this real estate team was a breeze. They provided valuable advice, staged my property beautifully, and negotiated a great deal. I highly recommend their services to anyone looking to sell their home!",
        name: "Jessica White",
        role: "Delighted Home Seller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        rating: 5,
    },
    {
        id: 3,
        text: "Thanks to the expertise and guidance of this team, I am now the proud owner of a beautiful home. They listened to my preferences, answered all my questions, and made the entire home buying process a positive experience.",
        name: "Daniel Miller",
        role: "Happy New Homeowner",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        rating: 5,
    },
    {
        id: 4,
        text: "Outstanding service! They understood exactly what I was looking for and delivered perfectly. The entire team was professional and responsive throughout the entire process.",
        name: "Michael Chen",
        role: "First-time Buyer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
        rating: 5,
    },
];

export function TestimonialsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    const itemWidth = (scrollRef.current.firstElementChild as HTMLElement)?.offsetWidth || 320;
                    scrollRef.current.scrollBy({ left: itemWidth + 24, behavior: "smooth" });
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const itemWidth = (scrollRef.current.firstElementChild as HTMLElement)?.offsetWidth || 320;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -(itemWidth + 24) : itemWidth + 24,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="py-24 bg-slate-50 relative border-t border-border/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column - Header & Nav */}
                    <div className="lg:w-1/3 flex flex-col justify-center">
                        <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">
                            TOP PROPERTIES
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
                            What&apos;s People Say&apos;s
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-sm">
                            Our seasoned team excels in real estate with years of successful market navigation, offering informed decisions and optimal results.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => scroll("left")}
                                className="w-12 h-12 bg-white  shadow-sm border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="w-12 h-12 bg-white  shadow-sm border border-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Carousel */}
                    <div className="lg:w-2/3">
                        <div
                            ref={scrollRef}
                            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {testimonials.map((t) => (
                                <div
                                    key={t.id}
                                    className="bg-white  p-8 shadow-sm border border-slate-100 min-w-[320px] max-w-[400px] shrink-0 snap-start flex flex-col"
                                >
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                                        {t.text}
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                                            <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                                            <p className="text-slate-500 text-xs">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
