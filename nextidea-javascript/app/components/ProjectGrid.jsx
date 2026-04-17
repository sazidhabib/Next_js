"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getDemos } from "../lib/api";
import DemoCard from "./DemoCard";
import { Loader2 } from "lucide-react";

export default function ProjectGrid({ categoryId, title = "OUR DESIGNED WEBSITES" }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await getDemos({ 
                    category_id: categoryId,
                    limit: 3 
                });
                if (res.success) {
                    setProjects(res.data.demos);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-zinc-500">Loading projects...</p>
            </div>
        );
    }

    if (projects.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-zinc-900 mb-4 uppercase tracking-wider">
                        {title}
                    </h2>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-24 h-1 bg-primary mx-auto rounded-full origin-center"
                    />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <DemoCard demo={project} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
