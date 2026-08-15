"use client";
import React, { useState, useEffect, useRef } from "react";
import { Save, Image as ImageIcon, Loader2, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PAGE_SECTIONS = [
    { key: "home_hero", label: "Home Hero Banner" },
    { key: "about_us", label: "About Us Section" },
    { key: "footer", label: "Footer Settings" }
];

export default function PagesManager() {
    const [selectedKey, setSelectedKey] = useState("home_hero");

    // Loading & message states
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    // ----------------------------------------------------
    // STATE FOR HOME HERO (syncs with Settings table/API)
    // ----------------------------------------------------
    const [heroTitle, setHeroTitle] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [existingHeroImages, setExistingHeroImages] = useState([]);
    const [heroPreviews, setHeroPreviews] = useState([]);
    const [heroFiles, setHeroFiles] = useState([]);
    const heroInputRef = useRef(null);
    const [homepageStatistics, setHomepageStatistics] = useState([]);

    // ----------------------------------------------------
    // STATE FOR ABOUT US (syncs with Pages table/API)
    // ----------------------------------------------------
    const [aboutSubtitle, setAboutSubtitle] = useState(""); // e.g. "THE LEGACY"
    const [aboutTitle, setAboutTitle] = useState("");       // e.g. "Crafting Architectural Masterpieces Since 1995"
    const [aboutPara1, setAboutPara1] = useState("");
    const [aboutPara2, setAboutPara2] = useState("");
    const [aboutImage, setAboutImage] = useState("");
    const [aboutFile, setAboutFile] = useState(null);
    const [aboutPreviewUrl, setAboutPreviewUrl] = useState("");

    const [storyImages, setStoryImages] = useState([]);
    const [coreValues, setCoreValues] = useState([]);
    const [leadershipTeam, setLeadershipTeam] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Footer states
    const [footerSiteName, setFooterSiteName] = useState("");
    const [footerDesc, setFooterDesc] = useState("");

    const handleImageUpload = async (file, callback) => {
        setIsUploading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(`${apiUrl}/pages/upload-image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to upload image");
            }
            const data = await res.json();
            callback(data.image_url);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const fetchPageData = async (key) => {
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            if (key === "home_hero") {
                // Fetch settings
                const res = await fetch(`${apiUrl}/settings`);
                if (!res.ok) throw new Error("Failed to load hero configurations");
                const data = await res.json();
                setHeroTitle(data.hero_title || "");
                setHeroDescription(data.hero_description || "");
                
                if (data.hero_images) {
                    try {
                        const imgs = typeof data.hero_images === 'string'
                            ? JSON.parse(data.hero_images)
                            : data.hero_images;
                        setExistingHeroImages(Array.isArray(imgs) ? imgs : []);
                    } catch (e) {
                        setExistingHeroImages([]);
                    }
                } else {
                    setExistingHeroImages([]);
                }
                setHeroPreviews([]);
                setHeroFiles([]);

                // Parse homepage_statistics
                let stats = [];
                if (data.homepage_statistics) {
                    try {
                        stats = typeof data.homepage_statistics === 'string'
                            ? JSON.parse(data.homepage_statistics)
                            : data.homepage_statistics;
                    } catch (e) {
                        stats = [];
                    }
                }
                if (!stats || stats.length === 0) {
                    stats = [
                        { value: "25+", label: "Years of Experience", icon: "Trophy" },
                        { value: "150+", label: "Projects Delivered", icon: "Building" },
                        { value: "8k+", label: "Happy Families", icon: "Users" },
                        { value: "100%", label: "Handover Accuracy", icon: "ShieldCheck" }
                    ];
                }
                setHomepageStatistics(stats);
            } else if (key === "about_us") {
                // Fetch page configs
                const res = await fetch(`${apiUrl}/pages/about_us`);
                if (res.ok) {
                    const data = await res.json();
                    setAboutTitle(data.title || "");
                    setAboutSubtitle(data.subtitle || "");
                    setAboutImage(data.image_url || "");
                    
                    const content = data.content || "";
                    const paragraphs = content.split(/\n\s*\n/);
                    setAboutPara1(paragraphs[0] || "");
                    setAboutPara2(paragraphs.slice(1).join("\n\n") || "");

                    // Parse story_images
                    let storyImgs = [];
                    try {
                        storyImgs = data.story_images ? (typeof data.story_images === 'string' ? JSON.parse(data.story_images) : data.story_images) : [];
                    } catch(e){}
                    setStoryImages(Array.isArray(storyImgs) ? storyImgs : []);

                    // Parse core_values
                    let cvs = [];
                    try {
                        cvs = data.core_values ? (typeof data.core_values === 'string' ? JSON.parse(data.core_values) : data.core_values) : [];
                    } catch(e){}
                    setCoreValues(Array.isArray(cvs) ? cvs : []);

                    // Parse leadership_team
                    let leaders = [];
                    try {
                        leaders = data.leadership_team ? (typeof data.leadership_team === 'string' ? JSON.parse(data.leadership_team) : data.leadership_team) : [];
                    } catch(e){}
                    setLeadershipTeam(Array.isArray(leaders) ? leaders : []);

                } else if (res.status === 404) {
                    // Seed defaults if not in db
                    setAboutTitle("Crafting Architectural Masterpieces Since 1995");
                    setAboutSubtitle("THE LEGACY");
                    setAboutPara1("PRESIDENT PROPERTIES is synonymous with innovation, quality, and architectural brilliance in the real estate sector. With over two decades of experience, we have transformed city skylines and delivered premium lifestyles.");
                    setAboutPara2("Our uncompromising commitment to perfection, use of high-end materials, and dedication to timely delivery make us the most trusted name in luxury real estate.");
                    setAboutImage("");
                    setStoryImages([
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    ]);
                    setCoreValues([
                        { title: "Innovation", description: "Embracing the latest technologies and design trends to craft modern living spaces." },
                        { title: "Integrity", description: "Operating with complete transparency and honesty in all our dealings." },
                        { title: "Excellence", description: "Pursuing perfection in every detail, from foundation to the final finish." }
                    ]);
                    setLeadershipTeam([
                        { role: "Chairman", name: "Ahmed Rahman", image_url: "" },
                        { role: "Managing Director", name: "Tariq Hasan", image_url: "" },
                        { role: "Director of Architecture", name: "Sarah Khan", image_url: "" }
                    ]);
                } else {
                    throw new Error("Failed to load about us configuration");
                }
                setAboutFile(null);
                setAboutPreviewUrl("");
            } else if (key === "footer") {
                const res = await fetch(`${apiUrl}/settings`);
                if (!res.ok) throw new Error("Failed to load footer settings");
                const data = await res.json();
                setFooterSiteName(data.site_name || "");
                setFooterDesc(data.site_description || "");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData(selectedKey);
    }, [selectedKey]);

    // Hero image actions
    const handleHeroImagesSelect = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setHeroFiles((prev) => [...prev, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setHeroPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeExistingHeroImage = (indexToRemove) => {
        setExistingHeroImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const removeNewHeroImage = (indexToRemove) => {
        setHeroFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
        setHeroPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // About image action
    const handleAboutFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAboutFile(file);
            setAboutPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            if (selectedKey === "home_hero") {
                formData.append("hero_title", heroTitle);
                formData.append("hero_description", heroDescription);
                formData.append("existing_hero_images", JSON.stringify(existingHeroImages));
                
                for (const file of heroFiles) {
                    formData.append("hero_images", file);
                }

                formData.append("homepage_statistics", JSON.stringify(homepageStatistics));

                const res = await fetch(`${apiUrl}/settings`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Failed to update homepage hero settings");
                }

                setSuccess("Homepage Hero configurations updated successfully!");
                fetchPageData("home_hero");
            } else if (selectedKey === "about_us") {
                formData.append("title", aboutTitle);
                formData.append("subtitle", aboutSubtitle);
                const combinedContent = `${aboutPara1.trim()}\n\n${aboutPara2.trim()}`;
                formData.append("content", combinedContent);

                if (aboutFile) {
                    formData.append("image", aboutFile);
                } else {
                    formData.append("image_url", aboutImage);
                }

                formData.append("story_images", JSON.stringify(storyImages));
                formData.append("core_values", JSON.stringify(coreValues));
                formData.append("leadership_team", JSON.stringify(leadershipTeam));

                const res = await fetch(`${apiUrl}/pages/about_us`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Failed to update about us section content");
                }

                setSuccess("About Us page section updated successfully!");
                fetchPageData("about_us");
            } else if (selectedKey === "footer") {
                formData.append("site_title", footerSiteName);
                formData.append("site_description", footerDesc);

                const res = await fetch(`${apiUrl}/settings`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Failed to update footer settings");
                }

                setSuccess("Footer settings updated successfully!");
                fetchPageData("footer");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-serif font-bold text-foreground">Page Content Manager (CMS)</h1>
                <p className="text-muted-foreground mt-1">Manage header hero text, static page paragraphs, and slider banners.</p>
            </div>

            {/* Page Tab Selector */}
            <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
                {PAGE_SECTIONS.map((section) => (
                    <button
                        key={section.key}
                        onClick={() => setSelectedKey(section.key)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                            selectedKey === section.key
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {section.label}
                    </button>
                ))}
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <span>Loading configurations...</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        {selectedKey === "home_hero" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Hero Heading (H1)</label>
                                    <textarea
                                        rows={2}
                                        value={heroTitle}
                                        onChange={(e) => setHeroTitle(e.target.value)}
                                        placeholder="e.g. Elevating Luxury Living"
                                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Hero Description</label>
                                    <textarea
                                        rows={3}
                                        value={heroDescription}
                                        onChange={(e) => setHeroDescription(e.target.value)}
                                        placeholder="Discover a curated selection of exquisite residences..."
                                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-foreground block">Hero Slider Images</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {existingHeroImages.map((img, index) => (
                                            <div key={`exist-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-background">
                                                <img src={img} className="w-full h-full object-cover" alt="Hero" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingHeroImage(index)}
                                                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}

                                        {heroPreviews.map((preview, index) => (
                                            <div key={`new-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-emerald-500/30 bg-emerald-500/5">
                                                <img src={preview} className="w-full h-full object-cover" alt="New Preview" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewHeroImage(index)}
                                                    className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full"
                                                >
                                                    <X size={12} />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[10px] text-center py-0.5 font-bold">
                                                    New
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => heroInputRef.current?.click()}
                                            className="aspect-video rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all group"
                                        >
                                            <Upload size={20} className="text-primary/60 group-hover:text-primary mb-1" />
                                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Add Image</span>
                                        </button>
                                        <input
                                            ref={heroInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleHeroImagesSelect}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Upload banner images for the landing slideshow. Recommended aspect: 16:9.</p>
                                </div>

                                {/* Homepage Statistics */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                    <h3 className="text-lg font-semibold text-foreground">Homepage Statistics / Trust Counters</h3>
                                    <p className="text-xs text-muted-foreground">Manage the 4 trust metrics shown on the landing page.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {homepageStatistics.map((stat, idx) => (
                                            <div key={idx} className="p-4 border border-border rounded-lg bg-secondary/5 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-primary">Stat Card #{idx + 1}</span>
                                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                                        Icon: {stat.icon}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Value (e.g. 25+)</label>
                                                        <input
                                                            type="text"
                                                            value={stat.value}
                                                            onChange={(e) => {
                                                                const updated = [...homepageStatistics];
                                                                updated[idx].value = e.target.value;
                                                                setHomepageStatistics(updated);
                                                            }}
                                                            className="w-full p-2 bg-background border border-border rounded focus:outline-none focus:border-primary text-foreground text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Label (e.g. Years of Experience)</label>
                                                        <input
                                                            type="text"
                                                            value={stat.label}
                                                            onChange={(e) => {
                                                                const updated = [...homepageStatistics];
                                                                updated[idx].label = e.target.value;
                                                                setHomepageStatistics(updated);
                                                            }}
                                                            className="w-full p-2 bg-background border border-border rounded focus:outline-none focus:border-primary text-foreground text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedKey === "about_us" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Section Sub-title</label>
                                        <input
                                            type="text"
                                            value={aboutSubtitle}
                                            onChange={(e) => setAboutSubtitle(e.target.value)}
                                            placeholder="e.g. THE LEGACY"
                                            className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Section Title</label>
                                        <input
                                            type="text"
                                            value={aboutTitle}
                                            onChange={(e) => setAboutTitle(e.target.value)}
                                            placeholder="e.g. Crafting Architectural Masterpieces Since 1995"
                                            className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Description Paragraph 1</label>
                                    <textarea
                                        rows={4}
                                        value={aboutPara1}
                                        onChange={(e) => setAboutPara1(e.target.value)}
                                        placeholder="Add first paragraph here..."
                                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Description Paragraph 2</label>
                                    <textarea
                                        rows={4}
                                        value={aboutPara2}
                                        onChange={(e) => setAboutPara2(e.target.value)}
                                        placeholder="Add second paragraph here..."
                                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-medium text-foreground block">Corporate / Section Image</label>
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="relative w-full md:w-80 aspect-video rounded-lg border border-border bg-secondary/20 flex items-center justify-center overflow-hidden">
                                            {aboutPreviewUrl ? (
                                                <img src={aboutPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : aboutImage ? (
                                                <img src={aboutImage} alt="Existing About" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center p-4 text-muted-foreground flex flex-col items-center gap-2">
                                                    <ImageIcon size={32} />
                                                    <span className="text-xs">No image uploaded</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAboutFileChange}
                                                className="hidden"
                                                id="about-image-upload"
                                            />
                                            <label
                                                htmlFor="about-image-upload"
                                                className="inline-flex items-center justify-center px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 cursor-pointer text-foreground transition-colors"
                                            >
                                                Upload Section Image
                                            </label>
                                            <p className="text-xs text-muted-foreground">Supported format: JPG, PNG, WEBP. Recommended size: 1000x600px.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Story Side Images */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                    <h3 className="text-lg font-semibold text-foreground">Story Section Side Images</h3>
                                    <p className="text-xs text-muted-foreground">Manage the two images displayed on the side of the story section.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[0, 1].map((idx) => (
                                            <div key={idx} className="space-y-2 border border-border p-4 rounded-lg bg-secondary/5">
                                                <label className="text-sm font-medium text-foreground block">Story Image {idx + 1}</label>
                                                <div className="relative aspect-video rounded-lg border border-border bg-secondary/20 flex items-center justify-center overflow-hidden mb-2">
                                                    {storyImages[idx] ? (
                                                        <img src={storyImages[idx]} alt={`Story Image ${idx + 1}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center p-4 text-muted-foreground flex flex-col items-center gap-2">
                                                            <ImageIcon size={32} />
                                                            <span className="text-xs">No image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id={`story-img-${idx}`}
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            handleImageUpload(e.target.files[0], (url) => {
                                                                const updated = [...storyImages];
                                                                updated[idx] = url;
                                                                setStoryImages(updated);
                                                            });
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`story-img-${idx}`}
                                                    className="inline-flex w-full items-center justify-center px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 cursor-pointer text-foreground transition-colors"
                                                >
                                                    {isUploading ? "Uploading..." : `Upload Story Image ${idx + 1}`}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Core Values */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">Our Core Values</h3>
                                            <p className="text-xs text-muted-foreground text-left">Manage core values listed on the About Us page.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCoreValues([...coreValues, { title: "", description: "" }])}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-all"
                                        >
                                            <Plus size={16} /> Add Value
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {coreValues.map((val, idx) => (
                                            <div key={idx} className="p-4 border border-border rounded-lg bg-secondary/5 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-primary">Value #{idx + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCoreValues(coreValues.filter((_, i) => i !== idx))}
                                                        className="text-destructive hover:text-destructive/80 text-xs flex items-center gap-1"
                                                    >
                                                        <X size={14} /> Remove
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="md:col-span-1 space-y-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Title</label>
                                                        <input
                                                            type="text"
                                                            value={val.title}
                                                            onChange={(e) => {
                                                                const updated = [...coreValues];
                                                                updated[idx].title = e.target.value;
                                                                setCoreValues(updated);
                                                            }}
                                                            className="w-full p-2 bg-background border border-border rounded focus:outline-none focus:border-primary text-foreground text-sm"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-1">
                                                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                                                        <textarea
                                                            rows={2}
                                                            value={val.description}
                                                            onChange={(e) => {
                                                                const updated = [...coreValues];
                                                                updated[idx].description = e.target.value;
                                                                setCoreValues(updated);
                                                            }}
                                                            className="w-full p-2 bg-background border border-border rounded focus:outline-none focus:border-primary text-foreground text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Leadership Team */}
                                <div className="space-y-4 pt-6 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">Leadership Team</h3>
                                            <p className="text-xs text-muted-foreground text-left">Manage leadership members and designation profiles.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setLeadershipTeam([...leadershipTeam, { name: "", role: "", image_url: "" }])}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-all"
                                        >
                                            <Plus size={16} /> Add Member
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {leadershipTeam.map((leader, idx) => (
                                            <div key={idx} className="p-4 border border-border rounded-lg bg-secondary/5 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-primary">Member #{idx + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLeadershipTeam(leadershipTeam.filter((_, i) => i !== idx))}
                                                        className="text-destructive hover:text-destructive/80 text-xs flex items-center gap-1"
                                                    >
                                                        <X size={14} /> Remove Member
                                                    </button>
                                                </div>
                                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border flex-shrink-0 bg-background flex items-center justify-center">
                                                        {leader.image_url ? (
                                                            <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <ImageIcon size={24} className="text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                                                            <input
                                                                type="text"
                                                                value={leader.name}
                                                                onChange={(e) => {
                                                                    const updated = [...leadershipTeam];
                                                                    updated[idx].name = e.target.value;
                                                                    setLeadershipTeam(updated);
                                                                }}
                                                                className="w-full p-2 bg-background border border-border rounded focus:outline-none focus:border-primary text-foreground text-sm"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-medium text-muted-foreground">Designation / Role</label>
                                                            <input
                                                                type="text"
                                                                value={leader.role}
                                                                onChange={(e) => {
                                                                    const updated = [...leadershipTeam];
                                                                    updated[idx].role = e.target.value;
                                                                    setLeadershipTeam(updated);
                                                                }}
                                                                className="w-full p-2 bg-background border border-border rounded focus:outline-none focus:border-primary text-foreground text-sm"
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="text-xs font-medium text-muted-foreground">Member Image</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                id={`leader-img-${idx}`}
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files[0]) {
                                                                        handleImageUpload(e.target.files[0], (url) => {
                                                                            const updated = [...leadershipTeam];
                                                                            updated[idx].image_url = url;
                                                                            setLeadershipTeam(updated);
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <div className="flex gap-2">
                                                                <label
                                                                    htmlFor={`leader-img-${idx}`}
                                                                    className="inline-flex px-3 py-1.5 bg-background border border-border rounded text-xs font-medium hover:bg-secondary/50 cursor-pointer text-foreground transition-colors"
                                                                >
                                                                    Upload Photo
                                                                </label>
                                                                {leader.image_url && (
                                                                    <span className="text-xs text-muted-foreground truncate self-center max-w-xs">{leader.image_url}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedKey === "footer" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Footer Company / Site Name</label>
                                    <input
                                        type="text"
                                        value={footerSiteName}
                                        onChange={(e) => setFooterSiteName(e.target.value)}
                                        placeholder="e.g. PRESIDENT PROPERTIES"
                                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Footer Site Description (About Us brief)</label>
                                    <textarea
                                        rows={4}
                                        value={footerDesc}
                                        onChange={(e) => setFooterDesc(e.target.value)}
                                        placeholder="Add brief description displayed in the footer..."
                                        className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-border">
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                <Save size={16} />
                                {isSubmitting ? "Saving Content..." : "Save Config"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
