"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, UploadCloud, Plus, X, Video, ImageIcon, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id;
    const fileInputRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    const [existingImages, setExistingImages] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [newPreviews, setNewPreviews] = useState([]);

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");
    const [isPopular, setIsPopular] = useState(false);
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [sqft, setSqft] = useState("");
    const [floors, setFloors] = useState("");
    const [amenities, setAmenities] = useState([]);
    const [newAmenity, setNewAmenity] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [projectRes, categoriesRes] = await Promise.all([
                    fetch(`${apiUrl}/frames/${projectId}`),
                    fetch(`${apiUrl}/categories`),
                ]);

                if (!projectRes.ok) throw new Error("Project not found");

                const project = await projectRes.json();
                setTitle(project.title || "");
                setLocation(project.location || "");
                setPrice(project.price || "");
                setDescription(project.description || "");
                setStatus(project.status || "active");
                setIsPopular(project.is_popular === 1 || project.is_popular === true);
                setVideoUrl(project.video_url || "");
                setSelectedCategoryId(project.category_id ? String(project.category_id) : "");
                setBedrooms(project.bedrooms ? String(project.bedrooms) : "");
                setBathrooms(project.bathrooms ? String(project.bathrooms) : "");
                setSqft(project.sqft ? String(project.sqft) : "");
                setFloors(project.floors ? String(project.floors) : "");
                if (project.amenities) {
                    try {
                        const a = typeof project.amenities === "string" ? JSON.parse(project.amenities) : project.amenities;
                        setAmenities(Array.isArray(a) ? a : []);
                    } catch { setAmenities([]); }
                }

                if (project.images) {
                    try {
                        const imgs = typeof project.images === "string" ? JSON.parse(project.images) : project.images;
                        setExistingImages(Array.isArray(imgs) ? imgs : []);
                    } catch {
                        if (project.image_url) setExistingImages([project.image_url]);
                    }
                } else if (project.image_url) {
                    setExistingImages([project.image_url]);
                }

                if (categoriesRes.ok) {
                    setCategories(await categoriesRes.json());
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [apiUrl, projectId]);

    const handleAddAmenity = () => {
        if (newAmenity.trim()) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity("");
        }
    };

    const handleRemoveAmenity = (indexToRemove) => {
        setAmenities(amenities.filter((_, idx) => idx !== indexToRemove));
    };

    const handleFileSelect = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);
            const previews = newFiles.map((file) => URL.createObjectURL(file));
            setNewPreviews((prev) => [...prev, ...previews]);
        }
    };

    const handleRemoveExistingImage = (idx) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleRemoveNewImage = (idx) => {
        URL.revokeObjectURL(newPreviews[idx]);
        setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
        setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
            if (newFiles.length > 0) {
                setSelectedFiles((prev) => [...prev, ...newFiles]);
                const previews = newFiles.map((file) => URL.createObjectURL(file));
                setNewPreviews((prev) => [...prev, ...previews]);
            }
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Project title is required.");
            return;
        }

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category_id", selectedCategoryId || "");
            formData.append("is_popular", String(isPopular));
            formData.append("status", status);
            formData.append("location", location);
            formData.append("price", price);
            formData.append("bedrooms", bedrooms);
            formData.append("bathrooms", bathrooms);
            formData.append("sqft", sqft);
            formData.append("floors", floors);
            formData.append("amenities", JSON.stringify(amenities));

            if (videoUrl.trim()) {
                formData.append("video_url", videoUrl.trim());
            } else {
                formData.append("video_url", "");
            }

            for (const file of selectedFiles) {
                formData.append("images", file);
            }

            const res = await fetch(`${apiUrl}/frames/${projectId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update project");
            }

            setSuccess("Project updated successfully!");
            setTimeout(() => router.push("/admin/projects"), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    Loading project...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft size={20} />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Edit Project</h1>
                    <p className="text-muted-foreground mt-1">Update the details for this property listing.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <form
                    className="divide-y divide-border"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    {error && (
                        <div className="p-4 mx-6 mt-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 mx-6 mt-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm text-center">
                            {success}
                        </div>
                    )}

                    <div className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Project Title <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. The Oasis Residences"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Location <span className="text-destructive">*</span></label>
                                <input type="text" placeholder="e.g. Gulshan, Dhaka" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Price</label>
                                <input type="text" placeholder="e.g. $1,200,000 or 'Contact for Price'" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer"
                                >
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="trash">Trash</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <select
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground cursor-pointer"
                                    value={selectedCategoryId}
                                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2 flex items-end">
                                <label className="flex items-center gap-3 cursor-pointer p-3">
                                    <input
                                        type="checkbox"
                                        checked={isPopular}
                                        onChange={(e) => setIsPopular(e.target.checked)}
                                        className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-foreground">Mark as Popular</span>
                                </label>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-foreground">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Detailed description of the property..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground resize-y"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6 bg-secondary/10">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Property Statistics</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bedrooms</label>
                                <input type="number" min="0" placeholder="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bathrooms</label>
                                <input type="number" min="0" placeholder="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Square Feet</label>
                                <input type="number" min="0" placeholder="e.g. 2500" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Total Floors</label>
                                <input type="number" min="0" placeholder="0" value={floors} onChange={(e) => setFloors(e.target.value)} className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                            {amenities.map((amenity, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full text-sm text-foreground">
                                    <span>{amenity}</span>
                                    <button type="button" onClick={() => handleRemoveAmenity(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newAmenity}
                                onChange={(e) => setNewAmenity(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                placeholder="Add a feature (e.g. 24/7 Security)"
                                className="flex-1 max-w-sm p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                            />
                            <Button type="button" variant="outline" onClick={handleAddAmenity} className="gap-2">
                                <Plus size={16} /> Add
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <ImageIcon size={20} className="text-primary" />
                            Property Images
                        </h3>

                        {existingImages.length > 0 && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-3">Current Images</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {existingImages.map((url, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-secondary/20">
                                            <img src={url} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                                            {idx === 0 && (
                                                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                                                    Thumbnail
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(idx)}
                                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {newPreviews.length > 0 && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-3">New Images to Upload</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {newPreviews.map((preview, idx) => (
                                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-primary/40 bg-primary/5">
                                            <img src={preview} alt={`New ${idx + 1}`} className="w-full h-full object-cover" />
                                            <span className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs px-2 py-0.5 rounded">
                                                New
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewImage(idx)}
                                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center bg-background/50 hover:bg-secondary/20 transition-colors cursor-pointer"
                        >
                            <UploadCloud size={40} className="text-muted-foreground mb-4" />
                            <h4 className="font-medium text-foreground mb-1">
                                {existingImages.length > 0 || newPreviews.length > 0 ? "Add More Images" : "Upload Property Images"}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-4">Drag and drop images here, or click to browse</p>
                            <Button type="button" variant="outline" size="sm">Select Files</Button>
                            <p className="text-xs text-muted-foreground mt-4">JPG, PNG, WEBP up to 5MB each · Max 10 images</p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                        <h3 className="text-lg font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
                            <Video size={20} className="text-primary" />
                            Video Tour
                        </h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">YouTube Video URL</label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground"
                            />
                        </div>
                        {videoUrl && videoUrl.includes("youtube") && (
                            <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoUrl.includes("v=") ? videoUrl.split("v=")[1]?.split("&")[0] : videoUrl.split("/").pop()}`}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title="Video preview"
                                />
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8 bg-secondary/5 flex items-center justify-end gap-4">
                        <Link href="/admin/projects">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting} className="gap-2">
                            <Save size={16} />
                            {isSubmitting ? "Updating..." : "Update Project"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
