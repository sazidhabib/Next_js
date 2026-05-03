"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

function ClientLogo({ client }) {
    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="w-full h-24 flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-2xl p-4 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
        >
            {imageError || !client.logo ? (
                <span className="text-zinc-600 font-bold text-xs text-center px-2">
                    {client.name}
                </span>
            ) : (
                <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain filter grayscale-0 hover:grayscale-0 transition-all duration-500"
                    onError={() => setImageError(true)}
                />
            )}
        </motion.div>
    );
}

export default function ClientsSection({ pageId }) {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // Derive pageId from pathname if not provided
        const pathSegments = pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1] || 'home';
        const derivedId = pageId || (pathname === '/' ? 'home' : lastSegment);
        const settingKey = `${derivedId}_clients`;

        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const clientData = data.data[settingKey];
                    if (clientData) {
                        setClients(JSON.parse(clientData));
                    } else if (derivedId !== 'home') {
                        // Fallback to home then global clients if service-specific ones don't exist
                        if (data.data.home_clients) {
                            setClients(JSON.parse(data.data.home_clients));
                        } else if (data.data.global_clients) {
                            setClients(JSON.parse(data.data.global_clients));
                        }
                    } else if (data.data.global_clients) {
                        setClients(JSON.parse(data.data.global_clients));
                    }
                }
            })
            .catch(err => console.error("Clients fetch error:", err))
            .finally(() => setLoading(false));
    }, [pageId, pathname]);

    if (loading || clients.length === 0) return null;

    return (
        <section className="py-24  bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-4 tracking-tight">
                        Our Trusted Clients
                    </h2>
                    <p className="text-zinc-500 max-w-2xl mx-auto">
                        We collaborate with ambitious brands to create digital excellence.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {clients.map((client, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <ClientLogo client={client} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
