"use client";

import { useState, useEffect } from "react";
import { Suspense } from "react";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { ProjectsSearchHero } from "@/components/ui/ProjectsSearchHero";

function PropertiesContent() {
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

    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                const res = await fetch(`${apiUrl}/properties`);
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.filter(p => p.status === "active" || p.status === "pending").map(p => {
                        let img = p.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80";
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
                    setProperties(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch properties:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
                <p>Loading properties...</p>
            </div>
        );
    }

    const filteredProperties = properties.filter((prop) => {
        if (filters.keyword) {
            const kw = filters.keyword.toLowerCase();
            if (
                !prop.title.toLowerCase().includes(kw) &&
                !prop.location.toLowerCase().includes(kw)
            ) {
                return false;
            }
        }
        if (filters.location) {
            if (
                !prop.location
                    .toLowerCase()
                    .includes(filters.location.toLowerCase())
            ) {
                return false;
            }
        }
        if (filters.category !== "All") {
            if (prop.category !== filters.category) {
                return false;
            }
        }
        if (filters.beds && prop.beds) {
            if (prop.beds < parseInt(filters.beds)) return false;
        }
        if (filters.baths && prop.baths) {
            if (prop.baths < parseInt(filters.baths)) return false;
        }
        return true;
    });

    const displayedProperties = filteredProperties.slice(0, perPage);
    const categories = ["All", ...Array.from(new Set(properties.map(p => p.category)))];

    return (
        <div className="min-h-screen bg-background">
            <div className="pt-20">
                <ProjectsSearchHero
                    onSearch={setFilters}
                    onViewChange={setView}
                    onPerPageChange={setPerPage}
                    currentView={view}
                    currentPerPage={perPage}
                    totalResults={filteredProperties.length}
                />
            </div>

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

                {displayedProperties.length > 0 ? (
                    <div
                        className={
                            view === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "flex flex-col gap-6"
                        }
                    >
                        {displayedProperties.map((prop) => (
                            <PropertyCard key={prop.id} {...prop} linkPrefix="properties" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-serif text-foreground mb-4">
                            No properties found
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

export default function PropertiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <PropertiesContent />
        </Suspense>
    );
}
