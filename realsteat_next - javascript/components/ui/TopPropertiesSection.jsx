"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Move, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function TopPropertiesSection() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                const res = await fetch(`${apiUrl}/properties`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter active properties that are marked as 'is_best', sorted by best_clicked_at DESC, limit 4
                    const activeProperties = data
                        .filter(p => (p.status === "active" || p.status === "pending") && (p.is_best === 1 || p.is_best === true))
                        .sort((a, b) => new Date(b.best_clicked_at) - new Date(a.best_clicked_at))
                        .slice(0, 4);
                    setProjects(activeProperties);
                }
            } catch (err) {
                console.error("Failed to fetch top properties:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const getImages = (project) => {
        if (!project.images) return [project.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];
        try {
            const imgs = typeof project.images === "string" ? JSON.parse(project.images) : project.images;
            return Array.isArray(imgs) && imgs.length > 0 ? imgs : [project.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];
        } catch {
            return [project.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"];
        }
    };

    if (isLoading) {
        return (
            <section className="py-24 bg-background relative border-t border-border/50">
                <div className="container mx-auto px-6 lg:px-12 text-center text-muted-foreground">
                    <p>Loading Top Properties...</p>
                </div>
            </section>
        );
    }

    if (projects.length === 0) {
        return null; // Don't render section if empty
    }

    const featuredProject = projects[0];
    const sideProjects = projects.slice(1, 4);

    return (
        <section className="py-24 bg-background relative border-t border-border/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">
                            TOP PROPERTIES
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
                            Best Property Value
                        </h2>
                    </div>
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-2 text-primary font-semibold uppercase tracking-widest hover:text-foreground transition-colors duration-300"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Featured Large Card */}
                    {featuredProject && (
                        <Link href={`/properties/${featuredProject.id}`} className="lg:col-span-7 bg-card border border-border/50 hover:border-primary/50 overflow-hidden flex flex-col group cursor-pointer transition-all duration-500">
                            <div className="relative h-[400px] w-full overflow-hidden">
                                <Image
                                    src={getImages(featuredProject)[0]}
                                    alt={featuredProject.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 flex gap-2 z-10">
                                    <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1">
                                        Best Value
                                    </span>
                                    <span className="bg-[#e13b3b] text-white text-[10px] uppercase font-bold px-2 py-1">
                                        Active
                                    </span>
                                </div>
                                <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-[#e13b3b] transition-colors">
                                    <Heart className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-4 left-4 z-10">
                                    <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-bold px-3 py-1.5 border border-border capitalize">
                                        {featuredProject.category_name || featuredProject.category || "Property"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">{featuredProject.title}</h3>
                                <span className="flex items-center text-muted-foreground text-sm mb-4">
                                    <MapPin size={16} className="text-primary mr-1" /> {featuredProject.location}
                                </span>
                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                                    {featuredProject.description || "No description available."}
                                </p>

                                <div className="flex items-center gap-6 text-muted-foreground text-sm font-medium border-t border-border/50 pt-6 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <Bed className="w-5 h-5 text-muted-foreground" />
                                        <span>{featuredProject.bedrooms || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Bath className="w-5 h-5 text-muted-foreground" />
                                        <span>{featuredProject.bathrooms || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Move className="w-5 h-5 text-muted-foreground" />
                                        <span>{featuredProject.sqft || 0} sqft</span>
                                    </div>
                                    <div className="ml-auto text-xl font-bold text-primary">
                                        {featuredProject.price || "Contact for Price"}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Side Small Cards */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {sideProjects.map((project) => (
                            <Link href={`/properties/${project.id}`} key={project.id} className="bg-card border border-border/50 hover:border-primary/50 p-3 flex flex-col sm:flex-row gap-4 group cursor-pointer transition-all duration-500">
                                <div className="relative w-full sm:w-[160px] h-[160px] overflow-hidden shrink-0">
                                    <Image
                                        src={getImages(project)[0]}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                        <span className="bg-emerald-500 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 w-fit">Best</span>
                                    </div>
                                    <button className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded flex items-center justify-center text-white hover:bg-[#e13b3b] transition-colors z-10">
                                        <Heart className="w-3 h-3" />
                                    </button>
                                    <div className="absolute bottom-2 left-2 z-10">
                                        <span className="bg-background/80 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-1 border border-border capitalize">{project.category_name || project.category || "Property"}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between py-1 flex-1">
                                    <div>
                                        <h4 className="text-xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{project.title}</h4>
                                        <p className="flex items-center text-muted-foreground text-xs mb-3">
                                            <MapPin size={13} className="text-primary mr-1" /> {project.location}
                                        </p>
                                        <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium">
                                            <div className="flex items-center gap-1.5"><Bed className="w-4 h-4" /> {project.bedrooms || 0}</div>
                                            <div className="flex items-center gap-1.5"><Bath className="w-4 h-4" /> {project.bathrooms || 0}</div>
                                            <div className="flex items-center gap-1.5"><Move className="w-4 h-4" /> {project.sqft || 0} sqft</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-muted overflow-hidden relative">
                                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">A</div>
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium">Agent</span>
                                        </div>
                                        <span className="font-bold text-primary text-sm">{project.price || "Contact"}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
