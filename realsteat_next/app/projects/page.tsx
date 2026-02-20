"use client";

import { useState } from "react";
import { PropertyCard } from "@/components/ui/PropertyCard";

export default function ProjectsPage() {
    const [filter, setFilter] = useState("All");

    const categories = ["All", "Residential", "Commercial", "Land"];

    const projects = [
        {
            id: "1",
            title: "The Oasis Residences",
            location: "Gulshan, Dhaka",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
            price: "Start from $1,200,000",
            beds: 4,
            baths: 4,
            sqft: 3500,
            status: "Ongoing" as const,
            category: "Residential",
        },
        {
            id: "2",
            title: "Azure Commercial Skyline",
            location: "Banani, Dhaka",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            price: "Contact for Details",
            status: "Ready" as const,
            category: "Commercial",
        },
        {
            id: "3",
            title: "Crescent Lake Villas",
            location: "Bashundhara R/A",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            price: "Sold Out",
            beds: 5,
            baths: 6,
            sqft: 4800,
            status: "Ready" as const,
            category: "Residential",
        },
        {
            id: "4",
            title: "Pinnacle Business Center",
            location: "Motijheel, Dhaka",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
            price: "Contact for Details",
            status: "Upcoming" as const,
            category: "Commercial",
        },
        {
            id: "5",
            title: "Serenity Heights",
            location: "Uttara, Dhaka",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            price: "Start from $850,000",
            beds: 3,
            baths: 3,
            sqft: 2200,
            status: "Ongoing" as const,
            category: "Residential",
        },
    ];

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <div className="pt-24 pb-20 min-h-screen bg-background">
            {/* Page Header */}
            <section className="bg-background py-20 border-b border-border">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">Our Portfolio</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our diverse collection of premium residential, commercial, and land properties designed to redefine modern living.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-8 border-b border-white/10 mb-12">
                <div className="container mx-auto px-6 lg:px-12 flex justify-center">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full border text-sm uppercase tracking-wider font-semibold transition-all duration-300 ${filter === cat
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "bg-transparent border-border text-foreground hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="container mx-auto px-6 lg:px-12">
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <PropertyCard key={project.id} {...project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-serif text-foreground mb-4">No projects found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
