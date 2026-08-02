"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, Save, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TestimonialManager() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(5);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [existingImage, setExistingImage] = useState("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    const fetchTestimonials = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/testimonials`);
            if (!res.ok) throw new Error("Failed to load testimonials");
            const data = await res.json();
            setTestimonials(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setName("");
        setDesignation("");
        setReview("");
        setRating(5);
        setSelectedFile(null);
        setPreviewUrl("");
        setExistingImage("");
    };

    const handleEditClick = (testimonial) => {
        setIsEditing(true);
        setEditId(testimonial.id);
        setName(testimonial.name || "");
        setDesignation(testimonial.designation || "");
        setReview(testimonial.review || "");
        setRating(testimonial.rating || 5);
        setExistingImage(testimonial.image_url || "");
        setSelectedFile(null);
        setPreviewUrl("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !review.trim()) {
            setError("Name and review details are required.");
            return;
        }

        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", name);
            formData.append("designation", designation);
            formData.append("review", review);
            formData.append("rating", rating);
            if (selectedFile) {
                formData.append("image", selectedFile);
            } else {
                formData.append("image_url", existingImage);
            }

            const url = editId ? `${apiUrl}/testimonials/${editId}` : `${apiUrl}/testimonials`;
            const method = editId ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to submit testimonial");
            }

            setSuccess(editId ? "Testimonial updated successfully!" : "Testimonial added successfully!");
            resetForm();
            fetchTestimonials();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}/testimonials/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to delete testimonial");

            setSuccess("Testimonial deleted successfully!");
            fetchTestimonials();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Customer Testimonials</h1>
                    <p className="text-muted-foreground mt-1">Manage ratings and feedback displayed on the client website.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Panel */}
                <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 h-fit space-y-6">
                    <h3 className="text-lg font-bold text-foreground border-b border-border pb-2">
                        {isEditing ? "Edit Testimonial" : "Add Testimonial"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Client Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Sarah Jenkins"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Designation / Company</label>
                            <input
                                type="text"
                                placeholder="e.g. CEO, Apex Tech"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Rating</label>
                            <div className="flex gap-2 items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="text-amber-500 hover:scale-110 transition-transform"
                                    >
                                        <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Review / Feedback *</label>
                            <textarea
                                rows={4}
                                placeholder="Write the customer's experience and reviews here..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary text-foreground text-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground block">Client Avatar Image</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-full border border-border bg-secondary/20 flex items-center justify-center overflow-hidden shrink-0">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    ) : existingImage ? (
                                        <img src={existingImage} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="text-muted-foreground" size={24} />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="avatar-image-upload"
                                    />
                                    <label
                                        htmlFor="avatar-image-upload"
                                        className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium hover:bg-secondary/50 cursor-pointer text-foreground block w-fit"
                                    >
                                        Upload Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-border">
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={resetForm} className="w-full">
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                                <Save size={16} />
                                {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Save"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Listing Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Testimonials List</h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground bg-card border border-border rounded-xl">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <span>Loading client reviews...</span>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-card border border-border rounded-xl">
                            No testimonials found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {testimonials.map((test) => (
                                <div key={test.id} className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm relative group">
                                    <div className="space-y-3">
                                        {/* Stars */}
                                        <div className="flex gap-1">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <Star
                                                    key={idx}
                                                    size={16}
                                                    className="text-amber-500"
                                                    fill={idx < test.rating ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-muted-foreground text-sm italic line-clamp-4">
                                            "{test.review}"
                                        </p>
                                    </div>

                                    {/* Author Profile */}
                                    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-secondary/20 shrink-0">
                                                {test.image_url ? (
                                                    <img src={test.image_url} alt={test.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-primary bg-primary/10">
                                                        {test.name[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="block text-sm font-semibold text-foreground leading-tight">{test.name}</span>
                                                <span className="text-xs text-muted-foreground leading-none">{test.designation}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditClick(test)}
                                                className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                                                title="Edit Testimonial"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(test.id)}
                                                className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                                                title="Delete Testimonial"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
