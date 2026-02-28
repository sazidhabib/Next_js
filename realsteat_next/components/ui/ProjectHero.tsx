"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ProjectHeroProps {
    title: string;
    location: string;
    image: string;
    status: string;
}

export function ProjectHero({ title, location, image, status }: ProjectHeroProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use different gradient colors based on theme
    const isDark = mounted && theme === "dark";
    const gradientClass = isDark
        ? "bg-gradient-to-t from-black via-black/20 to-black/60"
        : "bg-gradient-to-t from-gray-800 via-gray-800/30 to-gray-700/40";

    return (
        <section className="relative h-[70vh] w-full">
            <Image
                src={image}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
            />
            <div className={`absolute inset-0 ${gradientClass}`}></div>
            <div className="absolute top-24 left-6 lg:left-12 z-10">
                <Link href="/projects" className="inline-flex items-center text-white hover:text-primary transition-colors text-sm font-semibold tracking-wider uppercase">
                    <ChevronLeft size={20} className="mr-1" /> Back to Projects
                </Link>
            </div>

            <div className="absolute bottom-12 left-6 lg:left-12 z-10 max-w-3xl">
                <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold tracking-widest uppercase mb-4">
                    {status}
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
                    {title}
                </h1>
                <div className="flex items-center text-white/90 gap-2 text-lg">
                    <MapPin className="text-primary" />
                    <span>{location}</span>
                </div>
            </div>
        </section>
    );
}
