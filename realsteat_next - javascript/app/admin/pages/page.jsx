"use client";
import React, { useState, useEffect, useRef } from "react";
import { Save, Image as ImageIcon, Loader2, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PAGE_SECTIONS = [
    { key: "home_hero", label: "Home Hero Banner" },
    { key: "about_us", label: "About Us Section" }
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
            } else if (key === "about_us") {
                // Fetch page configs
                const res = await fetch(`${apiUrl}/pages/about_us`);
                if (res.ok) {
                    const data = await res.json();
                    setAboutTitle(data.title || "");
                    setAboutSubtitle(data.subtitle || "");
                    setAboutImage(data.image_url || "");
                    
                    const content = data.content || "";
                    const paragraphs = content.split("\n\n");
                    setAboutPara1(paragraphs[0] || "");
                    setAboutPara2(paragraphs[1] || "");
                } else if (res.status === 404) {
                    // Seed defaults if not in db
                    setAboutTitle("Crafting Architectural Masterpieces Since 1995");
                    setAboutSubtitle("THE LEGACY");
                    setAboutPara1("PRESIDENT PROPERTIES is synonymous with innovation, quality, and architectural brilliance in the real estate sector. With over two decades of experience, we have transformed city skylines and delivered premium lifestyles.");
                    setAboutPara2("Our uncompromising commitment to perfection, use of high-end materials, and dedication to timely delivery make us the most trusted name in luxury real estate.");
                    setAboutImage("");
                } else {
                    throw new Error("Failed to load about us configuration");
                }
                setAboutFile(null);
                setAboutPreviewUrl("");
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
