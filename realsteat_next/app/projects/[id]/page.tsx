import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MapPin, Bed, Bath, Maximize, CheckCircle2, ChevronLeft } from "lucide-react";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    // In a real app, fetch data based on params.id
    const project = {
        title: "The Oasis Residences",
        location: "Gulshan, Dhaka",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        ],
        price: "Start from $1,200,000",
        description: "The Oasis Residences represents the pinnacle of luxury living in the heart of Gulshan. Featuring state-of-the-art architecture, premium fittings, and uninterrupted views of the city skyline, these limited-edition apartments are designed for the truly discerning.",
        stats: {
            beds: 4,
            baths: 4,
            sqft: 3500,
            floors: 14,
            status: "Ongoing"
        },
        amenities: [
            "Infinity Swimming Pool",
            "Fully Equipped Gymnasium",
            "Rooftop BBQ & Lounge",
            "24/7 Multi-tier Security",
            "Full Power Backup",
            "Children's Play Area"
        ]
    };

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Hero Gallery */}
            <section className="relative h-[70vh] w-full">
                <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"></div>
                <div className="absolute top-24 left-6 lg:left-12 z-10">
                    <Link href="/projects" className="inline-flex items-center text-white hover:text-primary transition-colors text-sm font-semibold tracking-wider uppercase">
                        <ChevronLeft size={20} className="mr-1" /> Back to Projects
                    </Link>
                </div>

                <div className="absolute bottom-12 left-6 lg:left-12 z-10 max-w-3xl">
                    <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold tracking-widest uppercase mb-4">
                        {project.stats.status}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
                        {project.title}
                    </h1>
                    <div className="flex items-center text-white/90 gap-2 text-lg">
                        <MapPin className="text-primary" />
                        <span>{project.location}</span>
                    </div>
                </div>
            </section>

            {/* Content Layout */}
            <section className="container mx-auto px-6 lg:px-12 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif text-foreground mb-6">Overview</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        {/* Core Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-card border border-border">
                            <div className="text-center">
                                <Bed className="text-primary mx-auto mb-2" size={28} />
                                <span className="block text-2xl font-bold text-foreground">{project.stats.beds}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Beds</span>
                            </div>
                            <div className="text-center">
                                <Bath className="text-primary mx-auto mb-2" size={28} />
                                <span className="block text-2xl font-bold text-foreground">{project.stats.baths}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Baths</span>
                            </div>
                            <div className="text-center">
                                <Maximize className="text-primary mx-auto mb-2" size={28} />
                                <span className="block text-2xl font-bold text-foreground">{project.stats.sqft}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest">Sqft</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-foreground mt-1">{project.stats.floors}</span>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest block mt-4">Floors</span>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-3xl font-serif text-foreground mb-6">Premium Amenities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.amenities.map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-muted-foreground">
                                        <CheckCircle2 className="text-primary shrink-0" size={20} />
                                        <span className="text-lg">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Render Map Placeholder */}
                        <div>
                            <h2 className="text-3xl font-serif text-foreground mb-6">Location Map</h2>
                            <div className="w-full h-[400px] bg-secondary/20 border border-border flex items-center justify-center text-muted-foreground">
                                <p>Google Maps Embed goes here (Requires API Key)</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Inquiry Form */}
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
        </div>
    );
}
