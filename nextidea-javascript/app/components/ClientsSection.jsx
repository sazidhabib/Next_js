"use client";

import Image from "next/image";

const clients = [
    { name: "TechCorp", logo: "https://dummyimage.com/120x60/2563eb/ffffff&text=TechCorp" },
    { name: "Global Media", logo: "https://dummyimage.com/120x60/dc2626/ffffff&text=Global+Media" },
    { name: "Innovate Labs", logo: "https://dummyimage.com/120x60/16a34a/ffffff&text=Innovate" },
    { name: "Bright Solutions", logo: "https://dummyimage.com/120x60/9333ea/ffffff&text=Bright" },
    { name: "Prime Digital", logo: "https://dummyimage.com/120x60/db2777/ffffff&text=Prime" },
    { name: "NextGen Systems", logo: "https://dummyimage.com/120x60/0891b2/ffffff&text=NextGen" },
    { name: "Urban Brand", logo: "https://dummyimage.com/120x60/ca8a04/ffffff&text=Urban" },
    { name: "Peak Performance", logo: "https://dummyimage.com/120x60/4f46e5/ffffff&text=Peak" },
    { name: "Creative Hub", logo: "https://dummyimage.com/120x60/ea580c/ffffff&text=Creative" },
    { name: "Future Works", logo: "https://dummyimage.com/120x60/65a30d/ffffff&text=Future" },
    { name: "Vertex Agency", logo: "https://dummyimage.com/120x60/7c3aed/ffffff&text=Vertex" },
    { name: "Core Industries", logo: "https://dummyimage.com/120x60/0d9488/ffffff&text=Core" },
];

export default function ClientsSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 uppercase tracking-widest mb-4">
                        Our Clients
                    </h2>
                    <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {clients.map((client, index) => (
                        <div key={index} className="w-32 h-20 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                            {client.logo ? (
                                <Image 
                                    src={client.logo} 
                                    alt={client.name}
                                    width={80}
                                    height={40}
                                    className="object-contain"
                                    unoptimized
                                />
                            ) : (
                                <span className="text-zinc-400 font-semibold text-sm">
                                    {client.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
