"use client";

import { useState } from "react";
import { Suspense } from "react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { ProjectsSearchHero } from "@/components/ui/ProjectsSearchHero";

function ProjectsContent() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [perPage, setPerPage] = useState(12);
    const [filters, setFilters] = useState({
        keyword: "",
        location: "",
        category: "All",
        minPrice: "",
        maxPrice: "",
        beds: "",
        baths: "",
    });

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

    // Filter projects based on search criteria
    const filteredProjects = projects.filter((project) => {
        if (filters.keyword) {
            const kw = filters.keyword.toLowerCase();
            if (
                !project.title.toLowerCase().includes(kw) &&
                !project.location.toLowerCase().includes(kw)
            ) {
                return false;
            }
        }
        if (filters.location) {
            if (
                !project.location
                    .toLowerCase()
                    .includes(filters.location.toLowerCase())
            ) {
                return false;
            }
        }
        if (filters.category !== "All") {
            if (project.category !== filters.category) {
                return false;
            }
        }
        if (filters.beds && project.beds) {
            if (project.beds < parseInt(filters.beds)) return false;
        }
        if (filters.baths && project.baths) {
            if (project.baths < parseInt(filters.baths)) return false;
        }
        return true;
    });

    const displayedProjects = filteredProjects.slice(0, perPage);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero with Map + Search */}
            <div className="pt-20">
                <ProjectsSearchHero
                    onSearch={setFilters}
                    onViewChange={setView}
                    onPerPageChange={setPerPage}
                    currentView={view}
                    currentPerPage={perPage}
                    totalResults={filteredProjects.length}
                />
            </div>

            {/* Projects Grid */}
            <section className="container mx-auto px-6 lg:px-12 py-12">
                {displayedProjects.length > 0 ? (
                    <div
                        className={
                            view === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "flex flex-col gap-6"
                        }
                    >
                        {displayedProjects.map((project) => (
                            <PropertyCard key={project.id} {...project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-serif text-foreground mb-4">
                            No projects found
                        </h3>
                        <p className="text-muted-foreground">
                            Try adjusting your filters to see more results.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <ProjectsContent />
        </Suspense>
    );
}
