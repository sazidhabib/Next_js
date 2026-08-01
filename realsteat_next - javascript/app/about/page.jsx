"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AboutPage() {
    const [aboutData, setAboutData] = useState(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/api"}/pages/about_us`);
                if (res.ok) {
                    const data = await res.json();
                    setAboutData(data);
                }
            } catch (err) {
                console.error("Failed to fetch about data", err);
            }
        };
        fetchAboutData();
    }, []);
    let storyImages = [];
    try {
        storyImages = aboutData?.story_images
            ? (typeof aboutData.story_images === "string" ? JSON.parse(aboutData.story_images) : aboutData.story_images)
            : [];
    } catch (e) {
        console.error("Error parsing story_images", e);
    }
    if (!storyImages || storyImages.length === 0) {
        storyImages = [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ];
    }

    let coreValues = [];
    try {
        coreValues = aboutData?.core_values
            ? (typeof aboutData.core_values === "string" ? JSON.parse(aboutData.core_values) : aboutData.core_values)
            : [];
    } catch (e) {
        console.error("Error parsing core_values", e);
    }
    if (!coreValues || coreValues.length === 0) {
        coreValues = [
            { title: "Innovation", description: "Embracing the latest technologies and design trends to craft modern living spaces." },
            { title: "Integrity", description: "Operating with complete transparency and honesty in all our dealings." },
            { title: "Excellence", description: "Pursuing perfection in every detail, from foundation to the final finish." }
        ];
    }

    let leadershipTeam = [];
    try {
        leadershipTeam = aboutData?.leadership_team
            ? (typeof aboutData.leadership_team === "string" ? JSON.parse(aboutData.leadership_team) : aboutData.leadership_team)
            : [];
    } catch (e) {
        console.error("Error parsing leadership_team", e);
    }
    if (!leadershipTeam || leadershipTeam.length === 0) {
        leadershipTeam = [
            { role: "Chairman", name: "Ahmed Rahman", image_url: "" },
            { role: "Managing Director", name: "Tariq Hasan", image_url: "" },
            { role: "Director of Architecture", name: "Sarah Khan", image_url: "" }
        ];
    }

    return (
        <div className="pt-24 pb-20 min-h-screen bg-background">
            {/* Header */}
            <section className="bg-background py-20 border-b border-border flex items-center justify-center text-center relative overflow-hidden h-[40vh]">
                <div className="absolute inset-0 z-0 opacity-40">
                    <Image
                        src={aboutData?.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"}
                        alt="Corporate"
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>
                <div className="relative z-10 px-6">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
                        {aboutData?.subtitle || "Corporate Profile"}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground">
                        About President Properties Ltd.
                    </h1>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
                            {aboutData?.title || "A Legacy Built on Trust, Quality, and Perfection."}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                            {aboutData?.content ? aboutData.content.split("\n\n")[0] : "Founded in 1995, President Properties embarked on a journey to redefine the real estate landscape. From our humble beginnings to becoming a leading property developer, our sole focus has been on delivering uncompromised quality and bringing architectural visions to life."}
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {aboutData?.content ? aboutData.content.split("\n\n")[1] : "We don't just build structures; we build communities. Every project is meticulously planned to ensure sustainability, aesthetic brilliance, and maximum return on investment for our clients."}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {storyImages.slice(0, 2).map((imgUrl, sIdx) => (
                            <div key={sIdx} className={`relative h-64 w-full ${sIdx === 1 ? "translate-y-8" : ""}`}>
                                <Image src={imgUrl} alt={`Story image ${sIdx + 1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 bg-card border-y border-white/5">
                <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
                    <h2 className="text-3xl font-serif text-foreground mb-12">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {coreValues.map((val, idx) => (
                            <div key={idx}>
                                <h3 className="text-xl text-primary font-semibold mb-4 uppercase tracking-widest">{val.title}</h3>
                                <p className="text-muted-foreground">{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="py-24">
                <div className="container mx-auto px-6 lg:px-12">
                    <h2 className="text-3xl font-serif text-foreground mb-16 text-center">Leadership Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {leadershipTeam.map((leader, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                                    {leader.image_url ? (
                                        <Image src={leader.image_url} alt={leader.name} fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-border flex items-center justify-center text-muted-foreground text-sm uppercase">No Pic</div>
                                    )}
                                </div>
                                <h4 className="text-xl text-foreground font-medium mb-1">{leader.name}</h4>
                                <p className="text-primary text-sm uppercase tracking-widest">{leader.role || leader.designation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
