"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { ProjectsSearchHero } from "@/components/ui/ProjectsSearchHero";

function ProjectsContent() {
    const [view, setView] = useState("grid");
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

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                const res = await fetch(`${apiUrl}/frames`);
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.filter(p => p.status === "active" || p.status === "pending").map(p => {
                        let img = p.image_url || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";
                        if (p.images) {
                            try {
                                const parsed = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
                                if (Array.isArray(parsed) && parsed.length > 0) {
                                    img = parsed[0];
                                }
                            } catch (e) {}
                        }
                        return {
                            id: String(p.id),
                            title: p.title,
                            location: p.location,
                            image: img,
                            price: p.price || "Contact for Price",
                            beds: p.bedrooms,
                            baths: p.bathrooms,
                            sqft: p.sqft,
                            status: p.status === "active" ? "Ready" : "Ongoing",
                            category: p.category_name || p.category || "Property",
                        };
                    });
                    setProjects(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
                <p>Loading projects...</p>
            </div>
        );
    }

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

    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

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
                {/* Category Filter */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilters(prev => ({ ...prev, category: cat }))}
                            className={`px-6 py-2 rounded-full border text-sm font-medium transition-colors ${filters.category === cat
                                    ? "bg-primary text-black border-primary"
                                    : "bg-background text-foreground border-border hover:border-primary"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

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
