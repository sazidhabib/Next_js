"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blogs = [
    {
        title: "Instagram Influencers In Bangladesh",
        category: "Next Idea Solution",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
        link: "#",
        date: "2025"
    },
    {
        title: "Scaling an Agency Remotely: The Unsung Role",
        category: "Agency Life",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        link: "#",
        date: "Tips & Insights"
    },
    {
        title: "Unlock Local SEO Success: A step-by-step guide",
        category: "SEO",
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c20e?w=800&q=80",
        link: "#",
        date: "Guide"
    }
];

export default function BlogsSection() {
    return (
        <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-zinc-900 mb-4 uppercase tracking-wider">
                        Read from Next Idea Solution Blogs
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-24 h-1 bg-primary mx-auto rounded-full origin-center"
                    />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    {blog.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-zinc-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>
                                <Link
                                    href={blog.link}
                                    className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all"
                                >
                                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
