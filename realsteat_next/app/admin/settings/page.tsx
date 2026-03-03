"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
    Settings,
    Image as ImageIcon,
    Globe,
    Phone,
    Mail,
    MapPin,
    FileText,
    Star,
    Upload,
    X,
    Check,
    AlertCircle,
    Loader2,
    Facebook,
    Youtube,
    Instagram,
    Twitter,
    ExternalLink,
    Clock,
} from "lucide-react";

interface SiteSettings {
    id: number;
    site_name: string;
    logo_url: string | null;
    favicon_url: string | null;
    support_email: string;
    helpline_number: string;
    footer_text: string;
    site_description: string;
    facebook_url: string;
    youtube_url: string;
    instagram_url: string;
    x_url: string;
    website_url: string;
    address_text: string;
    hero_frame_id: number | null;
    hero_title: string;
    hero_description: string;
    hotline_number: string;
    secondary_email: string;
    business_hours: string;
    hero_images: string | string[]; // Can be stringified JSON from DB or array
}

interface Project {
    id: number;
    title: string;
    image_url: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [activeTab, setActiveTab] = useState<"branding" | "contact" | "content" | "social" | "hero">("branding");

    // File state
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    // Hero multi-image state
    const [heroFiles, setHeroFiles] = useState<File[]>([]);
    const [heroPreviews, setHeroPreviews] = useState<string[]>([]);
    const [existingHeroImages, setExistingHeroImages] = useState<string[]>([]);
    const heroInputRef = useRef<HTMLInputElement>(null);

