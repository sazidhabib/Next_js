"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const clients = [
    { name: "Nova IVF", logo: "/clients/com1.png" },
    { name: "Fosroc", logo: "/clients/com2.jpg" },
    { name: "Priyo Shop", logo: "/clients/com3.jpg" },
    { name: "Stygen", logo: "/clients/com4.jpg" },
    { name: "Orbit", logo: "/clients/com5.jpg" },
    { name: "Fresh", logo: "/clients/com6.jpg" },
    { name: "Bashundhara", logo: "/clients/com7.jpg" },
    { name: "Energypac", logo: "/clients/com8.jpg" },
    { name: "Prime Bank", logo: "/clients/com9.jpg" },
    { name: "ACI", logo: "/clients/com10.jpg" },
    { name: "Yamaha", logo: "/clients/yamaha.svg" },
    { name: "Haier", logo: "/clients/haier.svg" },
    { name: "Nagad", logo: "/clients/nagad.svg" },
    { name: "Sheba", logo: "/clients/sheba.svg" },
    { name: "Pickaboo", logo: "/clients/pickaboo.svg" },
    { name: "DBL Ceramics", logo: "/clients/dbl-ceramics.svg" },
];

function ClientLogo({ client }) {
    const [imageError, setImageError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="w-full h-20 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
        >
            {imageError || !client.logo ? (
                <span className="text-zinc-600 font-bold text-sm text-center px-2">
                    {client.name}
                </span>
            ) : (
                <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain"
                    onError={() => setImageError(true)}
                />
            )}
        </motion.div>
    );
}

export default function ClientsSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 uppercase tracking-widest mb-4">
                        Our Clients
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-16 h-1 bg-primary mx-auto rounded-full origin-center"
                    />
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {clients.map((client, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
                        >
                            <ClientLogo client={client} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
