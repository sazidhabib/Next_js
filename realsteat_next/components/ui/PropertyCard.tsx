import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";

interface PropertyCardProps {
    id: string;
    title: string;
    location: string;
    image: string;
    price?: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    status: "Ongoing" | "Ready" | "Upcoming";
}

export function PropertyCard({
    id,
    title,
    location,
    image,
    price,
    beds,
    baths,
    sqft,
    status,
}: PropertyCardProps) {
    return (
        <Link href={`/projects/${id}`} className="group block w-full overflow-hidden bg-card border border-white/5 hover:border-primary/50 transition-all duration-500">
            {/* Image Container */}
            <div className="relative h-72 w-full overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-background/60 backdrop-blur-md text-foreground px-3 py-1 text-xs font-semibold tracking-wider uppercase border border-border">
                    {status}
                </div>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-sm font-medium tracking-wide">{location}</span>
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">{title}</h3>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4 mb-4">
                    {beds && (
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Bed size={18} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{beds} Beds</span>
                        </div>
                    )}
                    {baths && (
                        <div className="flex flex-col items-center justify-center gap-1 border-x border-white/10">
                            <Bath size={18} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{baths} Baths</span>
                        </div>
                    )}
                    {sqft && (
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Maximize size={18} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{sqft} sqft</span>
                        </div>
                    )}
                </div>

                {/* Footer/Price */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-lg text-primary font-semibold">
                        {price ? price : "Contact for Price"}
                    </span>
                    <span className="text-sm text-foreground font-medium uppercase tracking-widest group-hover:underline underline-offset-4 decoration-primary transition-all">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    );
}