    // Form fields
    const [siteName, setSiteName] = useState("");
    const [supportEmail, setSupportEmail] = useState("");
    const [helplineNumber, setHelplineNumber] = useState("");
    const [footerText, setFooterText] = useState("");
    const [siteDescription, setSiteDescription] = useState("");
    const [facebookUrl, setFacebookUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [xUrl, setXUrl] = useState("");
    const [addressText, setAddressText] = useState("");
    const [heroFrameId, setHeroFrameId] = useState<string>("");

    // New fields
    const [heroTitle, setHeroTitle] = useState("");
    const [heroDescription, setHeroDescription] = useState("");
    const [hotlineNumber, setHotlineNumber] = useState("");
    const [secondaryEmail, setSecondaryEmail] = useState("");
    const [businessHours, setBusinessHours] = useState("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    useEffect(() => {
        fetchSettings();
        fetchProjects();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${apiUrl}/settings`);
            if (!res.ok) throw new Error("Failed to load settings");
            const data: SiteSettings = await res.json();
            setSettings(data);
            setSiteName(data.site_name || "");
            setSupportEmail(data.support_email || "");
            setHelplineNumber(data.helpline_number || "");
            setFooterText(data.footer_text || "");
            setSiteDescription(data.site_description || "");
            setFacebookUrl(data.facebook_url || "");
            setYoutubeUrl(data.youtube_url || "");
            setInstagramUrl(data.instagram_url || "");
            setXUrl(data.x_url || "");
            setAddressText(data.address_text || "");
            setHeroFrameId(data.hero_frame_id ? String(data.hero_frame_id) : "");

            setHeroTitle(data.hero_title || "");
            setHeroDescription(data.hero_description || "");
            setHotlineNumber(data.hotline_number || "");
            setSecondaryEmail(data.secondary_email || "");
            setBusinessHours(data.business_hours || "");

            // Handle hero images
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

        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${apiUrl}/frames`);
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            console.error("Failed to fetch projects", err);
        }
    };

    const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFaviconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFaviconFile(file);
            setFaviconPreview(URL.createObjectURL(file));
        }
    };

    const clearLogoPreview = () => {
        setLogoFile(null);
        if (logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoPreview(null);
        if (logoInputRef.current) logoInputRef.current.value = "";
    };

    const clearFaviconPreview = () => {
        setFaviconFile(null);
        if (faviconPreview) URL.revokeObjectURL(faviconPreview);
        setFaviconPreview(null);
        if (faviconInputRef.current) faviconInputRef.current.value = "";
    };

    // Hero image handlers
    const handleHeroImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setHeroFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setHeroPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewHeroImage = (index: number) => {
        const newFiles = [...heroFiles];
        const newPreviews = [...heroPreviews];

        URL.revokeObjectURL(newPreviews[index]);
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setHeroFiles(newFiles);
        setHeroPreviews(newPreviews);
    };

    const removeExistingHeroImage = (index: number) => {
        const newExisting = [...existingHeroImages];
        newExisting.splice(index, 1);
        setExistingHeroImages(newExisting);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();

            formData.append("site_title", siteName);
            formData.append("support_email", supportEmail);
            formData.append("helpline_number", helplineNumber);
            formData.append("footer_text", footerText);
            formData.append("site_description", siteDescription);
            formData.append("facebook_url", facebookUrl);
            formData.append("youtube_url", youtubeUrl);
            formData.append("instagram_url", instagramUrl);
            formData.append("x_url", xUrl);
            formData.append("address_text", addressText);
            formData.append("hero_frame_id", heroFrameId);

            formData.append("hero_title", heroTitle);
            formData.append("hero_description", heroDescription);
            formData.append("hotline_number", hotlineNumber);
            formData.append("secondary_email", secondaryEmail);
            formData.append("business_hours", businessHours);
            formData.append("existing_hero_images", JSON.stringify(existingHeroImages));

            if (logoFile) formData.append("logo", logoFile);
            if (faviconFile) formData.append("favicon", faviconFile);

            heroFiles.forEach(file => {
                formData.append("hero_images", file);
            });

            const res = await fetch(`${apiUrl}/settings`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save settings");
            }

            setSuccessMsg("Settings saved successfully!");
            clearLogoPreview();
            clearFaviconPreview();
            setHeroFiles([]);
            setHeroPreviews([]);
            await fetchSettings();

            setTimeout(() => setSuccessMsg(""), 4000);
        } catch (err: any) {
            setErrorMsg(err.message);
            setTimeout(() => setErrorMsg(""), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: "branding" as const, label: "Branding", icon: ImageIcon },
        { id: "contact" as const, label: "Contact", icon: Phone },
        { id: "content" as const, label: "Content", icon: FileText },
        { id: "social" as const, label: "Social", icon: Globe },
        { id: "hero" as const, label: "Hero", icon: Star },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
                        <Settings className="text-primary" size={28} />
                        Site Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your site branding, contact details, and configurations.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                >
                    {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : (
                        <Check size={16} />
                    )}
                    {isSaving ? "Saving..." : "Save Settings"}
                </Button>
            </div>

            {/* Status Messages */}
            {successMsg && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm animate-in fade-in">
                    <Check size={18} />
                    {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm">
                    <AlertCircle size={18} />
                    {errorMsg}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-secondary/30 rounded-xl overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-background text-foreground shadow-sm border border-border"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {/* =================== BRANDING TAB =================== */}
                {activeTab === "branding" && (
                    <div className="p-6 md:p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">Branding</h3>
                            <p className="text-sm text-muted-foreground">
                                Upload your site logo and favicon. These appear in the browser tab and across your website.
                            </p>
                        </div>

                        {/* Site Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={siteName}
                                onChange={(e) => setSiteName(e.target.value)}
                                placeholder="e.g. President Properties"
                                className="w-full max-w-lg p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                            />
                        </div>

                        {/* Logo Upload */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <ImageIcon size={16} className="text-primary" />
                                Site Logo
                            </label>
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                {/* Current Logo */}
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Current
                                    </p>
                                    <div className="w-40 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-background overflow-hidden">
                                        {settings?.logo_url ? (
                                            <img
                                                src={settings.logo_url}
                                                alt="Current logo"
                                                className="max-w-full max-h-full object-contain p-2"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No logo set</span>
                                        )}
                                    </div>
                                </div>

                                {/* New Logo Preview */}
                                {logoPreview && (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
                                            New
                                        </p>
                                        <div className="relative w-40 h-24 rounded-lg border-2 border-emerald-500/40 flex items-center justify-center bg-emerald-500/5 overflow-hidden">
                                            <img
                                                src={logoPreview}
                                                alt="New logo preview"
                                                className="max-w-full max-h-full object-contain p-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearLogoPreview}
                                                className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-md hover:scale-110 transition-transform"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Upload
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        className="w-40 h-24 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group"
                                    >
                                        <Upload
                                            size={20}
                                            className="text-primary/60 group-hover:text-primary transition-colors mb-1"
                                        />
                                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                            Choose File
                                        </span>
                                    </button>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoSelect}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        PNG, SVG, JPG · Max 2MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-border" />

                        {/* Favicon Upload */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <Star size={16} className="text-primary" />
                                Favicon (Browser Tab Icon)
                            </label>
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                {/* Current Favicon */}
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Current
                                    </p>
                                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-background overflow-hidden">
                                        {settings?.favicon_url ? (
                                            <img
                                                src={settings.favicon_url}
                                                alt="Current favicon"
                                                className="max-w-full max-h-full object-contain p-2"
                                            />
                                        ) : (
                                            <span className="text-xs text-muted-foreground text-center leading-tight">
                                                No icon
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* New Favicon Preview */}
                                {faviconPreview && (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">
                                            New
                                        </p>
                                        <div className="relative w-20 h-20 rounded-lg border-2 border-emerald-500/40 flex items-center justify-center bg-emerald-500/5 overflow-hidden">
                                            <img
                                                src={faviconPreview}
                                                alt="New favicon preview"
                                                className="max-w-full max-h-full object-contain p-2"
                                            />
                                            <button
                                                type="button"
                                                onClick={clearFaviconPreview}
                                                className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full shadow-md hover:scale-110 transition-transform"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Upload
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => faviconInputRef.current?.click()}
                                        className="w-20 h-20 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group"
                                    >
                                        <Upload
                                            size={18}
                                            className="text-primary/60 group-hover:text-primary transition-colors mb-1"
                                        />
                                        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">
                                            Choose
                                        </span>
                                    </button>
                                    <input
                                        ref={faviconInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFaviconSelect}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        ICO, PNG · 32×32 or 64×64
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* =================== CONTACT TAB =================== */}
                {activeTab === "contact" && (
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">Contact Information</h3>
                            <p className="text-sm text-muted-foreground">
                                Contact details displayed in the website footer and contact page.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Mail size={14} className="text-primary" />
                                    Support Email
                                </label>
                                <input
                                    type="email"
                                    value={supportEmail}
                                    onChange={(e) => setSupportEmail(e.target.value)}
                                    placeholder="support@example.com"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Mail size={14} className="text-primary" />
                                    Secondary Email
                                </label>
                                <input
                                    type="email"
                                    value={secondaryEmail}
                                    onChange={(e) => setSecondaryEmail(e.target.value)}
                                    placeholder="sales@example.com"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Phone size={14} className="text-primary" />
                                    Helpline Number
                                </label>
                                <input
                                    type="text"
                                    value={helplineNumber}
                                    onChange={(e) => setHelplineNumber(e.target.value)}
                                    placeholder="+880 1880-578893"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Phone size={14} className="text-primary" />
                                    Hotline (Alternative Phone)
                                </label>
                                <input
                                    type="text"
                                    value={hotlineNumber}
                                    onChange={(e) => setHotlineNumber(e.target.value)}
                                    placeholder="+880 1712-345678"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <MapPin size={14} className="text-primary" />
                                    Office Address
                                </label>
                                <textarea
                                    rows={3}
                                    value={addressText}
                                    onChange={(e) => setAddressText(e.target.value)}
                                    placeholder="123 Main Street, Gulshan, Dhaka 1212"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-none"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Clock size={14} className="text-primary" />
                                    Business Hours
                                </label>
                                <textarea
                                    rows={3}
                                    value={businessHours}
                                    onChange={(e) => setBusinessHours(e.target.value)}
                                    placeholder="Sun - Thu: 10:00 AM - 6:00 PM&#10;Fri & Sat: Closed"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* =================== CONTENT TAB =================== */}
                {activeTab === "content" && (
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">Site Content</h3>
                            <p className="text-sm text-muted-foreground">
                                General site text used for SEO meta tags and the footer.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Site Description (Meta)
                                </label>
                                <textarea
                                    rows={4}
                                    value={siteDescription}
                                    onChange={(e) => setSiteDescription(e.target.value)}
                                    placeholder="A short description of your website for search engines..."
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-y"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 150–160 characters for optimal SEO.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Footer Text
                                </label>
                                <input
                                    type="text"
                                    value={footerText}
                                    onChange={(e) => setFooterText(e.target.value)}
                                    placeholder="© 2026 Company Name. All rights reserved."
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* =================== SOCIAL TAB =================== */}
                {activeTab === "social" && (
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">Social Media Links</h3>
                            <p className="text-sm text-muted-foreground">
                                Add your social media profiles. These are displayed in the website footer.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Facebook size={14} className="text-blue-500" />
                                    Facebook URL
                                </label>
                                <input
                                    type="url"
                                    value={facebookUrl}
                                    onChange={(e) => setFacebookUrl(e.target.value)}
                                    placeholder="https://facebook.com/yourpage"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Instagram size={14} className="text-pink-500" />
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    value={instagramUrl}
                                    onChange={(e) => setInstagramUrl(e.target.value)}
                                    placeholder="https://instagram.com/yourprofile"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <X size={14} className="text-foreground" />
                                    X (Twitter) URL
                                </label>
                                <input
                                    type="url"
                                    value={xUrl}
                                    onChange={(e) => setXUrl(e.target.value)}
                                    placeholder="https://x.com/yourprofile"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Youtube size={14} className="text-red-500" />
                                    YouTube URL
                                </label>
                                <input
                                    type="url"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    placeholder="https://youtube.com/@yourchannel"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* =================== HERO TAB =================== */}
                {activeTab === "hero" && (
                    <div className="p-6 md:p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">Homepage Hero Section</h3>
                            <p className="text-sm text-muted-foreground">
                                Control the main heading, description, and slider images on the homepage.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Hero Heading (H1)
                                </label>
                                <textarea
                                    rows={2}
                                    value={heroTitle}
                                    onChange={(e) => setHeroTitle(e.target.value)}
                                    placeholder="e.g. Elevating Luxury Living"
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Hero Short Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={heroDescription}
                                    onChange={(e) => setHeroDescription(e.target.value)}
                                    placeholder="Discover a curated selection of exquisite residences..."
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                />
                            </div>

                            <hr className="border-border" />

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <ImageIcon size={16} className="text-primary" />
                                    Hero Slider Images
                                </label>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {/* Existing Images */}
                                    {existingHeroImages.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-background">
                                            <img src={img} className="w-full h-full object-cover" alt="Hero" />
                                            <button
                                                onClick={() => removeExistingHeroImage(index)}
                                                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Previews */}
                                    {heroPreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-emerald-500/30 bg-emerald-500/5">
                                            <img src={preview} className="w-full h-full object-cover" alt="New Hero" />
                                            <button
                                                onClick={() => removeNewHeroImage(index)}
                                                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full"
                                            >
                                                <X size={12} />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-[10px] text-center py-0.5">
                                                New
                                            </div>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
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
                                <p className="text-xs text-muted-foreground">
                                    Upload up to 10 images for the homepage slider. Recommended size: 1920x1080px.
                                </p>
                            </div>


                        </div>
                    </div>
                )}

                {/* Bottom Save Bar */}
                <div className="p-6 md:p-8 bg-secondary/5 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        Changes are saved only when you click "Save Settings"
                    </p>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 ml-auto"
                    >
                        {isSaving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Check size={16} />
                        )}
                        {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
