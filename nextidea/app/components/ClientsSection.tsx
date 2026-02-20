"use client";

import Image from "next/image";

// Placeholder data for clients - ideally these would be actual logo images
const clients = [
    { name: "Client 1", logo: null },
    { name: "Client 2", logo: null },
    { name: "Client 3", logo: null },
    { name: "Client 4", logo: null },
    { name: "Client 5", logo: null },
    { name: "Client 6", logo: null },
    { name: "Client 7", logo: null },
    { name: "Client 8", logo: null },
    { name: "Client 9", logo: null },
    { name: "Client 10", logo: null },
    { name: "Client 11", logo: null },
    { name: "Client 12", logo: null },
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
                            {/* Placeholder for Logo */}
                            <span className="text-zinc-400 font-semibold text-sm">
                                {client.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
