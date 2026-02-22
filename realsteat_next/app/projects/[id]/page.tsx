import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ProjectHero } from "@/components/ui/ProjectHero";
import { Bed, Bath, Maximize, CheckCircle2 } from "lucide-react";

// Project data
const projectsData: Record<string, any> = {
    "1": {
        title: "The Oasis Residences",
        location: "Gulshan, Dhaka",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        ],
        price: "Start from $1,200,000",
        description: "The Oasis Residences represents the pinnacle of luxury living in the heart of Gulshan. Featuring state-of-the-art architecture, premium fittings, and uninterrupted views of the city skyline, these limited-edition apartments are designed for the truly discerning.",
        stats: { beds: 4, baths: 4, sqft: 3500, floors: 14, status: "Ongoing" },
        amenities: ["Infinity Swimming Pool", "Fully Equipped Gymnasium", "Rooftop BBQ & Lounge", "24/7 Multi-tier Security", "Full Power Backup", "Children's Play Area"]
    },
    "2": {
        title: "Azure Commercial Skyline",
        location: "Banani, Dhaka",
        images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80"
        ],
        price: "Contact for Details",
        description: "Azure Commercial Skyline is a state-of-the-art commercial complex designed for modern businesses. With premium office spaces, advanced amenities, and strategic location in Banani, it's ideal for corporate headquarters and upscale retail operations.",
        stats: { beds: 0, baths: 0, sqft: 5500, floors: 20, status: "Ready" },
        amenities: ["Premium Office Spaces", "High-Speed Internet", "Executive Dining", "Conference Facilities", "24/7 Security", "Ample Parking"]
    },
    "3": {
        title: "Crescent Lake Villas",
        location: "Bashundhara R/A",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"
        ],
        price: "Sold Out",
        description: "Crescent Lake Villas offers exclusive waterfront living with stunning vistas. These ultra-luxury villas feature private gardens, modern architecture, and access to recreational facilities including a pristine lake and golf course.",
        stats: { beds: 5, baths: 6, sqft: 4800, floors: 3, status: "Ready" },
        amenities: ["Private Lake Access", "Golf Course", "Spa & Wellness Center", "Private Beach", "Security Gate", "Smart Home Technology"]
    },
    "4": {
        title: "Pinnacle Business Center",
        location: "Motijheel, Dhaka",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        ],
        price: "Contact for Details",
        description: "Pinnacle Business Center is the ultimate destination for enterprises seeking premium workspace solutions. Located in the financial hub of Motijheel, it combines luxury with functionality for discerning business owners.",
        stats: { beds: 0, baths: 0, sqft: 6000, floors: 25, status: "Upcoming" },
        amenities: ["Premium Workspaces", "Board Rooms", "Co-working Spaces", "Premium Cafe", "Business Lounge", "Advanced Security"]
    },
    "5": {
        title: "Serenity Heights",
        location: "Uttara, Dhaka",
        images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        ],
        price: "Start from $850,000",
        description: "Serenity Heights brings tranquility to urban living with carefully planned residences in Uttara. Perfect for families, these apartments combine affordability with modern amenities and a green environment.",
        stats: { beds: 3, baths: 3, sqft: 2200, floors: 18, status: "Ongoing" },
        amenities: ["Green Spaces", "Community Park", "Kids Play Area", "Fitness Center", "Swimming Pool", "24/7 Surveillance"]
    }
};

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projectsData[id];

    if (!project) {
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

    return (
        <div className="bg-background min-h-screen pb-20">
            <ProjectHero
                title={project.title}
                location={project.location}
                image={project.images[0]}
                status={project.stats.status}
            />

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
                                {project.amenities.map((amenity: string, idx: number) => (
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
