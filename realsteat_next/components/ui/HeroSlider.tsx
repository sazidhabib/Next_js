"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const heroImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {heroImages.map((src, index) => (
                <Image
                    key={src}
                    src={src}
                    alt={`Luxury Real Estate ${index + 1}`}
                    fill
                    className={`object-cover transition-all duration-[2000ms] ease-in-out ${index === currentIndex
                        ? "opacity-100 scale-105"
                        : "opacity-0 scale-100"
                        }`}
                    priority={index === 0}
                />
            ))}
            <div className="absolute inset-0  bg-gradient-to-t from-background via-background/40 to-background/60 z-10 transition-colors duration-500"></div>
        </div>
    );
}
