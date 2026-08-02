"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { Bed, Bath, Maximize, CheckCircle2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("@/components/ui/MapViewer"), { ssr: false });

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id;
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchProject = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                const res = await fetch(`${apiUrl}/frames/${id}`);
                if (!res.ok) throw new Error("Project not found");
                const data = await res.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (isLoading) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center text-muted-foreground">
                <p>Loading project details...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="bg-background min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
                    <Link href="/projects" className="text-primary hover:underline">
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const getImages = () => {
        if (!project.images) return [project.image_url || "/placeholder.jpg"];
        try {
            const imgs = typeof project.images === "string" ? JSON.parse(project.images) : project.images;
            return Array.isArray(imgs) && imgs.length > 0 ? imgs : [project.image_url || "/placeholder.jpg"];
        } catch {
            return [project.image_url || "/placeholder.jpg"];
        }
    };

    const getAmenities = () => {
        if (!project.amenities) return [];
        try {
            const a = typeof project.amenities === "string" ? JSON.parse(project.amenities) : project.amenities;
            return Array.isArray(a) ? a : [];
        } catch {
            return [];
        }
    };

    const images = getImages();
    const amenities = getAmenities();

    return (
        <div className="bg-background min-h-screen pb-20">
            <ProjectHero
                title={project.title}
                location={project.location_details ? `${project.location} · ${project.location_details}` : project.location}
                image={images[0]}
                status={project.status === "active" ? "Ready" : "Ongoing"}
            />

            <section className="container mx-auto px-6 lg:px-12 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif text-foreground mb-6">Overview</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-card border border-border">
                            <div className="text-center">
                                <Bed className="text-primary mx-auto mb-2" size={28} />
                                <span className="block text-2xl font-bold text-foreground">{project.bedrooms || 0}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Beds</span>
                            </div>
                            <div className="text-center">
                                <Bath className="text-primary mx-auto mb-2" size={28} />
                                <span className="block text-2xl font-bold text-foreground">{project.bathrooms || 0}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Baths</span>
                            </div>
                            <div className="text-center">
                                <Maximize className="text-primary mx-auto mb-2" size={28} />
                                <span className="block text-2xl font-bold text-foreground">{project.sqft || 0}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Sqft</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-foreground mt-1">{project.floors || 0}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest block mt-4">Floors</span>
                            </div>
                        </div>

                        {(project.land_area || project.land_orientation || project.front_road || project.num_units || project.unit_size || project.num_basements || project.car_parking) && (
                            <div>
                                <h2 className="text-3xl font-serif text-foreground mb-6">Land & Building Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-8 bg-card border border-border">
                                    {project.land_area && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Land Area</span>
                                            <span className="text-lg font-medium text-foreground">{project.land_area}</span>
                                        </div>
                                    )}
                                    {project.land_orientation && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Land Orientation</span>
                                            <span className="text-lg font-medium text-foreground">{project.land_orientation}</span>
                                        </div>
                                    )}
                                    {project.front_road && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Front Road</span>
                                            <span className="text-lg font-medium text-foreground">{project.front_road}</span>
                                        </div>
                                    )}
                                    {project.floors && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Number of Floors</span>
                                            <span className="text-lg font-medium text-foreground">{project.floors}</span>
                                        </div>
                                    )}
                                    {project.num_units && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Number of Units</span>
                                            <span className="text-lg font-medium text-foreground">{project.num_units}</span>
                                        </div>
                                    )}
                                    {project.unit_size && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Size of Units</span>
                                            <span className="text-lg font-medium text-foreground">{project.unit_size}</span>
                                        </div>
                                    )}
                                    {project.num_basements && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Number of Basements</span>
                                            <span className="text-lg font-medium text-foreground">{project.num_basements}</span>
                                        </div>
                                    )}
                                    {project.car_parking && (
                                        <div className="border-b border-border pb-4">
                                            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Number of Car Parking</span>
                                            <span className="text-lg font-medium text-foreground">{project.car_parking}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {amenities.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-serif text-foreground mb-6">Premium Amenities</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                                            <CheckCircle2 className="text-primary shrink-0" size={20} />
                                            <span className="text-lg">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery Section */}
                        {images.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-serif text-foreground mb-6">Property Gallery</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className="relative h-48 w-full overflow-hidden border border-border group cursor-pointer"
                                        >
                                            <Image
                                                src={img}
                                                alt={`${project.title} Gallery ${idx + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h2 className="text-3xl font-serif text-foreground mb-6">Location Map</h2>
                            <div className="w-full">
                                <MapViewer
                                    latitude={project.latitude}
                                    longitude={project.longitude}
                                    title={project.title}
                                />
                            </div>
                            {project.location_details && (
                                <p className="text-muted-foreground mt-4 text-lg">
                                    <span className="font-semibold text-foreground">Address:</span> {project.location_details}
                                </p>
                            )}
                        </div>

                        {/* Video Tour Section */}
                        {project.video_url && (project.video_url.includes("youtube.com") || project.video_url.includes("youtu.be")) && (
                            <div>
                                <h2 className="text-3xl font-serif text-foreground mb-6">Video Tour</h2>
                                <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-black">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${project.video_url.includes("v=") ? project.video_url.split("v=")[1]?.split("&")[0] : project.video_url.split("/").pop()}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-card border border-border p-8 sticky top-32">
                            <h3 className="text-2xl font-serif text-foreground mb-2">Interested?</h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Leave your details and our property consultant will get back to you shortly.
                            </p>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-1">Name</label>
                                    <input type="text" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-1">Email</label>
                                    <input type="email" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                                    <input type="tel" className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-1">Message</label>
                                    <textarea rows={4} className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors"></textarea>
                                </div>
                                <Button type="submit" className="w-full">Submit Inquiry</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {selectedImageIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <div 
                        className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Prev Button */}
                        <button 
                            className="absolute left-4 z-10 bg-black/60 text-white rounded-full p-3 hover:bg-primary hover:text-black transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
                            }}
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <img
                            src={images[selectedImageIndex]}
                            alt="Full screen preview"
                            className="max-w-full max-h-full object-contain rounded border border-white/10"
                        />

                        {/* Next Button */}
                        <button 
                            className="absolute right-4 z-10 bg-black/60 text-white rounded-full p-3 hover:bg-primary hover:text-black transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((prev) => (prev + 1) % images.length);
                            }}
                            aria-label="Next image"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <button
                            className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-red-600 transition-colors cursor-pointer"
                            onClick={() => setSelectedImageIndex(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1 text-sm rounded-full">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
