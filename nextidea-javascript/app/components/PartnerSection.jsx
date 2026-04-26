"use client";

import { motion } from "framer-motion";

const partners = [
    { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
    { name: "Instagram", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
    { name: "YouTube", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
    { name: "Eskimi", logo: "https://media.licdn.com/dms/image/v2/C4D0BAQF_Jb_J8_J8/company-logo_200_200/company-logo_200_200/0/1630571618331?e=2147483647&v=beta&t=7_J_J_J" },
    { name: "The Daily Star", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/77/The_Daily_Star_%28Bangladesh%29_logo.png/220px-The_Daily_Star_%28Bangladesh%29_logo.png" },
];

export default function PartnerSection({
    title = "Our Partners",
    partnersList = partners
}) {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 uppercase tracking-widest mb-4">
                        {title}
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-16 h-1 bg-primary mx-auto rounded-full origin-center"
                    />
                </motion.div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 grayscale-0 hover:grayscale-0 transition-all duration-500">
                    {partnersList.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="h-12 w-auto flex items-center justify-center"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-auto object-contain max-w-[120px]"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
